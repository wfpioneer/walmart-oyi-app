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
import { getItemDetailsUPC, updatePalletItemQty } from '../../state/actions/saga';
import { AsyncState } from '../../models/AsyncState';
import BottomSheetPrintCard from '../../components/BottomSheetPrintCard/BottomSheetPrintCard';
import BottomSheetAddCard from '../../components/BottomSheetAddCard/BottomSheetAddCard';
import BottomSheetClearCard from '../../components/BottomSheetClearCard/BottomSheetClearCard';
import Button from '../../components/buttons/Button';
import { PalletInfo, PalletItem } from '../../models/PalletManagementTypes';
import {
  addItemToPallet, setPalletItemNewQuantity, setPalletItemQuantity, showManagePalletMenu
} from '../../state/actions/PalletManagement';
import PalletItemCard from '../../components/PalletItemCard/PalletItemCard';

interface ManagePalletProps {
  dispatch: Dispatch<any>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  isManualScanEnabled: boolean;
  palletInfo: PalletInfo;
  items: PalletItem[];
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  getItemDetailsfromUpcApi: AsyncState;
  itemSaveIndex: number;
  setItemSaveIndex: React.Dispatch<React.SetStateAction<number>>;
  updateItemQtyAPI: AsyncState;
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

const itemCard = ({ item }: { item: PalletItem }, dispatch: Dispatch<any>) => {
  if (!item.deleted) {
    return (
      <PalletItemCard
        decreaseQuantity={() => handleDecreaseQuantity(item, dispatch)}
        increaseQuantity={() => handleIncreaseQuantity(item, dispatch)}
        onTextChange={text => handleTextChange(item, dispatch, text)}
        deleteItem={() => {}}
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

    if (isQuantityChanged(currentItem) && currentItem.newQuantity) {
      dispatch(updatePalletItemQty({
        palletId, quantity: currentItem.newQuantity, upc: currentItem.upcNbr
      }));
    } else {
      // Need to give it the new index as setState doesn't update fast enough
      handleSaveItem(items, palletId, itemSaveIndex, setItemSaveIndex, dispatch, currentIndex + 1);
    }
  } else {
    setItemSaveIndex(0);
    dispatch({ type: 'API/PATCH_PALLET_ITEM_QTY/RESET' });
  }
};

export const updateItemQuantityApiHook = (
  updateItemQtyAPI: AsyncState,
  items: PalletItem[],
  palletId: number,
  itemSaveIndex: number,
  setItemSaveIndex: React.Dispatch<React.SetStateAction<number>>,
  dispatch: Dispatch<any>
): void => {
  if (!updateItemQtyAPI.isWaiting) {
    // Success
    if (updateItemQtyAPI.result) {
      // have to do - 1 because we already incremented it
      dispatch(setPalletItemQuantity(items[itemSaveIndex - 1].itemNbr.toString()));
      handleSaveItem(items, palletId, itemSaveIndex, setItemSaveIndex, dispatch);
    }

    // Failure
    if (updateItemQtyAPI.error) {
      // TODO count the fails
      handleSaveItem(items, palletId, itemSaveIndex, setItemSaveIndex, dispatch);
    }
  }
};

export const ManagePalletScreen = (props: ManagePalletProps): JSX.Element => {
  const {
    useEffectHook, isManualScanEnabled, palletInfo, items,
    navigation, route, dispatch, getItemDetailsfromUpcApi,
    itemSaveIndex, setItemSaveIndex, updateItemQtyAPI
  } = props;
  const { id, expirationDate } = palletInfo;

  let scannedSubscription: EmitterSubscription;
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
    }
    // on api error
    if (!getItemDetailsfromUpcApi.isWaiting && getItemDetailsfromUpcApi.error) {
      Toast.show({
        type: 'error',
        text1: strings('PALLET.ITEMS_DETAILS_ERROR'),
        text2: strings('GENERICS.TRY_AGAIN'),
        visibilityTime: 4000,
        position: 'bottom'
      });
    }
  }, [getItemDetailsfromUpcApi]);

  if (getItemDetailsfromUpcApi.isWaiting) {
    return (
      <ActivityIndicator
        animating={getItemDetailsfromUpcApi.isWaiting}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    );
  }

  // update item quantity api
  useEffectHook(() => updateItemQuantityApiHook(
    updateItemQtyAPI,
    items,
    palletInfo.id,
    itemSaveIndex,
    setItemSaveIndex,
    dispatch
  ), [updateItemQtyAPI]);

  const handleSave = () => {
    handleSaveItem(items, palletInfo.id, itemSaveIndex, setItemSaveIndex, dispatch);
  };

  return (
    <View style={styles.safeAreaView}>
      <View style={styles.bodyContainer}>
        {isManualScanEnabled && <ManualScan />}
        <View style={styles.headerContainer}>
          <View style={styles.headerItem}>
            <Text style={styles.headerText}>
              {strings('PALLET.PALLET_ID')}
            </Text>
            <Text style={styles.headerItemText}>
              {id}
            </Text>
          </View>
          {expirationDate && expirationDate.length > 0 ? (
            <View style={styles.headerItem}>
              <Text style={styles.headerText}>
                {strings('PALLET.EXPIRATION_DATE')}
              </Text>
              <Text style={styles.headerItemText}>
                {expirationDate}
              </Text>
            </View>
          ) : null}
          <View style={styles.headerItem}>
            <Text style={styles.headerText}>
              {strings('LOCATION.ITEMS')}
            </Text>
            <Text style={styles.headerItemText}>
              {items.length}
            </Text>
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
            onPress={handleSave}
          />
        </View>
      ) : null}
    </View>
  );
};

