import React, {
  Dispatch, EffectCallback, useEffect, useMemo, useRef, useState
} from 'react';
import {
  EmitterSubscription,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  NavigationProp, RouteProp, useNavigation, useRoute
} from '@react-navigation/native';
import { partition } from 'lodash';
import moment from 'moment';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { trackEvent } from 'appcenter-analytics';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { validateSession } from '../../utils/sessionTimeout';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import COLOR from '../../themes/Color';
import styles from './ManagePallet.style';
import { strings } from '../../locales';
import ManualScan from '../../components/manualscan/ManualScan';
import PalletExpiration from '../../components/PalletExpiration/PalletExpiration';
import { barcodeEmitter } from '../../utils/scannerUtils';
import {
  addPalletUPCs, clearPallet, deleteUpcs, getItemDetails, updatePalletItemQty
} from '../../state/actions/saga';
import { AsyncState } from '../../models/AsyncState';
import BottomSheetPrintCard from '../../components/BottomSheetPrintCard/BottomSheetPrintCard';
import BottomSheetAddCard from '../../components/BottomSheetAddCard/BottomSheetAddCard';
import BottomSheetClearCard from '../../components/BottomSheetClearCard/BottomSheetClearCard';
import Button from '../../components/buttons/Button';
import { Pallet, PalletInfo, PalletItem } from '../../models/PalletManagementTypes';
import {
  addItemToPallet,
  deleteItem,
  removeItem,
  resetItems,
  setPalletItemNewQuantity,
  setPalletNewExpiration,
  setupPallet,
  showManagePalletMenu,
  updateItems,
  updatePalletExpirationDate
} from '../../state/actions/PalletManagement';
import PalletItemCard from '../../components/PalletItemCard/PalletItemCard';
import {
  ADD_PALLET_UPCS, CLEAR_PALLET, DELETE_UPCS, GET_ITEM_DETAILS, UPDATE_PALLET_ITEM_QTY
} from '../../state/actions/asyncAPI';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { setPrintingPalletLabel } from '../../state/actions/Print';
import ApiConfirmationModal from '../Modal/ApiConfirmationModal';

const TRY_AGAIN = 'GENERICS.TRY_AGAIN';

interface ManagePalletProps {
  dispatch: Dispatch<any>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  isManualScanEnabled: boolean;
  palletInfo: PalletInfo;
  items: PalletItem[];
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  getItemDetailsApi: AsyncState;
  addPalletUpcApi: AsyncState;
  updateItemQtyAPI: AsyncState;
  deleteUpcsApi: AsyncState;
  getPalletInfoApi: AsyncState;
  clearPalletApi: AsyncState;
  displayClearConfirmation: boolean;
  setDisplayClearConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  perishableCategories: number[];
  isPickerShow: boolean;
  setIsPickerShow: React.Dispatch<React.SetStateAction<boolean>>;
}
interface ApiResult {
  data: any;
  status: number;
  headers: Record<string, any>;
  config: any;
  request: Record<string, any>;
}

export const getNumberOfDeleted = (items: PalletItem[]): number => items.reduce(
  (previousValue, currentValue) => previousValue + +currentValue.deleted, 0
);

export const isQuantityChanged = (
  item: PalletItem
): boolean => !!(item.newQuantity && item.newQuantity !== item.quantity);

export const isExpiryDateChanged = (palletInfo: PalletInfo): boolean => !!(
  palletInfo.newExpirationDate && palletInfo.newExpirationDate !== palletInfo.expirationDate?.trim()
);

const dateOfExpirationDate = (stringDate?: string): Date => (stringDate ? new Date(stringDate) : new Date());

const enableSave = (items: PalletItem[], palletInfo: PalletInfo): boolean => {
  const isItemsModified = items.some((item: PalletItem) => isQuantityChanged(item)
    || item.deleted || item.added);
  return isItemsModified || isExpiryDateChanged(palletInfo);
};

