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
  addPalletUPCs, deleteUpcs, getItemDetailsUPC, updatePalletItemQty
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
  ADD_PALLET_UPCS, DELETE_UPCS, GET_ITEM_DETAIL_UPC, UPDATE_PALLET_ITEM_QTY
} from '../../state/actions/asyncAPI';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';

const TRY_AGAIN = 'GENERICS.TRY_AGAIN';

interface ManagePalletProps {
  dispatch: Dispatch<any>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  isManualScanEnabled: boolean;
  palletInfo: PalletInfo;
  items: PalletItem[];
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  getItemDetailsFromUpcApi: AsyncState;
  addPalletUpcApi: AsyncState;
  isLoading: boolean,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  updateItemQtyAPI: AsyncState;
  deleteUpcsApi: AsyncState;
  getPalletDetailsApi: AsyncState;
  activityModal: boolean;
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

export const handleUpdateItems = (items: PalletItem[], palletId: number, dispatch: Dispatch<any>): void => {
  const updatePalletItems = items.filter(item => isQuantityChanged(item) && !item.added && !item.deleted)
    .map(item => ({ ...item, quantity: item.newQuantity ?? item.quantity }));

  if (updatePalletItems.length > 0) {
    dispatch(updatePalletItemQty({ palletId, palletItem: updatePalletItems }));
  }
};
export const updateItemQuantityApiHook = (
  updateItemQtyAPI: AsyncState,
  dispatch: Dispatch<any>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  if (!updateItemQtyAPI.isWaiting) {
    // Success
    if (updateItemQtyAPI.result) {
      // Items passed into the request body
      const { data } = updateItemQtyAPI.result.config;

      // TODO WE CAN JUST USE VALUE instead of CONFIG.DATA
      const updatedItemQtys: PalletItem[] = JSON.parse(data);
      updatedItemQtys.forEach(item => dispatch(setPalletItemQuantity(item.itemNbr.toString())));
      setIsLoading(false);
    }

    // Failure
    if (updateItemQtyAPI.error) {
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
interface ApiResult {
  data: any;
  status: number;
  headers: Record<string, any>;
  config: any;
  request: Record<string, any>;
}
export const ManagePalletScreen = (props: ManagePalletProps): JSX.Element => {
  const {
    useEffectHook, isManualScanEnabled, palletInfo, items, navigation,
    route, dispatch, getItemDetailsFromUpcApi, updateItemQtyAPI, deleteUpcsApi,
    addPalletUpcApi, isLoading, setIsLoading, activityModal, getPalletDetailsApi
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
  const updatePalletResult = (response: ApiResult | string | null, updatedItems: PalletItem[]) => {
    if (response && typeof (response) === 'object') {
      const palletData: PalletItem[] = JSON.parse(response.config.data);
    }
  };
  const isSuccessResult = (response: ApiResult | string): response is ApiResult => (
    typeof (response) === 'object');
  // Orchestrated API Calls
  useEffectHook(() => {
    const addResponse: ApiResult | string = (addPalletUpcApi.result ?? addPalletUpcApi.error);
    const updateResponse: ApiResult | string = (updateItemQtyAPI.result ?? updateItemQtyAPI.error);
    const deleteResponse: ApiResult | string = (deleteUpcsApi.result ?? deleteUpcsApi.error);

    const isLoadingx = addPalletUpcApi.isWaiting || deleteUpcsApi.isWaiting || updateItemQtyAPI.isWaiting;
    const totalResponses: Map<'ERROR' | 'SUCCESS', any> = new Map();

    let newPalletItems = [...items];
    if (isLoadingx) {
      console.log('Showing Activity Modal');
      dispatch(showActivityModal());
    }
    // IF response update newPalletItems
    if (!isLoadingx && addResponse) {
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
    if (!isLoadingx && updateResponse) {
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
    if (!isLoadingx && deleteResponse) {
      if (isSuccessResult(deleteResponse) && deleteResponse.status === 200) {
        totalResponses.set('SUCCESS', deleteResponse);
        const deleteIndexes: number[] = [];
        // Finds Index for each deleted item
        newPalletItems.forEach((item, index) => {
          if (item.deleted) {
            deleteIndexes.push(index);
          }
        });
        deleteIndexes.forEach(index => newPalletItems.splice(index, 1));
      } else {
        totalResponses.set('ERROR', deleteResponse);
      }
    }
    if (!isLoadingx && (addResponse || updateResponse || deleteResponse)) {
      // Updates Pallet Items State with successful responses
      dispatch(updateItems(newPalletItems));
      // Orchestrates Toast Message Response
      if (totalResponses.size > 1) {
        Toast.show({
          type: 'info',
          text1: 'Pallet update partially successful',
          text2: strings(TRY_AGAIN),
          position: 'bottom'
        });
      } else if (totalResponses.keys().next().value === 'SUCCESS') {
        Toast.show({
          type: 'success',
          text1: 'Pallet update successful',
          position: 'bottom'
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Pallet update failed',
          text2: strings(TRY_AGAIN),
          position: 'bottom'
        });
      }
      // Clear APIs
      dispatch({ type: ADD_PALLET_UPCS.RESET });
      dispatch({ type: UPDATE_PALLET_ITEM_QTY.RESET });
      dispatch({ type: DELETE_UPCS.RESET });
      dispatch(hideActivityModal());
      // Function to check result and push to items to new list
    }
    // After Above is finished Display appropriate Toast message
  }, [addPalletUpcApi, deleteUpcsApi, updateItemQtyAPI]);
  // Get Item Details UPC api
  useEffectHook(() => {
    // on api success
    if (!getItemDetailsFromUpcApi.isWaiting && getItemDetailsFromUpcApi.result) {
      if (getItemDetailsFromUpcApi.result.status === 200) {
        const {
          data
        } = getItemDetailsFromUpcApi.result;
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
      } else if (getItemDetailsFromUpcApi.result.status === 204) {
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
    if (!getItemDetailsFromUpcApi.isWaiting && getItemDetailsFromUpcApi.error) {
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
    if (getItemDetailsFromUpcApi.isWaiting) {
      setIsLoading(true);
    }
  }, [getItemDetailsFromUpcApi]);

  // update pallet hook (get pallet details api)
  useEffectHook(() => getPalletDetailsApiHook(
    getPalletDetailsApi,
    dispatch
  ), [getPalletDetailsApi]);

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
    handleUpdateItems(items, id, dispatch);
  };
  // TODO Flatlist can use a flex container of 1. The pallet items can trail off of the screen
  return (
    <View style={styles.safeAreaView}>
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
        <View style={{ flex: 1 }}>
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
  const getItemDetailsFromUpcApi = useTypedSelector(state => state.async.getItemDetailsUPC);
  const addPalletUpcApi = useTypedSelector(state => state.async.addPalletUPCs);
  const updateItemQtyAPI = useTypedSelector(state => state.async.updatePalletItemQty);
  const deleteUpcsApi = useTypedSelector(state => state.async.deleteUpcs);
  const getPalletDetailsApi = useTypedSelector(state => state.async.getPalletDetails);

  const [isLoading, setIsLoading] = useState(false);

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
    // TODO Integration
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
          getItemDetailsFromUpcApi={getItemDetailsFromUpcApi}
          addPalletUpcApi={addPalletUpcApi}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          updateItemQtyAPI={updateItemQtyAPI}
          deleteUpcsApi={deleteUpcsApi}
          getPalletDetailsApi={getPalletDetailsApi}
          activityModal={activityModal}
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
