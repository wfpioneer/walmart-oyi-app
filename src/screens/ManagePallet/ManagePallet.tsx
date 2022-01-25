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
import { addPalletUPCs, getItemDetailsUPC } from '../../state/actions/saga';
import { AsyncState } from '../../models/AsyncState';
import BottomSheetPrintCard from '../../components/BottomSheetPrintCard/BottomSheetPrintCard';
import BottomSheetAddCard from '../../components/BottomSheetAddCard/BottomSheetAddCard';
import BottomSheetClearCard from '../../components/BottomSheetClearCard/BottomSheetClearCard';
import Button from '../../components/buttons/Button';
import { PalletInfo, PalletItem } from '../../models/PalletManagementTypes';
import {
  addItemToPallet, deleteItem, resetItems, setPalletItemNewQuantity, setPalletItems, showManagePalletMenu
} from '../../state/actions/PalletManagement';
import PalletItemCard from '../../components/PalletItemCard/PalletItemCard';
import { ADD_PALLET_UPCS, GET_ITEM_DETAIL_UPC } from '../../state/actions/asyncAPI';

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
}

const getNumberOfDeleted = (items: PalletItem[]): number => items.reduce(
  (previousValue, currentValue) => previousValue + +currentValue.deleted, 0
);

const isQuantityChanged = (item: PalletItem): boolean => !!(item.newQuantity && item.newQuantity !== item.quantity);

const enableSave = (items: PalletItem[]): boolean => {
  const modifiedArray = items.filter((item: PalletItem) => isQuantityChanged(item)
    || item.deleted || item.added);
  return modifiedArray.length > 0;
};

const handleDecreaseQuantity = (item: PalletItem, dispatch: Dispatch<any>) => {
  const currentQuantity = item.newQuantity || item.quantity;
  if (currentQuantity === 1) {
    // TODO delete item flow
    // don't forget to ask user if want to delete
  } else {
    dispatch(setPalletItemNewQuantity(item.itemNbr.toString(), currentQuantity - 1));
  }
};

const handleIncreaseQuantity = (item: PalletItem, dispatch: Dispatch<any>) => {
  const currentQuantity = item.newQuantity || item.quantity;
  dispatch(setPalletItemNewQuantity(item.itemNbr.toString(), currentQuantity + 1));
};

const handleTextChange = (item: PalletItem, dispatch: Dispatch<any>, text: string) => {
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
        maxValue={99}
        minValue={0}
        numberOfItems={item.newQuantity || item.quantity}
        price={item.price}
        upc={item.upcNbr}
      />
    );
  }
  return null;
};

export const onSavePress = (id: number, items: PalletItem[], dispatch: Dispatch<any>): void => {
  const addPalletItems = items.filter(item => item.added === true)
    .map(item => ({ ...item, quantity: item.newQuantity ?? item.quantity }));
  if (addPalletItems.length > 0) {
    dispatch(addPalletUPCs({ palletId: id, items: addPalletItems }));
  }
};
export const ManagePalletScreen = (props: ManagePalletProps): JSX.Element => {
  const {
    useEffectHook, isManualScanEnabled, palletInfo, items, navigation, route, dispatch,
    getItemDetailsfromUpcApi, addPalletUpcApi, isLoading, setIsLoading
  } = props;
  const { id, expirationDate } = palletInfo;
  let scannedSubscription: EmitterSubscription;

  // Clear API state before leaving this screen
  useEffectHook(() => navigation.addListener('beforeRemove', () => {
    // Suggestion add confirmation before leaving screen if they want to undo unsaved changes
    dispatch({ type: GET_ITEM_DETAIL_UPC.RESET });
    dispatch({ type: ADD_PALLET_UPCS.RESET });
  }));
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
        text2: strings('GENERICS.TRY_AGAIN'),
        visibilityTime: 4000,
        position: 'bottom'
      });
    }
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
        dispatch(setPalletItems(updatedPalletItems));
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
        text2: strings('GENERICS.TRY_AGAIN'),
        visibilityTime: 4000,
        position: 'bottom'
      });
      setIsLoading(false);
    }

    if (addPalletUpcApi.isWaiting) {
      setIsLoading(true);
    }
  }, [addPalletUpcApi]);

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
            onPress={() => onSavePress(id, items, dispatch)}
          />
        </View>
      ) : null}
    </View>
  );
};

const ManagePallet = (): JSX.Element => {
  const { palletInfo, managePalletMenu, items } = useTypedSelector(state => state.PalletManagement);
  const isManualScanEnabled = useTypedSelector(state => state.Global.isManualScanEnabled);
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const getItemDetailsfromUpcApi = useTypedSelector(state => state.async.getItemDetailsUPC);
  const addPalletUpcApi = useTypedSelector(state => state.async.addPalletUPCs);
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
          getItemDetailsfromUpcApi={getItemDetailsfromUpcApi}
          addPalletUpcApi={addPalletUpcApi}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          index={0}
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
      </TouchableOpacity>
    </BottomSheetModalProvider>
  );
};

export default ManagePallet;