export const handleDecreaseQuantity = (item: PalletItem, dispatch: Dispatch<any>): void => {
  const currentQuantity = item.newQuantity || item.quantity;
  if (currentQuantity === 1) {
    // TODO delete item flow
    // don't forget to ask user if want to delete
  } else {
    dispatch(setPalletItemNewQuantity(item.itemNbr.toString(), currentQuantity - 1));
  }
};

export const handleIncreaseQuantity = (item: PalletItem, dispatch: Dispatch<any>): void => {
  const currentQuantity = item.newQuantity || item.quantity;
  dispatch(setPalletItemNewQuantity(item.itemNbr.toString(), currentQuantity + 1));
};

export const handleTextChange = (item: PalletItem, dispatch: Dispatch<any>, text: string): void => {
  // have had issues with not putting 10 as radix with parseInt
  const newQuantity = Number.parseInt(text, 10);
  if (newQuantity === 0) {
    // TODO delete item flow
  } else if (newQuantity < 0) {
    Toast.show({
      type: 'error',
      text1: strings('PALLET.CANNOT_HAVE_NEGATIVE_QTY'),
      position: 'bottom',
      visibilityTime: 3000
    });
  } else {
    dispatch(setPalletItemNewQuantity(item.itemNbr.toString(), newQuantity));
  }
};

const isPerishableItemExist = (items: PalletItem[], perishableCategories: number[]): boolean => (
  items.some(item => item.categoryNbr && perishableCategories.includes(item.categoryNbr))
);

export const removeExpirationDate = (items: PalletItem[], perishableCategories: number[]): boolean => {
  const [deletedItems, otherItemsInPallet] = partition(items, item => item.deleted);
  const deletedPerishableItem = isPerishableItemExist(deletedItems, perishableCategories);
  const perishableExistsInPallet = isPerishableItemExist(otherItemsInPallet, perishableCategories);
  return deletedPerishableItem && !perishableExistsInPallet;
};

const isPerishableItemDeleted = (items: PalletItem[], perishableCategories: number[]): boolean => {
  const deletedItems = items.filter(item => item.deleted);
  return isPerishableItemExist(deletedItems, perishableCategories);
};

const deleteItemDetail = (item: PalletItem, dispatch: Dispatch<any>) => {
  // Remove item from redux if this item was being added to pallet
  if (item.added) {
    dispatch(removeItem(item.itemNbr.toString()));
  } else {
    dispatch(deleteItem(item.itemNbr.toString()));
  }
};

const undoDelete = (dispatch: Dispatch<any>) => {
  dispatch(resetItems());
};

export const isAddedItemPerishable = (items: PalletItem[], perishableCategories: number[]) => {
  const addedItems = items.filter(item => item.added);
  return isPerishableItemExist(addedItems, perishableCategories);
};

const itemCard = ({ item }: { item: PalletItem }, dispatch: Dispatch<any>) => {
  if (!item.deleted) {
    return (
      <PalletItemCard
        decreaseQuantity={() => handleDecreaseQuantity(item, dispatch)}
        increaseQuantity={() => handleIncreaseQuantity(item, dispatch)}
        onTextChange={text => handleTextChange(item, dispatch, text)}
        deleteItem={() => deleteItemDetail(item, dispatch)}
        isAdded={item.added}
        isValid={true}
        itemName={item.itemDesc}
        itemNumber={item.itemNbr.toString()}
        markEdited={isQuantityChanged(item)}
        maxValue={9999}
        minValue={0}
        numberOfItems={item.newQuantity || item.quantity}
        price={item.price}
        upc={item.upcNbr}
      />
    );
  }
  return null;
};

export const handleUpdateItems = (
  items: PalletItem[], palletInfo: PalletInfo, dispatch: Dispatch<any>, updatedExpirationDate?: string
): void => {
  const updatePalletItems = items.filter(item => isQuantityChanged(item) && !item.added && !item.deleted)
    .map(item => ({ ...item, quantity: item.newQuantity ?? item.quantity }));

  const isAddNoUpdate = items.some(item => item.added) && !updatePalletItems.length;

  if (updatePalletItems.length > 0 || (isExpiryDateChanged(palletInfo) && !isAddNoUpdate)) {
    dispatch(updatePalletItemQty({
      palletId: palletInfo.id,
      palletItem: updatePalletItems,
      palletExpiration: updatedExpirationDate
    }));
  }
};