const ManagePallet = (): JSX.Element => {
  const pallets = useTypedSelector(state => state.PalletManagement);
  const isManualScanEnabled = useTypedSelector(state => state.Global.isManualScanEnabled);
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const getItemDetailsfromUpcApi = useTypedSelector(
    state => state.async.getItemDetailsUPC
  );
  const updateItemQtyAPI = useTypedSelector(state => state.async.updatePalletItemQty);
  const [itemSaveIndex, setItemSaveIndex] = useState(0);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['45%'], []);

  useEffect(() => {
    if (navigation.isFocused() && bottomSheetModalRef.current) {
      if (pallets.managePalletMenu) {
        bottomSheetModalRef.current.present();
      } else {
        bottomSheetModalRef.current.dismiss();
      }
    }
  }, [pallets]);

  const handlePrintPallet = () => {
    dispatch(showManagePalletMenu(false));
    // TODO Integration
  };

  const handleCombinePallets = () => {
    dispatch(showManagePalletMenu(false));
    // TODO Integration
  };

  const handleClearPallet = () => {
    dispatch(showManagePalletMenu(false));
    // TODO Integration
  };

  return (
    <BottomSheetModalProvider>
      <TouchableOpacity
        onPress={() => dispatch(showManagePalletMenu(false))}
        activeOpacity={1}
        disabled={!pallets.managePalletMenu}
        style={pallets.managePalletMenu ? styles.disabledContainer : styles.container}
      >
        <ManagePalletScreen
          dispatch={dispatch}
          useEffectHook={useEffect}
          isManualScanEnabled={isManualScanEnabled}
          palletInfo={pallets.palletInfo}
          items={pallets.items}
          navigation={navigation}
          route={route}
          getItemDetailsfromUpcApi={getItemDetailsfromUpcApi}
          itemSaveIndex={itemSaveIndex}
          setItemSaveIndex={setItemSaveIndex}
          updateItemQtyAPI={updateItemQtyAPI}
        />
      </TouchableOpacity>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        index={0}
        onDismiss={() => dispatch(showManagePalletMenu(false))}
        style={styles.bottomSheetModal}
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
    </BottomSheetModalProvider>
  );
};

export default ManagePallet;
