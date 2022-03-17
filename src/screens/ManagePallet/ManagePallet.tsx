import React, {
  Dispatch, EffectCallback, useEffect, useMemo, useRef, useState
} from 'react';
import {
  EmitterSubscription,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  NavigationProp, RouteProp, useNavigation, useRoute
} from '@react-navigation/native';
import { isEmpty } from 'lodash';
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
import { barcodeEmitter } from '../../utils/scannerUtils';
import {
  addPalletUPCs, clearPallet, deleteUpcs, getItemDetails, getPalletConfig, updatePalletItemQty
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
  setPerishableCategories,
  setupPallet,
  showManagePalletMenu,
  updateItems
} from '../../state/actions/PalletManagement';
import PalletItemCard from '../../components/PalletItemCard/PalletItemCard';
import {
  ADD_PALLET_UPCS, CLEAR_PALLET, DELETE_UPCS, GET_ITEM_DETAILS, GET_PALLET_CONFIG, UPDATE_PALLET_ITEM_QTY
} from '../../state/actions/asyncAPI';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { setPrintingPalletLabel } from '../../state/actions/Print';
import ApiConfirmationModal from '../Modal/ApiConfirmationModal';
import { Configurations } from '../../models/User';

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
  getPalletDetailsApi: AsyncState;
  clearPalletApi: AsyncState;
  displayClearConfirmation: boolean;
  setDisplayClearConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  getPalletConfigApi: AsyncState;
  perishableCategories: number[];
  userConfig: Configurations
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