export const handleAddItems = (
  id: number,
  items: PalletItem[],
  dispatch: Dispatch<any>,
  expirationDate?: string
): void => {
  // Filter Items by added flag
  const addPalletItems = items.filter(item => item.added)
    .map(item => ({ ...item, quantity: item.newQuantity ?? item.quantity }));

  if (addPalletItems.length > 0) {
    dispatch(addPalletUPCs({ palletId: id, items: addPalletItems, expirationDate }));
  }
};

export const getPalletInfoApiHook = (
  getPalletInfoApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>
): void => {
  if (navigation.isFocused()) {
    // on api success
    if (!getPalletInfoApi.isWaiting && getPalletInfoApi.result) {
      if (getPalletInfoApi.result.status === 200) {
        const {
          id, createDate, expirationDate, items
        } = getPalletInfoApi.result.data.pallets[0];
        const palletItems: PalletItem[] = items.map((item: PalletItem) => ({
          ...item,
          quantity: item.quantity || 0,
          newQuantity: item.quantity || 0,
          deleted: false,
          added: false
        }));
        const palletDetails: Pallet = {
          palletInfo: {
            id,
            createDate,
            expirationDate
          },
          items: palletItems
        };
        dispatch(setupPallet(palletDetails));
        dispatch(hideActivityModal());
        dispatch({ type: 'API/GET_PALLET_INFO/RESET' });
      } else if (getPalletInfoApi.result.status === 204) {
        Toast.show({
          type: 'error',
          text1: strings('LOCATION.PALLET_NOT_FOUND'),
          visibilityTime: 3000,
          position: 'bottom'
        });
      }
    }
    // on api error
    if (getPalletInfoApi.error) {
      dispatch(hideActivityModal());
      Toast.show({
        type: 'error',
        text1: strings('PALLET.PALLET_DETAILS_ERROR'),
        text2: strings(TRY_AGAIN),
        visibilityTime: 4000,
        position: 'bottom'
      });
      dispatch({ type: 'API/GET_PALLET_INFO/RESET' });
    }
  }
  // api is Loading
  if (getPalletInfoApi.isWaiting) {
    dispatch(showActivityModal());
  }
};
// Api response type guard
const isSuccessResult = (response: ApiResult | string): response is ApiResult => (
  typeof (response) === 'object');

