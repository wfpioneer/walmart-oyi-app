import React, {
  EffectCallback, useEffect, useMemo, useRef
} from 'react';
import {
  EmitterSubscription, FlatList, Text, TouchableOpacity, View
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider
} from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import styles from './ManagePallet.style';
import { strings } from '../../locales';
import ManualScan from '../../components/manualscan/ManualScan';
import Button from '../../components/buttons/Button';
import { barcodeEmitter } from '../../utils/scannerUtils';
import { PalletInfo, PalletItem } from '../../models/PalletManagementTypes';
import COLOR from '../../themes/Color';
import BottomSheetAddCard from '../../components/BottomSheetAddCard/BottomSheetAddCard';
import { showManagePalletMenu } from '../../state/actions/PalletManagement';

interface ManagePalletProps {
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  isManualScanEnabled: boolean;
  palletInfo: PalletInfo;
  items: PalletItem[];
}

const getNumberOfDeleted = (items: PalletItem[]): number => items.reduce(
  (previousValue, currentValue) => previousValue + +currentValue.deleted,
  0
);

const enableSave = (items: PalletItem[]): boolean => {
  const modifiedArray = items.filter(
    (item: PalletItem) => item.quantity !== item.newQuantity || item.deleted || item.added
  );
  return modifiedArray.length > 0;
};

// TODO implement palletItemCard
const tempItemCard = ({ item }: { item: PalletItem }) => {
  if (!item.deleted) {
    return (
      <View>
        <Text>{item.itemDesc}</Text>
      </View>
    );
  }
  return null;
};

export const ManagePalletScreen = (props: ManagePalletProps): JSX.Element => {
  const {
    useEffectHook, isManualScanEnabled, palletInfo, items
  } = props;
  const { id, expirationDate } = palletInfo;
  let scannedSubscription: EmitterSubscription;
  // Scanner listener
  useEffectHook(() => {
    scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      // TODO implement scanning items and calling get item service
    });
    return () => {
      scannedSubscription.remove();
    };
  }, []);
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
      {enableSave(items) ? (
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
  const isManualScanEnabled = useTypedSelector(state => state.Global.isManualScanEnabled);
  const { palletInfo, managePalletMenu } = useTypedSelector(state => state.PalletManagement);
  const items = useTypedSelector(state => state.PalletManagement.items);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['15%'], []);

  useEffect(() => {
    if (navigation.isFocused() && bottomSheetModalRef.current) {
      if (managePalletMenu) {
        bottomSheetModalRef.current.present();
      } else {
        bottomSheetModalRef.current.dismiss();
      }
    }
  }, [managePalletMenu]);
  const handleCombinePallets = () => {
    bottomSheetModalRef.current?.dismiss();
    navigation.navigate('CombinePallets');
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
          useEffectHook={useEffect}
          isManualScanEnabled={isManualScanEnabled}
          palletInfo={palletInfo}
          items={items}
        />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          index={0}
          style={styles.bottomSheetModal}
        >
          <BottomSheetAddCard
            isManagerOption={true}
            isVisible={true}
            text={strings('PALLET.COMBINE_PALLETS')}
            onPress={handleCombinePallets}
          />
        </BottomSheetModal>
      </TouchableOpacity>
    </BottomSheetModalProvider>
  );
};

export default ManagePallet;
