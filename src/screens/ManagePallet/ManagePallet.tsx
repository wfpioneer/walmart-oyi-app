import React, {
  DependencyList, Dispatch, EffectCallback, useCallback, useEffect, useMemo, useRef, useState
} from 'react';
import {
  BackHandler,
  EmitterSubscription,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  NavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute
} from '@react-navigation/native';
import { partition } from 'lodash';
import moment from 'moment';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
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
  addPalletUPCs, clearPallet, deleteUpcs, getItemDetails, getItemDetailsV2, updatePalletItemQty
} from '../../state/actions/saga';
import { AsyncState } from '../../models/AsyncState';
import BottomSheetPrintCard from '../../components/BottomSheetPrintCard/BottomSheetPrintCard';
import BottomSheetAddCard from '../../components/BottomSheetAddCard/BottomSheetAddCard';
import BottomSheetClearCard from '../../components/BottomSheetClearCard/BottomSheetClearCard';
import Button, { ButtonType } from '../../components/buttons/Button';
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
import ItemDetails from '../../models/ItemDetails';
import { CustomModalComponent } from '../Modal/Modal';
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
  perishableCategories: number[];
  isPickerShow: boolean;
  setIsPickerShow: React.Dispatch<React.SetStateAction<boolean>>;
  displayWarningModal: boolean;
  setDisplayWarningModal: React.Dispatch<React.SetStateAction<boolean>>;
  useFocusEffectHook: (effect: EffectCallback) => void;
  useCallbackHook: <T extends (...args: any[]) => any>(callback: T, deps: DependencyList) => T;
  confirmBackNavigate: boolean;
  setConfirmBackNavigate: React.Dispatch<React.SetStateAction<boolean>>;
  createPallet: boolean;
  userConfigs: Configurations;
  getItemDetailsV2Api: AsyncState;
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
  const currentQuantity = item.newQuantity || item.quantity || 0;
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

export const onEndEditing = (item: PalletItem, dispatch: Dispatch<any>): void => {
  if (typeof (item.newQuantity) !== 'number' || Number.isNaN(item.newQuantity)) {
    dispatch(setPalletItemNewQuantity(item.itemNbr.toString(), item.quantity));
  }
};

const isPerishableItemExist = (items: PalletItem[], perishableCategories: number[]): boolean => (
  items.some(item => item.categoryNbr && perishableCategories.includes(item.categoryNbr))
);

const isLocationExistOnAnItem = (items: PalletItem[]): boolean => items.some(item => item.locationName);

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
        numberOfItems={item.newQuantity}
        price={item.price}
        upc={item.upcNbr}
        onEndEditing={() => onEndEditing(item, dispatch)}
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
  id: string,
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