export const updatePalletApisHook = (
  addPalletUpcApi: AsyncState,
  updateItemQtyAPI: AsyncState,
  deleteUpcsApi: AsyncState,
  items: PalletItem[],
  dispatch: Dispatch<any>,
  newExpirationDate?: string
): void => {
  const addResponse: ApiResult | string = (addPalletUpcApi.result ?? addPalletUpcApi.error);
  const updateResponse: ApiResult | string = (updateItemQtyAPI.result ?? updateItemQtyAPI.error);
  const deleteResponse: ApiResult | string = (deleteUpcsApi.result ?? deleteUpcsApi.error);

  const isLoading = addPalletUpcApi.isWaiting || deleteUpcsApi.isWaiting || updateItemQtyAPI.isWaiting;
  const totalResponses: Map<'ERROR' | 'SUCCESS', any> = new Map();

  let newPalletItems = [...items];
  if (isLoading) {
    dispatch(showActivityModal());
  }

  if (!isLoading && addResponse) {
    if (isSuccessResult(addResponse) && addResponse.status === 200) {
      totalResponses.set('SUCCESS', addResponse);
      newPalletItems = newPalletItems.map(item => {
        if (item.added) {
          return {
            ...item,
            added: false,
            quantity: item.newQuantity ?? item.quantity
          };
        }
        return item;
      });
    } else {
      totalResponses.set('ERROR', addResponse);
    }
  }
  if (!isLoading && updateResponse) {
    if (isSuccessResult(updateResponse) && updateResponse.status === 200) {
      totalResponses.set('SUCCESS', updateResponse);
      newPalletItems = newPalletItems.map(item => {
        if (!item.added && !item.deleted) {
          return {
            ...item,
            quantity: item.newQuantity ?? item.quantity
          };
        }
        return item;
      });
    } else {
      totalResponses.set('ERROR', updateResponse);
    }
  }
  if (!isLoading && deleteResponse) {
    if (isSuccessResult(deleteResponse) && deleteResponse.status === 200) {
      totalResponses.set('SUCCESS', deleteResponse);
      const deleteIndexes: number[] = [];
      // Finds Index for each deleted item
      newPalletItems.forEach((item, index) => {
        if (item.deleted) {
          deleteIndexes.push(index);
        }
      });
      // Reverses the array of indexes to remove the correct elements
      if (deleteIndexes.length > 1) {
        deleteIndexes.reverse();
      }
      deleteIndexes.forEach(index => newPalletItems.splice(index, 1));
    } else {
      totalResponses.set('ERROR', deleteResponse);
    }
  }
  if (!isLoading && (addResponse || updateResponse || deleteResponse)) {
    // Updates Pallet Items State with successful responses
    dispatch(updateItems(newPalletItems));
    // Orchestrates Toast Message Response
    if (totalResponses.size > 1) {
      Toast.show({
        type: 'info',
        text1: strings('PALLET.SAVE_PALLET_PARTIAL'),
        text2: strings(TRY_AGAIN),
        position: 'bottom'
      });
    } else if (totalResponses.keys().next().value === 'SUCCESS') {
      if (newExpirationDate) {
        dispatch(updatePalletExpirationDate());
      }
      Toast.show({
        type: 'success',
        text1: strings('PALLET.SAVE_PALLET_SUCCESS'),
        position: 'bottom'
      });
    } else {
      Toast.show({
        type: 'error',
        text1: strings('PALLET.SAVE_PALLET_FAILURE'),
        text2: strings(TRY_AGAIN),
        position: 'bottom'
      });
    }
    // Clear APIs
    dispatch(hideActivityModal());
    dispatch({ type: ADD_PALLET_UPCS.RESET });
    dispatch({ type: UPDATE_PALLET_ITEM_QTY.RESET });
    dispatch({ type: DELETE_UPCS.RESET });
  }
};

export const clearPalletApiHook = (
  clearPalletApi: AsyncState,
  palletId: number,
  navigation: NavigationProp<any>,
  dispatch: Dispatch<any>,
  setDisplayClearConfirmation: React.Dispatch<React.SetStateAction<boolean>>,
): void => {
  if (navigation.isFocused()) {
    if (!clearPalletApi.isWaiting) {
      // Success
      if (clearPalletApi.result) {
        dispatch(hideActivityModal());
        setDisplayClearConfirmation(false);
        dispatch({ type: CLEAR_PALLET.RESET });
        Toast.show({
          type: 'success',
          text1: strings('PALLET.CLEAR_PALLET_SUCCESS', { palletId }),
          position: 'bottom'
        });
        navigation.goBack();
      }

      // Failure
      if (clearPalletApi.error) {
        dispatch(hideActivityModal());
        setDisplayClearConfirmation(false);
        dispatch({ type: CLEAR_PALLET.RESET });
        Toast.show({
          type: 'error',
          text1: strings('PALLET.CLEAR_PALLET_ERROR'),
          text2: strings(TRY_AGAIN),
          position: 'bottom'
        });
      }
    } else {
      dispatch(showActivityModal());
    }
  }
};

