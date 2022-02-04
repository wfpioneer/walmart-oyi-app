import React, {
  Dispatch,
  EffectCallback, useEffect, useMemo, useRef, useState
} from 'react';
import {
  ActivityIndicator,
  EmitterSubscription,
  FlatList,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  NavigationProp, RouteProp, useNavigation, useRoute
} from '@react-navigation/native';
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
  addPalletUPCs, clearPallet, deleteUpcs, getItemDetailsUPC, updatePalletItemQty
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
  resetItems,
  setPalletItemNewQuantity,
  setPalletItemQuantity,
  setupPallet,
  showManagePalletMenu,
  updateItems
} from '../../state/actions/PalletManagement';
import PalletItemCard from '../../components/PalletItemCard/PalletItemCard';
import {
  ADD_PALLET_UPCS, CLEAR_PALLET, DELETE_UPCS, GET_ITEM_DETAIL_UPC, UPDATE_PALLET_ITEM_QTY
} from '../../state/actions/asyncAPI';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
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
  getItemDetailsfromUpcApi: AsyncState;
  addPalletUpcApi: AsyncState;
  isLoading: boolean,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  itemSaveIndex: number;
  setItemSaveIndex: React.Dispatch<React.SetStateAction<number>>;
  updateItemQtyAPI: AsyncState;
  deleteUpcsApi: AsyncState;
  getPalletDetailsApi: AsyncState;
  clearPalletApi: AsyncState;
  activityModal: boolean;
  displayClearConfirmation: boolean;
  setDisplayClearConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
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
  dispatch(deleteItem(item.itemNbr.toString()));
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
/* Update Pallet ItemQty api is able to take in an array of quantity changes.
         which maybe better than recursively calling the api.
         This could potentially use a refactor */
export const handleSaveItem = (
  items: PalletItem[],
  palletId: number,
  itemSaveIndex: number,
  setItemSaveIndex: React.Dispatch<React.SetStateAction<number>>,
  dispatch: Dispatch<any>,
  indexOnSkip?: number
): void => {
  const currentIndex = indexOnSkip || itemSaveIndex;
  if (currentIndex < items.length) {
    const currentItem = items[currentIndex];
    setItemSaveIndex(currentIndex + 1);
    // Skip item if either flag is true. Temp change
    const hasNoFlags = !currentItem.added && !currentItem.deleted;
    if (isQuantityChanged(currentItem) && currentItem.newQuantity && hasNoFlags) {
      dispatch(updatePalletItemQty({
        palletId, quantity: currentItem.newQuantity, upc: currentItem.upcNbr
      }));
    } else {
      // Need to give it the new index as setState doesn't update fast enough
      handleSaveItem(items, palletId, itemSaveIndex, setItemSaveIndex, dispatch, currentIndex + 1);
    }
  } else {
    setItemSaveIndex(0);
    dispatch({ type: UPDATE_PALLET_ITEM_QTY.RESET });
  }
};

export const updateItemQuantityApiHook = (
  updateItemQtyAPI: AsyncState,
  items: PalletItem[],
  palletId: number,
  itemSaveIndex: number,
  setItemSaveIndex: React.Dispatch<React.SetStateAction<number>>,
  dispatch: Dispatch<any>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  if (!updateItemQtyAPI.isWaiting) {
    // Success
    if (updateItemQtyAPI.result) {
      // have to do - 1 because we already incremented it
      dispatch(setPalletItemQuantity(items[itemSaveIndex - 1].itemNbr.toString()));
      handleSaveItem(items, palletId, itemSaveIndex, setItemSaveIndex, dispatch);
      setIsLoading(false);
    }

    // Failure
    if (updateItemQtyAPI.error) {
      // TODO count the fails
      handleSaveItem(items, palletId, itemSaveIndex, setItemSaveIndex, dispatch);
      setIsLoading(false);
    }
  }
  // on api request
  if (updateItemQtyAPI.isWaiting) {
    setIsLoading(true);
  }
};

export const handleAddItems = (id: number, items: PalletItem[], dispatch: Dispatch<any>): void => {
  // Filter Items by added flag
  const addPalletItems = items.filter(item => item.added === true)
    .map(item => ({ ...item, quantity: item.newQuantity ?? item.quantity }));
  if (addPalletItems.length > 0) {
    dispatch(addPalletUPCs({ palletId: id, items: addPalletItems }));
  }
};