export const getPalletDetailsApiHook = (
  getPalletDetailsApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>
): void => {
  if (navigation.isFocused()) {
    // on api success
    if (!getPalletDetailsApi.isWaiting && getPalletDetailsApi.result) {
      if (getPalletDetailsApi.result.status === 200) {
        const {
          id, createDate, expirationDate, items
        } = getPalletDetailsApi.result.data.pallets[0];
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
            expirationDate: expirationDate && moment(expirationDate).format('DD/MM/YYYY')
          },
          items: palletItems
        };
        dispatch(setupPallet(palletDetails));
        dispatch(hideActivityModal());
        dispatch({ type: 'API/GET_PALLET_DETAILS/RESET' });
      } else if (getPalletDetailsApi.result.status === 204) {
        Toast.show({
          type: 'error',
          text1: strings('LOCATION.PALLET_NOT_FOUND'),
          visibilityTime: 3000,
          position: 'bottom'
        });
      }
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
  newExpirationDate?: string,
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
  palletId: string,
  navigation: NavigationProp<any>,
  dispatch: Dispatch<any>,
  setDisplayClearConfirmation: React.Dispatch<React.SetStateAction<boolean>>,
  setConfirmBackNavigate: React.Dispatch<React.SetStateAction<boolean>>,
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
        setConfirmBackNavigate(true);
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
    if (getItemDetailsApi.result.status === 200 || getItemDetailsApi.result.status === 207) {
      const itemDetails: ItemDetails = getItemDetailsApi.result.data;
      const palletItem = items.filter(item => item.itemNbr === itemDetails.itemNbr);
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
        } = itemDetails;
        const pallet: PalletItem = {
          upcNbr,
          itemNbr,
          price,
          categoryNbr,
          categoryDesc,
          itemDesc: itemName,
          quantity: 1,
          newQuantity: 1,
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

export const getItemDetailsApiV2Hook = (
  getItemDetailsV2Api: AsyncState,
  items: PalletItem[],
  dispatch: Dispatch<any>
) => {
  // on api success
  if (!getItemDetailsV2Api.isWaiting && getItemDetailsV2Api.result) {
    const responseData = getItemDetailsV2Api.result?.data;
    const itemDetails: ItemDetails = (responseData && responseData.itemDetails);
    if (getItemDetailsV2Api.result.status === 200 || itemDetails.code === 200 || itemDetails.code === 207) {
      const palletItem = items.filter(item => item.itemNbr === itemDetails.itemNbr);
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
        } = itemDetails;
        const pallet: PalletItem = {
          upcNbr,
          itemNbr,
          price,
          categoryNbr,
          categoryDesc,
          itemDesc: itemName,
          quantity: 1,
          newQuantity: 1,
          deleted: false,
          added: true
        };

        dispatch(addItemToPallet(pallet));
      }
    } else if (getItemDetailsV2Api.result?.status === 204) {
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
  if (
    !getItemDetailsV2Api.isWaiting && (getItemDetailsV2Api.error
      || (getItemDetailsV2Api.result
        && getItemDetailsV2Api.result.data.itemDetails.message))
  ) {
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
  if (getItemDetailsV2Api.isWaiting) {
    dispatch(showActivityModal());
  }
};

const onValidateHardwareBackPress = (
  setDisplayWarningModal: React.Dispatch<React.SetStateAction<boolean>>,
  dataUnsaved: boolean
) => {
  if (dataUnsaved) {
    setDisplayWarningModal(true);
    return true;
  }
  return false;
};

export const ManagePalletScreen = (props: ManagePalletProps): JSX.Element => {
  const {
    useEffectHook, isManualScanEnabled, palletInfo, items, navigation,
    route, dispatch, getItemDetailsApi, updateItemQtyAPI,
    deleteUpcsApi, addPalletUpcApi, getPalletDetailsApi, clearPalletApi,
    displayClearConfirmation, setDisplayClearConfirmation, setIsPickerShow,
    isPickerShow, perishableCategories, displayWarningModal, setDisplayWarningModal,
    useFocusEffectHook, useCallbackHook, confirmBackNavigate, setConfirmBackNavigate,
    createPallet, userConfigs, getItemDetailsV2Api
  } = props;
  const { id, expirationDate, newExpirationDate } = palletInfo;
  let scannedSubscription: EmitterSubscription;

  // validation on app back press
  useEffectHook(() => {
    const navigationListener = navigation.addListener('beforeRemove', e => {
      if (!confirmBackNavigate && enableSave(items, palletInfo)) {
        setDisplayWarningModal(true);
        e.preventDefault();
      }
    });
    return navigationListener;
  }, [navigation, items, confirmBackNavigate]);

  // validation on Hardware backPress
  useFocusEffectHook(
    useCallbackHook(() => {
      const onHardwareBackPress = () => onValidateHardwareBackPress(
        setDisplayWarningModal,
        enableSave(items, palletInfo)
      );
      BackHandler.addEventListener('hardwareBackPress', onHardwareBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onHardwareBackPress);
    }, [items])
  );

  // On data loss back confirm
  useEffectHook(() => {
    if (confirmBackNavigate) {
      navigation.goBack();
    }
  }, [confirmBackNavigate]);

  useEffectHook(() => {
    scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused()) {
        validateSession(navigation, route.name).then(() => {
          trackEvent('Items_Details_scanned', {
            barcode: scan.value,
            type: scan.type
          });
          if (userConfigs.additionalItemDetails) {
            dispatch(getItemDetailsV2({ id: scan.value, getSummary: false, getMetadataHistory: false }));
          } else {
            dispatch(getItemDetails({ id: scan.value, getSummary: false }));
          }
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

  // Get Item Details UPC api V2
  useEffectHook(() => getItemDetailsApiV2Hook(
    getItemDetailsV2Api,
    items,
    dispatch
  ), [getItemDetailsV2Api]);

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
    setDisplayClearConfirmation,
    setConfirmBackNavigate
  ), [clearPalletApi]);

  const submit = () => {
    const palletId = id;
    const reducerInitialValue: string[] = [];
    const addExpiry = isExpiryDateChanged(palletInfo) ? newExpirationDate : expirationDate;
    const removeExpirationDateForPallet = removeExpirationDate(items, perishableCategories);
    // updated expiration date
    const updatedExpirationDate = addExpiry
      ? `${moment(addExpiry, 'DD/MM/YYY').format('YYYY-MM-DDT00:00:00.000')}Z`
      : undefined;
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
    const newDate = value && moment(value).format('DD/MM/YYYY');
    setIsPickerShow(false);
    if (type === 'set' && newDate && newDate !== expirationDate) {
      dispatch(setPalletNewExpiration(newDate));
    }
  };
  const isRemoveExpirationDate = removeExpirationDate(items, perishableCategories);
  const isAddedPerishable = isAddedItemPerishable(items, perishableCategories);

  const backConfirmed = () => {
    setDisplayWarningModal(false);
    setConfirmBackNavigate(true);
    dispatch({ type: GET_ITEM_DETAILS.RESET });
  };

  const renderWarningModal = () => (
    <CustomModalComponent
      isVisible={displayWarningModal}
      onClose={() => { setDisplayWarningModal(false); setConfirmBackNavigate(false); }}
      modalType="Popup"
    >
      <>
        <View>
          <Text style={styles.labelHeader}>{strings('GENERICS.WARNING_LABEL')}</Text>
          <Text style={styles.message}>{strings('PALLET.UNSAVED_WARNING_MSG')}</Text>
        </View>
        <View style={styles.buttonWarningContainer}>
          <Button
            style={styles.buttonAlign}
            title={strings('GENERICS.CANCEL')}
            titleColor={COLOR.MAIN_THEME_COLOR}
            type={ButtonType.SOLID_WHITE}
            onPress={() => { setDisplayWarningModal(false); setConfirmBackNavigate(false); }}
          />
          <Button
            style={styles.buttonAlign}
            title={strings('GENERICS.OK')}
            type={ButtonType.PRIMARY}
            onPress={backConfirmed}
          />
        </View>
      </>
    </CustomModalComponent>
  );

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
        {renderWarningModal()}
        {isManualScanEnabled && <ManualScan placeholder={strings('GENERICS.ENTER_UPC_ITEM_NBR')} />}
        <View style={styles.headerContainer}>
          {!createPallet && (
          <View style={styles.headerItem}>
            <Text style={styles.headerText}>{strings('PALLET.PALLET_ID')}</Text>
            <Text style={styles.headerItemText}>{id}</Text>
          </View>
          )}
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
              minimumDate={new Date(Date.now())}
            />
          )}
          <View style={styles.headerItem}>
            <Text style={styles.headerText}>{strings('LOCATION.ITEMS')}</Text>
            <Text style={styles.headerItemText}>{items.length}</Text>
          </View>
          {(isLocationExistOnAnItem(items)) && (
          <View style={styles.headerItem}>
            <Text style={styles.headerText}>{strings('ITEM.LOCATION')}</Text>
            <Text style={styles.headerItemText}>{items[0]?.locationName}</Text>
          </View>
          )}
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
            title={strings(createPallet ? 'GENERICS.CREATE' : 'GENERICS.SAVE')}
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
    palletInfo, managePalletMenu, items, perishableCategories, createPallet
  } = useTypedSelector(state => state.PalletManagement);
  const isManualScanEnabled = useTypedSelector(state => state.Global.isManualScanEnabled);
  const navigation: NavigationProp<any> = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const getItemDetailsApi = useTypedSelector(state => state.async.getItemDetails);
  const addPalletUpcApi = useTypedSelector(state => state.async.addPalletUPCs);
  const updateItemQtyAPI = useTypedSelector(state => state.async.updatePalletItemQty);
  const deleteUpcsApi = useTypedSelector(state => state.async.deleteUpcs);
  const getPalletDetailsApi = useTypedSelector(state => state.async.getPalletDetails);
  const clearPalletApi = useTypedSelector(state => state.async.clearPallet);
  const getItemDetailsV2Api = useTypedSelector(state => state.async.getItemDetailsV2);
  const userConfigs = useTypedSelector(state => state.User.configs);
  const [displayClearConfirmation, setDisplayClearConfirmation] = useState(false);
  const [isPickerShow, setIsPickerShow] = useState(false);
  const [displayWarningModal, setDisplayWarningModal] = useState(false);
  const [confirmBackNavigate, setConfirmBackNavigate] = useState(false);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['55%'], []);

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
          perishableCategories={perishableCategories}
          isPickerShow={isPickerShow}
          setIsPickerShow={setIsPickerShow}
          displayWarningModal={displayWarningModal}
          setDisplayWarningModal={setDisplayWarningModal}
          useFocusEffectHook={useFocusEffect}
          useCallbackHook={useCallback}
          confirmBackNavigate={confirmBackNavigate}
          setConfirmBackNavigate={setConfirmBackNavigate}
          createPallet={createPallet}
          userConfigs={userConfigs}
          getItemDetailsV2Api={getItemDetailsV2Api}
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