export const getItemDetailsApiHook = (
  getItemDetailsApi: AsyncState,
  items: PalletItem[],
  dispatch: Dispatch<any>
) => {
  // on api success
  if (!getItemDetailsApi.isWaiting && getItemDetailsApi.result) {
    if (getItemDetailsApi.result.status === 200) {
      const {
        data
      } = getItemDetailsApi.result;
      const palletItem = items.filter(item => item.itemNbr === data.itemNbr);
      if (palletItem.length > 0) {
        Toast.show({
          type: 'info',
          text1: strings('PALLET.ITEMS_DETAILS_EXIST'),
          visibilityTime: 4000,
          position: 'bottom'
        });
      } else {
        const {
          upcNbr,
          itemNbr,
          price,
          itemName,
          categoryNbr,
          categoryDesc
        } = data;
        const pallet: PalletItem = {
          upcNbr,
          itemNbr,
          price,
          categoryNbr,
          categoryDesc,
          itemDesc: itemName,
          quantity: 1,
          deleted: false,
          added: true
        };

        dispatch(addItemToPallet(pallet));
      }
    } else if (getItemDetailsApi.result.status === 204) {
      Toast.show({
        type: 'info',
        text1: strings('PALLET.ITEMS_NOT_FOUND'),
        visibilityTime: 4000,
        position: 'bottom'
      });
    }
    dispatch(hideActivityModal());
  }
  // on api error
  if (!getItemDetailsApi.isWaiting && getItemDetailsApi.error) {
    dispatch(hideActivityModal());
    Toast.show({
      type: 'error',
      text1: strings('PALLET.ITEMS_DETAILS_ERROR'),
      text2: strings(TRY_AGAIN),
      visibilityTime: 4000,
      position: 'bottom'
    });
  }
  // on api request
  if (getItemDetailsApi.isWaiting) {
    dispatch(showActivityModal());
  }
};

