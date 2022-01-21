import React, { Dispatch, EffectCallback, useEffect, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  EmitterSubscription,
  FlatList,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
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
import { getItemDetailsUPC } from '../../state/actions/saga';
import { AsyncState } from '../../models/AsyncState';
import BottomSheetPrintCard from '../../components/BottomSheetPrintCard/BottomSheetPrintCard';
import BottomSheetAddCard from '../../components/BottomSheetAddCard/BottomSheetAddCard';
import BottomSheetClearCard from '../../components/BottomSheetClearCard/BottomSheetClearCard';
import Button from '../../components/buttons/Button';
import { PalletInfo, PalletItem } from '../../models/PalletManagementTypes';
import { addItemToPallet, showManagePalletMenu } from '../../state/actions/PalletManagement';

interface ManagePalletProps {
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  isManualScanEnabled: boolean;
  palletInfo: PalletInfo;
  items: PalletItem[];
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  dispatch: Dispatch<any>;
  getItemDetailsfromUpcApi: AsyncState;
}

const getNumberOfDeleted = (items: PalletItem[]): number => items.reduce((previousValue, currentValue) =>
  previousValue + +currentValue.deleted, 0);

const enableSave = (items: PalletItem[]): boolean => {
  const modifiedArray = items.filter((item: PalletItem) => item.quantity !== item.newQuantity
    || item.deleted || item.added);
  return modifiedArray.length > 0;
};

// TODO implement palletItemCard
const tempItemCard = ({ item }: { item: PalletItem }) => {
  if (!item.deleted) {
    return (
      <View>
        <Text>
          {item.itemDesc}
        </Text>
      </View>
    );
  }
  return null;
};

export const ManagePalletScreen = (props: ManagePalletProps): JSX.Element => {
  const {
    useEffectHook, isManualScanEnabled, palletInfo, items, navigation, route, dispatch,
    getItemDetailsfromUpcApi
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
            renderItem={tempItemCard}
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
          useEffectHook={useEffect}
          isManualScanEnabled={isManualScanEnabled}
          palletInfo={pallets.palletInfo}
          items={pallets.items}
          navigation={navigation}
          route={route}
          dispatch={dispatch}
          getItemDetailsfromUpcApi={getItemDetailsfromUpcApi}
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