export const getPalletDetailsApiHook = (
  getPalletDetailsApi: AsyncState,
  dispatch: Dispatch<any>
): void => {
  // on api success
  if (!getPalletDetailsApi.isWaiting && getPalletDetailsApi.result) {
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
  }
  // on api error
  if (!getPalletDetailsApi.isWaiting && getPalletDetailsApi.error) {
    Toast.show({
      type: 'error',
      text1: strings('PALLET.PALLET_DETAILS_ERROR'),
      text2: strings(TRY_AGAIN),
      visibilityTime: 4000,
      position: 'bottom'
    });
  }
};
export const clearPalletApiHook = (
  clearPalletApi: AsyncState,
  palletId: number,
  navigation: NavigationProp<any>,
  dispatch: Dispatch<any>,
  setDisplayClearConfirmation: React.Dispatch<React.SetStateAction<boolean>>,
): void => {
  // Success
  if (!clearPalletApi.isWaiting && clearPalletApi.result) {
    navigation.goBack();
    setDisplayClearConfirmation(false);
    dispatch({ type: CLEAR_PALLET.RESET });
    Toast.show({
      type: 'success',
      text1: strings('PALLET.CLEAR_PALLET_SUCCESS', { palletId }),
      position: 'bottom'
    });
  }
  // Failure
  if (!clearPalletApi.isWaiting && clearPalletApi.error) {
    setDisplayClearConfirmation(false);
    dispatch({ type: CLEAR_PALLET.RESET });
    Toast.show({
      type: 'error',
      text1: strings('PALLET.CLEAR_PALLET_ERROR'),
      text2: strings(TRY_AGAIN),
      position: 'bottom'
    });
  }
}
export const ManagePalletScreen = (props: ManagePalletProps): JSX.Element => {
  const {
    useEffectHook, isManualScanEnabled, palletInfo, items,
    navigation, route, dispatch, getItemDetailsfromUpcApi, clearPalletApi,
    itemSaveIndex, setItemSaveIndex, updateItemQtyAPI, deleteUpcsApi,
    addPalletUpcApi, isLoading, setIsLoading, activityModal, getPalletDetailsApi,
    displayClearConfirmation, setDisplayClearConfirmation
  } = props;
  const { id, expirationDate } = palletInfo;

  let scannedSubscription: EmitterSubscription;

  // Clear API state before leaving this screen
  useEffectHook(() => navigation.addListener('beforeRemove', () => {
    // Suggestion add confirmation before leaving screen if they want to undo unsaved changes
    dispatch({ type: GET_ITEM_DETAIL_UPC.RESET });
    dispatch({ type: ADD_PALLET_UPCS.RESET });
    dispatch({ type: DELETE_UPCS.RESET });
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
          dispatch(
            getItemDetailsUPC({ upc: scan.value })
          );
        });
      }
    });
    return () => {
      scannedSubscription.remove();
    };
  }, []);

  // Get Item Details UPC api
  useEffectHook(() => {
    // on api success
    if (!getItemDetailsfromUpcApi.isWaiting && getItemDetailsfromUpcApi.result) {
      if (getItemDetailsfromUpcApi.result.status === 200) {
        const {
          data
        } = getItemDetailsfromUpcApi.result;
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
            itemDesc
          } = data;
          const pallet : PalletItem = {
            upcNbr,
            itemNbr,
            price,
            itemDesc,
            quantity: 1,
            deleted: false,
            added: true
          };
          dispatch(addItemToPallet(pallet));
        }
      } else if (getItemDetailsfromUpcApi.result.status === 204) {
        Toast.show({
          type: 'info',
          text1: strings('PALLET.ITEMS_NOT_FOUND'),
          visibilityTime: 4000,
          position: 'bottom'
        });
      }
      setIsLoading(false);
    }
    // on api error
    if (!getItemDetailsfromUpcApi.isWaiting && getItemDetailsfromUpcApi.error) {
      setIsLoading(false);
      Toast.show({
        type: 'error',
        text1: strings('PALLET.ITEMS_DETAILS_ERROR'),
        text2: strings(TRY_AGAIN),
        visibilityTime: 4000,
        position: 'bottom'
      });
    }
    // on api request
    if (getItemDetailsfromUpcApi.isWaiting) {
      setIsLoading(true);
    }
  }, [getItemDetailsfromUpcApi]);

  // Add Pallet UPCs api
  useEffectHook(() => {
    // on api success
    if (!addPalletUpcApi.isWaiting && addPalletUpcApi.result) {
      if (addPalletUpcApi.result.status === 200) {
        Toast.show({
          type: 'success',
          text1: strings('PALLET.ADD_UPC_SUCCESS'),
          visibilityTime: 4000,
          position: 'bottom'
        });
        // Set added item flags to false and update quantity with new quantity
        const updatedPalletItems = items.map(item => {
          if (item.added) {
            return {
              ...item,
              added: false,
              quantity: item.newQuantity ?? item.quantity
            };
          }
          return item;
        });
        dispatch(updateItems(updatedPalletItems));
      }
      if (addPalletUpcApi.result.status === 204) {
        Toast.show({
          type: 'info',
          text1: strings('PALLET.PALLET_UPC_NOT_FOUND'),
          visibilityTime: 4000,
          position: 'bottom'
        });
      }
      setIsLoading(false);
    }
    // on api error
    if (!addPalletUpcApi.isWaiting && addPalletUpcApi.error) {
      Toast.show({
        type: 'error',
        text1: strings('PALLET.ADD_UPC_ERROR'),
        text2: strings(TRY_AGAIN),
        visibilityTime: 4000,
        position: 'bottom'
      });
      setIsLoading(false);
    }
    // on api request
    if (addPalletUpcApi.isWaiting) {
      setIsLoading(true);
    }
  }, [addPalletUpcApi]);

  useEffectHook(() => {
    // on api success
    if (!deleteUpcsApi.isWaiting && deleteUpcsApi.result) {
      if (deleteUpcsApi.result.status === 200) {
        const updatedItems = items.filter(item => !item.deleted);
        dispatch(updateItems(updatedItems));
      } else if (deleteUpcsApi.result.status === 204) {
        // TODO
      }
      setIsLoading(false);
    }
    // on api error
    if (!deleteUpcsApi.isWaiting && deleteUpcsApi.error) {
      // TODO
      setIsLoading(false);
    }
    // on api request
    if (deleteUpcsApi.isWaiting) {
      setIsLoading(true);
    }
  }, [deleteUpcsApi]);

  // update item quantity api
  useEffectHook(() => updateItemQuantityApiHook(
    updateItemQtyAPI,
    items,
    palletInfo.id,
    itemSaveIndex,
    setItemSaveIndex,
    dispatch,
    setIsLoading
  ), [updateItemQtyAPI]);

  // update pallet hook (get pallet details api)
  useEffectHook(() => getPalletDetailsApiHook(
    getPalletDetailsApi,
    dispatch
  ), [getPalletDetailsApi]);

  useEffectHook(() => clearPalletApiHook(
    clearPalletApi,
    id,
    navigation,
    dispatch,
    setDisplayClearConfirmation
  ), [clearPalletApi]);

  /**
   * API modal
   */
  useEffectHook(() => {
    if (navigation.isFocused()) {
      if (!activityModal) {
        if (getPalletDetailsApi.isWaiting) {
          dispatch(showActivityModal());
        }
      } else if (!getPalletDetailsApi.isWaiting) {
        dispatch(hideActivityModal());
      }
    }
  }, [
    activityModal,
    getPalletDetailsApi
  ]);

  // TODO setIsLoading should be orchestrated to check if all apis have finished their request or alternative solution
  if (isLoading) {
    return (
      <ActivityIndicator
        animating={isLoading}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    );
  }

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
    handleSaveItem(items, palletInfo.id, itemSaveIndex, setItemSaveIndex, dispatch);
  };

  // TODO Flatlist can use a flex container of 1. The pallet items can trail off of the screen
  return (
    <View style={styles.safeAreaView}>
      <ApiConfirmationModal
        isVisible={displayClearConfirmation}
        onClose={() => setDisplayClearConfirmation(false)}
        cancelText={strings('GENERICS.NO')}
        api={clearPalletApi}
        mainText={strings('PALLET.CLEAR_PALLET_CONFIRMATION')}
        handleConfirm={() => dispatch(clearPallet({ palletId: id }))}
        confirmText={strings('GENERICS.YES')}
      />
      <View style={styles.bodyContainer}>
        {isManualScanEnabled && <ManualScan />}
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
            <Button
              title={strings('GENERICS.UNDO')}
              style={styles.undoButton}
              backgroundColor={COLOR.GREEN}
              onPress={() => undoDelete(dispatch)}
            />
          </View>
        ) : null}
        <View>
          <FlatList
            data={items}
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
    </View>
  );
};