export const ManagePalletScreen = (props: ManagePalletProps): JSX.Element => {
  const {
    useEffectHook, isManualScanEnabled, palletInfo, items, navigation,
    route, dispatch, getItemDetailsApi, updateItemQtyAPI,
    deleteUpcsApi, addPalletUpcApi, getPalletInfoApi, clearPalletApi,
    displayClearConfirmation, setDisplayClearConfirmation, setIsPickerShow,
    isPickerShow, perishableCategories
  } = props;
  const { id, expirationDate, newExpirationDate } = palletInfo;

  let scannedSubscription: EmitterSubscription;

  // Clear API state before leaving this screen
  useEffectHook(() => navigation.addListener('beforeRemove', () => {
    // Suggestion add confirmation before leaving screen if they want to undo unsaved changes
    dispatch({ type: GET_ITEM_DETAILS.RESET });
  }), []);

  // Scanner listener
  useEffectHook(() => {
    scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused()) {
        validateSession(navigation, route.name).then(() => {
          trackEvent('Items_Details_scanned', {
            barcode: scan.value,
            type: scan.type
          });
          dispatch(getItemDetails({ id: scan.value, getSummary: false }));
        });
      }
    });
    return () => {
      scannedSubscription.remove();
    };
  }, []);

  // Orchestrated API Calls
  useEffectHook(() => updatePalletApisHook(
    addPalletUpcApi,
    updateItemQtyAPI,
    deleteUpcsApi,
    items,
    dispatch,
    newExpirationDate
  ), [addPalletUpcApi, deleteUpcsApi, updateItemQtyAPI]);
  // Get Item Details UPC api
  useEffectHook(() => getItemDetailsApiHook(
    getItemDetailsApi,
    items,
    dispatch
  ), [getItemDetailsApi]);

  // update pallet hook (get pallet info api)
  useEffectHook(() => getPalletInfoApiHook(
    getPalletInfoApi,
    dispatch,
    navigation
  ), [getPalletInfoApi]);

  useEffectHook(() => clearPalletApiHook(
    clearPalletApi,
    id,
    navigation,
    dispatch,
    setDisplayClearConfirmation
  ), [clearPalletApi]);

  const submit = () => {
    const palletId = id;
    const reducerInitialValue: string[] = [];
    const addExpiry = isExpiryDateChanged(palletInfo) ? newExpirationDate : expirationDate;
    const removeExpirationDateForPallet = removeExpirationDate(items, perishableCategories);
    // updated expiration date
    const updatedExpirationDate = addExpiry ? `${moment(addExpiry).format('YYYY-MM-DDT00:00:00.000')}Z` : undefined;
    // Filter Items by deleted flag
    const upcs = items.filter(item => item.deleted && !item.added).reduce((reducer, current) => {
      reducer.push(current.upcNbr);
      return reducer;
    }, reducerInitialValue);
    const payload = {
      palletId,
      upcs,
      expirationDate: (!removeExpirationDateForPallet && addExpiry)
        ? updatedExpirationDate : undefined,
      removeExpirationDate: removeExpirationDateForPallet
    };

    if (upcs.length > 0) {
      dispatch(deleteUpcs(payload));
    }

    // Calls add items to pallet via api
    handleAddItems(
      palletId,
      items,
      dispatch,
      updatedExpirationDate
    );
    // Calls update pallet item qty api
    handleUpdateItems(items, palletInfo, dispatch, updatedExpirationDate);
  };

  const handleUnhandledTouches = () => {
    Keyboard.dismiss();
    return false;
  };

  const onDatePickerChange = (event: DateTimePickerEvent, value: Date| undefined) => {
    const { type } = event;
    const newDate = value && moment(value).format('MM/DD/YYYY');
    setIsPickerShow(false);
    if (type === 'set' && newDate && newDate !== expirationDate) {
      dispatch(setPalletNewExpiration(newDate));
    }
  };
  const isRemoveExpirationDate = removeExpirationDate(items, perishableCategories);
  const isAddedPerishable = isAddedItemPerishable(items, perishableCategories);
  return (
    <KeyboardAvoidingView
      style={styles.safeAreaView}
      behavior="height"
      keyboardVerticalOffset={110}
      onStartShouldSetResponder={handleUnhandledTouches}
    >
      <ApiConfirmationModal
        isVisible={displayClearConfirmation}
        onClose={() => setDisplayClearConfirmation(false)}
        cancelText={strings('GENERICS.NO')}
        api={clearPalletApi}
        mainText={strings('PALLET.CLEAR_PALLET_CONFIRMATION')}
        handleConfirm={() => {
          setDisplayClearConfirmation(false);
          dispatch(clearPallet({ palletId: id }));
        }}
        confirmText={strings('GENERICS.YES')}
      />
      <View style={styles.bodyContainer}>
        {isManualScanEnabled && <ManualScan placeholder={strings('GENERICS.ENTER_UPC_ITEM_NBR')} />}
        <View style={styles.headerContainer}>
          <View style={styles.headerItem}>
            <Text style={styles.headerText}>{strings('PALLET.PALLET_ID')}</Text>
            <Text style={styles.headerItemText}>{id}</Text>
          </View>
          {(isPerishableItemExist(items, perishableCategories)) && (
            <PalletExpiration
              expirationDate={expirationDate}
              newExpirationDate={newExpirationDate}
              dateChanged={isExpiryDateChanged(palletInfo) || isAddedPerishable || isRemoveExpirationDate
              || isPerishableItemDeleted(items, perishableCategories)}
              dateRemoved={isRemoveExpirationDate}
              showPicker={isPickerShow}
              setShowPicker={setIsPickerShow}
              onDateChange={onDatePickerChange}
            />
          )}
          <View style={styles.headerItem}>
            <Text style={styles.headerText}>{strings('LOCATION.ITEMS')}</Text>
            <Text style={styles.headerItemText}>{items.length}</Text>
          </View>
        </View>
        <View style={styles.instructionLabel}>
          <Text style={styles.instructionLabelText}>
            {strings('PALLET.SCAN_INSTRUCTIONS')}
          </Text>
        </View>
        {getNumberOfDeleted(items) > 0 ? (
          <View style={styles.deletedBanner}>
            <Text style={styles.deleteBannerText}>
              {getNumberOfDeleted(items) === 1 ? strings('PALLET.ITEM_DELETE')
                : strings('PALLET.X_ITEMS_DELETE', { nbrOfItems: getNumberOfDeleted(items) })}
            </Text>
            <TouchableOpacity onPress={() => undoDelete(dispatch)}>
              <Text style={styles.undoText}>{strings('GENERICS.UNDO')}</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <View style={styles.container}>
          <FlatList
            data={items}
            removeClippedSubviews={false}
            renderItem={item => itemCard(item, dispatch)}
            keyExtractor={(item: PalletItem) => item.upcNbr}
          />
        </View>
      </View>
      {items && enableSave(items, palletInfo) ? (
        <View style={styles.buttonContainer}>
          <Button
            title={strings('GENERICS.SAVE')}
            style={styles.saveButton}
            backgroundColor={COLOR.GREEN}
            onPress={() => submit()}
            disabled={isAddedPerishable && !(newExpirationDate || expirationDate)}
          />
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
};

const ManagePallet = (): JSX.Element => {
  const {
    palletInfo, managePalletMenu, items, perishableCategories
  } = useTypedSelector(state => state.PalletManagement);
  const isManualScanEnabled = useTypedSelector(state => state.Global.isManualScanEnabled);
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const getItemDetailsApi = useTypedSelector(state => state.async.getItemDetails);
  const addPalletUpcApi = useTypedSelector(state => state.async.addPalletUPCs);
  const updateItemQtyAPI = useTypedSelector(state => state.async.updatePalletItemQty);
  const deleteUpcsApi = useTypedSelector(state => state.async.deleteUpcs);
  const getPalletInfoApi = useTypedSelector(state => state.async.getPalletInfo);
  const clearPalletApi = useTypedSelector(state => state.async.clearPallet);
  const [displayClearConfirmation, setDisplayClearConfirmation] = useState(false);
  const [isPickerShow, setIsPickerShow] = useState(false);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['45%'], []);

  useEffect(() => {
    if (navigation.isFocused() && bottomSheetModalRef.current) {
      if (managePalletMenu) {
        bottomSheetModalRef.current.present();
      } else {
        bottomSheetModalRef.current.dismiss();
      }
    }
  }, [managePalletMenu]);

  const handlePrintPallet = () => {
    dispatch(showManagePalletMenu(false));
    bottomSheetModalRef.current?.dismiss();
    dispatch(setPrintingPalletLabel());
    navigation.navigate('PrintPriceSign');
  };

  const handleCombinePallets = () => {
    dispatch(showManagePalletMenu(false));
    bottomSheetModalRef.current?.dismiss();
    navigation.navigate('CombinePallets');
  };

  const handleClearPallet = () => {
    dispatch(showManagePalletMenu(false));
    setDisplayClearConfirmation(true);
  };

  return (
    <BottomSheetModalProvider>
      <TouchableOpacity
        onPress={() => dispatch(showManagePalletMenu(!managePalletMenu))}
        activeOpacity={1}
        disabled={!managePalletMenu}
        style={managePalletMenu ? styles.disabledContainer : styles.safeAreaView}
      >
        <ManagePalletScreen
          dispatch={dispatch}
          useEffectHook={useEffect}
          isManualScanEnabled={isManualScanEnabled}
          palletInfo={palletInfo}
          items={items}
          navigation={navigation}
          route={route}
          getItemDetailsApi={getItemDetailsApi}
          addPalletUpcApi={addPalletUpcApi}
          updateItemQtyAPI={updateItemQtyAPI}
          deleteUpcsApi={deleteUpcsApi}
          getPalletInfoApi={getPalletInfoApi}
          clearPalletApi={clearPalletApi}
          displayClearConfirmation={displayClearConfirmation}
          setDisplayClearConfirmation={setDisplayClearConfirmation}
          perishableCategories={perishableCategories}
          isPickerShow={isPickerShow}
          setIsPickerShow={setIsPickerShow}
        />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          index={0}
          style={styles.bottomSheetModal}
          onDismiss={() => dispatch(showManagePalletMenu(false))}
        >
          <BottomSheetPrintCard
            isVisible={true}
            onPress={handlePrintPallet}
            text={strings('PALLET.PRINT_PALLET')}
          />
          <BottomSheetAddCard
            isManagerOption={false}
            isVisible={true}
            text={strings('PALLET.COMBINE_PALLETS')}
            onPress={handleCombinePallets}
          />
          <BottomSheetClearCard
            isManagerOption={false}
            isVisible={true}
            text={strings('PALLET.CLEAR_PALLET')}
            onPress={handleClearPallet}
          />
        </BottomSheetModal>
      </TouchableOpacity>
    </BottomSheetModalProvider>
  );
};

export default ManagePallet;
