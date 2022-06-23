import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import React, { Dispatch, EffectCallback, useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import { barcodeEmitter, openCamera } from '../../utils/scannerUtils';
import { trackEvent } from '../../utils/AppCenterTool';
import { validateSession } from '../../utils/sessionTimeout';
import { setScannedEvent } from '../../state/actions/Global';
import { strings } from '../../locales';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { styles } from './ScanLocation.style';
import COLOR from '../../themes/Color';
import LocationManualScan from '../../components/LocationManualScan/LocationManualScan';
import { AsyncState } from '../../models/AsyncState';
import { addPallet } from '../../state/actions/saga';
import { SNACKBAR_TIMEOUT } from '../../utils/global';

interface ScanLocationProps {
  addPalletAPI: AsyncState;
  dispatch: Dispatch<any>;
  isManualScanEnabled: boolean;
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  trackEventCall: (eventName: string, params?: any) => void;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  validateSessionCall: (
    navigation: NavigationProp<any>,
    route?: string
  ) => Promise<void>;
}
const updatePalletLocationHook = (
  addPalletAPI: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>
) => {
  // on api success
  // eslint-disable-next-line no-empty
  if (!addPalletAPI.isWaiting && addPalletAPI.result) {
    // dispatch(getSectionDetails({ sectionId: section.id.toString() }));
    // dispatch(showSnackBar(strings('LOCATION.PALLET_ADDED'), 3000));
    Toast.show({
      type: 'success',
      position: 'bottom',
      text1: strings('LOCATION.PALLET_ADDED'),
      visibilityTime: SNACKBAR_TIMEOUT
    });
    navigation.goBack();
  }

  // on api failure
  if (!addPalletAPI.isWaiting && addPalletAPI.error) {
    if (addPalletAPI.error === 'Request failed with status code 409') {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: strings('LOCATION.PALLET_ERROR'),
        text2: strings('LOCATION.PALLET_NOT_FOUND'),
        visibilityTime: SNACKBAR_TIMEOUT
      });
    } else {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: strings('LOCATION.ADD_PALLET_ERROR'),
        text2: strings('LOCATION.ADD_PALLET_API_ERROR'),
        visibilityTime: SNACKBAR_TIMEOUT
      });
    }
  }
};
const ScanLocationScreen = (props: ScanLocationProps) => {
  const {
    addPalletAPI,
    dispatch,
    isManualScanEnabled,
    navigation,
    route,
    trackEventCall,
    useEffectHook,
    validateSessionCall
  } = props;
  // Scanner listener
  useEffectHook(() => {
    const scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused()) {
        validateSessionCall(navigation, route.name).then(() => {
          trackEventCall('scan_pallet_to_section', {
            value: scan.value,
            type: scan.type
          });
          dispatch(addPallet({ palletId: '0', sectionId: scan.value })); // Double check code
          dispatch(setScannedEvent(scan));
        });
      }
    });
    return () => {
      scannedSubscription.remove();
    };
  }, []);

  // Add Pallet API
  useEffectHook(() => updatePalletLocationHook(addPalletAPI, dispatch, navigation));
  return (
    <View style={styles.container}>
      {isManualScanEnabled && <LocationManualScan keyboardType="default" />}
      <View style={styles.scanContainer}>
        <TouchableOpacity onPress={() => openCamera()}>
          <MaterialCommunityIcons
            size={100}
            name="barcode-scan"
            color={COLOR.BLACK}
          />
        </TouchableOpacity>
        <View style={styles.scanText}>
          <Text>{strings('LOCATION.SCAN_INSTRUCTION')}</Text>
        </View>
      </View>
    </View>
  );
};
export const ScanLocation = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { isManualScanEnabled } = useTypedSelector(state => state.Global);
  const addPalletAPI = useTypedSelector(state => state.async.addPallet);
  return (
    <ScanLocationScreen
      addPalletAPI={addPalletAPI}
      dispatch={dispatch}
      isManualScanEnabled={isManualScanEnabled}
      navigation={navigation}
      route={route}
      trackEventCall={trackEvent}
      useEffectHook={useEffect}
      validateSessionCall={validateSession}
    />
  );
};