const enableSave = (items: PalletItem[]): boolean => {
  const modifiedArray = items.filter((item: PalletItem) => isQuantityChanged(item)
    || item.deleted || item.added);
  return modifiedArray.length > 0;
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
// TODO implement palletItemCard
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

export const handleUpdateItems = (items: PalletItem[], palletId: number, dispatch: Dispatch<any>): void => {
  const updatePalletItems = items.filter(item => isQuantityChanged(item) && !item.added && !item.deleted)
    .map(item => ({ ...item, quantity: item.newQuantity ?? item.quantity }));

  if (updatePalletItems.length > 0) {
    dispatch(updatePalletItemQty({ palletId, palletItem: updatePalletItems }));
  }
};

export const handleAddItems = (id: number, items: PalletItem[], dispatch: Dispatch<any>): void => {
  // Filter Items by added flag
  const addPalletItems = items.filter(item => item.added)
    .map(item => ({ ...item, quantity: item.newQuantity ?? item.quantity }));

  if (addPalletItems.length > 0) {
    dispatch(addPalletUPCs({ palletId: id, items: addPalletItems }));
  }
};

export const getPalletConfigApiHook = (
  getPalletConfigApi: AsyncState,
  dispatch: Dispatch<any>,
  userConfig: Configurations,
  navigation: NavigationProp<any>
): void => {
  if (navigation.isFocused() && !getPalletConfigApi.isWaiting) {
    // on api success
    if (getPalletConfigApi.result) {
      const { perishableCategories } = getPalletConfigApi.result.data;
      dispatch(setPerishableCategories(perishableCategories));
      dispatch(hideActivityModal());
      dispatch({ type: GET_PALLET_CONFIG.RESET });
    }
    // on api error
    if (getPalletConfigApi.error) {
      dispatch(hideActivityModal());
      const { backupCategories } = userConfig;
      const backupPerishableCategories = backupCategories.split(',').map(Number);
      dispatch(setPerishableCategories(backupPerishableCategories));
      dispatch({ type: GET_PALLET_CONFIG.RESET });
    }
  }
  // api is Loading
  if (getPalletConfigApi.isWaiting) {
    dispatch(showActivityModal());
  }
};

export const getPalletDetailsApiHook = (
  getPalletDetailsApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>
): void => {
  if (navigation.isFocused() && !getPalletDetailsApi.isWaiting) {
    // on api success
    if (getPalletDetailsApi.result) {
      const {
        id, createDate, expirationDate, items
      } = getPalletDetailsApi.result.data.pallets[0];
      const palletItems = items.map((item: PalletItem) => ({
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
      dispatch({ type: 'API/GET_PALLET_DETAILS/RESET' });
    }
    // on api error
    if (getPalletDetailsApi.error) {
      dispatch(hideActivityModal());
      Toast.show({
        type: 'error',
        text1: strings('PALLET.PALLET_DETAILS_ERROR'),
        text2: strings(TRY_AGAIN),
        visibilityTime: 4000,
        position: 'bottom'
      });
      dispatch({ type: 'API/GET_PALLET_DETAILS/RESET' });
    }
  }
  // api is Loading
  if (getPalletDetailsApi.isWaiting) {
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

export const ManagePalletScreen = (props: ManagePalletProps): JSX.Element => {
  const {
    useEffectHook, isManualScanEnabled, palletInfo, items, navigation,
    route, dispatch, getItemDetailsApi, updateItemQtyAPI,
    deleteUpcsApi, addPalletUpcApi, getPalletDetailsApi, clearPalletApi,
    displayClearConfirmation, setDisplayClearConfirmation, getPalletConfigApi, perishableCategories, userConfig
  } = props;
  const { id, expirationDate } = palletInfo;

  let scannedSubscription: EmitterSubscription;

  // Clear API state before leaving this screen
  useEffectHook(() => navigation.addListener('beforeRemove', () => {
    // Suggestion add confirmation before leaving screen if they want to undo unsaved changes
    dispatch({ type: GET_ITEM_DETAILS.RESET });
  }), []);

  useEffectHook(() => {
    if (userConfig.palletExpiration && isEmpty(perishableCategories)) {
      dispatch(getPalletConfig());
    }
  }, [perishableCategories]);

  // update pallet hook (get pallet details api)
  useEffectHook(() => getPalletConfigApiHook(
    getPalletConfigApi,
    dispatch,
    userConfig,
    navigation
  ), [getPalletConfigApi]);

  // Scanner listener
  useEffectHook(() => {
    scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused()) {
        validateSession(navigation, route.name).then(() => {
          trackEvent('Items_Details_scanned', {
            barcode: scan.value,
            type: scan.type
          });
          dispatch(getItemDetails({ id: scan.value, getSummary: true }));
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
    dispatch
  ), [addPalletUpcApi, deleteUpcsApi, updateItemQtyAPI]);
  // Get Item Details UPC api
  useEffectHook(() => {
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
            itemName
          } = data;
          const pallet: PalletItem = {
            upcNbr,
            itemNbr,
            price,
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
  }, [getItemDetailsApi]);

  // update pallet hook (get pallet details api)
  useEffectHook(() => getPalletDetailsApiHook(
    getPalletDetailsApi,
    dispatch,
    navigation
  ), [getPalletDetailsApi]);

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
    // Filter Items by deleted flag
    const upcs = items.filter(item => item.deleted && !item.added).reduce((reducer, current) => {
      reducer.push(current.upcNbr);
      return reducer;
    }, reducerInitialValue);

    if (upcs.length > 0) {
      dispatch(deleteUpcs({ palletId, upcs }));
    }
    // Calls add items to pallet via api
    handleAddItems(palletId, items, dispatch);
    // Calls update pallet item qty api
    handleUpdateItems(items, id, dispatch);
  };

  const handleUnhandledTouches = () => {
    Keyboard.dismiss();
    return false;
  };

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
          {expirationDate && expirationDate.length > 0 ? (
            <View style={styles.headerItem}>
              <Text style={styles.headerText}>
                {strings('PALLET.EXPIRATION_DATE')}
              </Text>
              <Text style={styles.headerItemText}>{expirationDate}</Text>
            </View>
          ) : null}
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
      {items && enableSave(items) ? (
        <View style={styles.buttonContainer}>
          <Button
            title={strings('GENERICS.SAVE')}
            style={styles.saveButton}
            backgroundColor={COLOR.GREEN}
            onPress={() => submit()}
          />
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
};

const ManagePallet = (): JSX.Element => {
  const { palletInfo, managePalletMenu, items } = useTypedSelector(state => state.PalletManagement);
  const isManualScanEnabled = useTypedSelector(state => state.Global.isManualScanEnabled);
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const getItemDetailsApi = useTypedSelector(state => state.async.getItemDetails);
  const addPalletUpcApi = useTypedSelector(state => state.async.addPalletUPCs);
  const updateItemQtyAPI = useTypedSelector(state => state.async.updatePalletItemQty);
  const deleteUpcsApi = useTypedSelector(state => state.async.deleteUpcs);
  const getPalletDetailsApi = useTypedSelector(state => state.async.getPalletDetails);
  const clearPalletApi = useTypedSelector(state => state.async.clearPallet);
  const [displayClearConfirmation, setDisplayClearConfirmation] = useState(false);
  const getPalletConfigApi = useTypedSelector(state => state.async.getPalletConfig);
  const userConfig = useTypedSelector(state => state.User.configs);
  const { perishableCategories } = useTypedSelector(state => state.PalletManagement);

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
          getPalletDetailsApi={getPalletDetailsApi}
          clearPalletApi={clearPalletApi}
          displayClearConfirmation={displayClearConfirmation}
          setDisplayClearConfirmation={setDisplayClearConfirmation}
          getPalletConfigApi={getPalletConfigApi}
          userConfig={userConfig}
          perishableCategories={perishableCategories}
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