const ManagePallet = (): JSX.Element => {
  const { palletInfo, managePalletMenu, items } = useTypedSelector(state => state.PalletManagement);
  const isManualScanEnabled = useTypedSelector(state => state.Global.isManualScanEnabled);
  const activityModal = useTypedSelector(state => state.modal.showActivity);
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const getItemDetailsfromUpcApi = useTypedSelector(state => state.async.getItemDetailsUPC);
  const addPalletUpcApi = useTypedSelector(state => state.async.addPalletUPCs);
  const updateItemQtyAPI = useTypedSelector(state => state.async.updatePalletItemQty);
  const deleteUpcsApi = useTypedSelector(state => state.async.deleteUpcs);
  const getPalletDetailsApi = useTypedSelector(state => state.async.getPalletDetails);
  const clearPalletApi = useTypedSelector(state => state.async.clearPallet);

  const [itemSaveIndex, setItemSaveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [displayClearConfirmation, setDisplayClearConfirmation] = useState(false);

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
    // TODO Integration
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
          getItemDetailsfromUpcApi={getItemDetailsfromUpcApi}
          addPalletUpcApi={addPalletUpcApi}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          itemSaveIndex={itemSaveIndex}
          setItemSaveIndex={setItemSaveIndex}
          updateItemQtyAPI={updateItemQtyAPI}
          deleteUpcsApi={deleteUpcsApi}
          getPalletDetailsApi={getPalletDetailsApi}
          clearPalletApi={clearPalletApi}
          activityModal={activityModal}
          displayClearConfirmation={displayClearConfirmation}
          setDisplayClearConfirmation={setDisplayClearConfirmation}
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
