import React, { EffectCallback, useEffect, useState } from 'react';
import {
  EmitterSubscription,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';
import { barcodeEmitter, openCamera } from '../../utils/scannerUtils';
import styles from './CombinePallets.style';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { CombinePallet, PalletItem } from '../../models/PalletManagementTypes';
import Button from '../../components/buttons/Button';
import LocationManualScan from '../../components/LocationManualScan/LocationManualScan';
import { validateSession } from '../../utils/sessionTimeout';
import { trackEvent } from '../../utils/AppCenterTool';
import { setScannedEvent } from '../../state/actions/Global';
import { clearCombinePallet } from '../../state/actions/PalletManagement';

interface CombinePalletsProps {
  combinePallets: CombinePallet[];
  palletId: number;
  palletItems: PalletItem[];
  isManualScanEnabled: boolean;
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  dispatch: Dispatch<any>;
  scanText: string;
  setScanText: React.Dispatch<React.SetStateAction<string>>;
}
const nonNumRegex = new RegExp(/[^0-9]/g);

const PalletCard = ({ item }: { item: CombinePallet }) => (
  <View style={styles.palletCardContainer}>
    <View style={styles.textContainer}>
      <Text style={styles.palletText}>
        {`${strings('PALLET.PALLET_ID')}: ${item.palletId}`}
      </Text>
      <Text style={styles.itemText}>
        {`${strings('GENERICS.ITEMS')}: ${item.itemCount}`}
      </Text>
    </View>
    <TouchableOpacity style={styles.trashIcon} onPress={undefined}>
      <Icon name="trash-can" size={30} color={COLOR.TRACKER_GREY} />
    </TouchableOpacity>
  </View>
);

const ScanPalletComponent = (
  scanText: string,
  setScanText: React.Dispatch<React.SetStateAction<string>>,
  onPress?: () => void
): JSX.Element => (
  <View style={styles.scanContainer}>
    <TouchableOpacity onPress={() => openCamera()}>
      <Icon size={100} name="barcode-scan" color={COLOR.BLACK} />
    </TouchableOpacity>
    <View style={styles.scanText}>
      <Text>{strings('PALLET.SCAN_PALLET')}</Text>
    </View>
    <View style={styles.orText}>
      <Text>{strings('GENERICS.OR')}</Text>
    </View>
    <View style={styles.textView}>
      <TextInput
        value={scanText}
        onChangeText={(text: string) => setScanText(text.replace(nonNumRegex, ''))}
        style={styles.textInput}
        keyboardType="numeric"
        placeholder={strings('PALLET.ENTER_PALLET_ID')}
        onSubmitEditing={onPress}
      />
    </View>
  </View>
);
export const CombinePalletsScreen = (
  props: CombinePalletsProps
): JSX.Element => {
  const {
    combinePallets,
    palletId,
    palletItems,
    isManualScanEnabled,
    useEffectHook,
    route,
    navigation,
    dispatch,
    scanText,
    setScanText
  } = props;
  let scannedSubscription: EmitterSubscription;

  // Scanner listener
  useEffectHook(() => {
    scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused() && combinePallets.length < 2) {
        validateSession(navigation, route.name).then(() => {
          trackEvent('combine_pallet_scanned', {
            barcode: scan.value,
            type: scan.type
          });
          dispatch(setScannedEvent(scan));
          setScanText(scan.value);
        });
      }
    });
    return () => {
      scannedSubscription.remove();
    };
  }, []);

  // TODO clear combine pallets API when implemented
  useEffectHook(() => {
    navigation.addListener('beforeRemove', () => {
      // Clear Combine Pallets state
      dispatch(clearCombinePallet());
    });
  }, []);
  return (
    <View style={styles.container}>
      {combinePallets.length !== 0 ? (
        <>
          {isManualScanEnabled && <LocationManualScan />}
          <FlatList
            data={combinePallets}
            renderItem={PalletCard}
            keyExtractor={(item: CombinePallet) => item.palletId.toString()}
          />
          <View style={styles.palletContainer}>
            <Text style={styles.mergeText}>
              {strings('PALLET.PALLET_MERGE')}
            </Text>
            <View style={styles.palletInfoHeader}>
              <Text style={styles.palletText}>
                {`${strings('LOCATION.PALLET')}: ${palletId}`}
              </Text>
              <Text style={styles.itemText}>
                {`${strings('GENERICS.ITEMS')}: ${palletItems.length}`}
              </Text>
            </View>
            <View style={styles.saveButton}>
              <Button
                title={strings('GENERICS.SAVE')}
                type={Button.Type.PRIMARY}
                style={{ width: '90%' }}
                onPress={() => undefined} // TODO add dispatch call to Combine Pallet
              />
            </View>
          </View>
        </>
      ) : (
        ScanPalletComponent(scanText, setScanText, undefined)
      )}
    </View>
  );
};
const CombinePallets = (): JSX.Element => {
  const { combinePallets, palletInfo, items } = useTypedSelector(
    state => state.PalletManagement
  );
  const isManualScanEnabled = useTypedSelector(
    state => state.Global.isManualScanEnabled
  );
  const [scanText, setScanText] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  return (
    <CombinePalletsScreen
      combinePallets={combinePallets}
      palletId={palletInfo.id}
      palletItems={items}
      isManualScanEnabled={isManualScanEnabled}
      useEffectHook={useEffect}
      route={route}
      navigation={navigation}
      dispatch={dispatch}
      scanText={scanText}
      setScanText={setScanText}
    />
  );
};

export default CombinePallets;
