import React, { EffectCallback, useEffect } from 'react';
import {
  EmitterSubscription,
  FlatList,
  Text,
  View
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import styles from './ManagePallet.style';
import { strings } from '../../locales';
import ManualScan from '../../components/manualscan/ManualScan';
import Button from '../../components/buttons/Button';
import { barcodeEmitter } from '../../utils/scannerUtils';
import { PalletInfo, PalletItem } from '../../models/PalletManagementTypes';
import { setupPallet } from '../../state/actions/PalletManagement';
import COLOR from '../../themes/Color';

interface ManagePalletProps {
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  isManualScanEnabled: boolean;
  palletInfo: PalletInfo;
  items: PalletItem[];
}

const getNumberOfDeleted = (items: PalletItem[]): number => items.reduce((previousValue, currentValue) =>
  previousValue + +currentValue.deleted, 0);

const enableSave = (items: PalletItem[]): boolean => {
  const modifiedArray = items.filter((item: PalletItem) => item.quantity !== item.newQuantity
    || item.deleted || item.added);
  return modifiedArray.length > 0;
};

// TODO implement palletItemCard
const tempItemCard = ({ item }: { item: PalletItem }) => (
  <View>
    <Text>
      {item.description}
    </Text>
  </View>
);

export const ManagePalletScreen = (props: ManagePalletProps): JSX.Element => {
  const {
    useEffectHook, isManualScanEnabled, palletInfo, items
  } = props;
  const { palletId, expirationDate } = palletInfo;
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
            <Text style={styles.headerText}>
              {strings('PALLET.PALLET_ID')}
            </Text>
            <Text style={styles.headerItemText}>
              {palletId}
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
              {strings('PALLET.ITEMS')}
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
            keyExtractor={(item: PalletItem) => item.upc}
          />
        </View>
      </View>
      {enableSave(items) ? (
        <View style={styles.buttonContainer}>
          <Button
            title={strings('PALLET.SAVE')}
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
  const palletInfo = useTypedSelector(state => state.PalletManagement.palletInfo);
  const items = useTypedSelector(state => state.PalletManagement.items);
  const dispatch = useDispatch();
  // TODO remove this mock data when service to get pallet details has been impemented as when that service
  // TODO is complete the setupPallet action will be dispatched before navigating to this screen
  useEffect(() => {
    dispatch(setupPallet({
      palletInfo: {
        palletId: 1514,
        expirationDate: '01/31/2022'
      },
      items: [{
        itemNbr: 1234,
        upc: '1234567890',
        description: 'test',
        quantity: 3,
        newQuantity: 3,
        price: 10.00,
        category: 54,
        categoryDesc: 'test cat',
        deleted: true,
        added: false
      }]
    }));
  }, []);
  return (
    <ManagePalletScreen
      useEffectHook={useEffect}
      isManualScanEnabled={isManualScanEnabled}
      palletInfo={palletInfo}
      items={items}
    />
  );
};

export default ManagePallet;
