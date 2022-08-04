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
import { strings } from '../../locales';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { styles } from './ScanLocation.style';
import COLOR from '../../themes/Color';
import LocationManualScan from '../../components/LocationManualScan/LocationManualScan';
import { AsyncState } from '../../models/AsyncState';
import { addPallet } from '../../state/actions/saga';
import { SNACKBAR_TIMEOUT } from '../../utils/global';
import {
  hideActivityModal,
  showActivityModal
} from '../../state/actions/Modal';
import { ADD_PALLET } from '../../state/actions/asyncAPI';
import { clearSelectedWorklistPalletId } from '../../state/actions/PalletWorklist';

interface ScanLocationProps {
  addPalletAPI: AsyncState;
  dispatch: Dispatch<any>;
  isManualScanEnabled: boolean;
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  selectedPalletId: string;
  trackEventCall: (eventName: string, params?: any) => void;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  validateSessionCall: (
    navigation: NavigationProp<any>,
    route?: string
  ) => Promise<void>;
}
export const updatePalletLocationHook = (
  addPalletAPI: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>
) => {
  // on api success
  if (!addPalletAPI.isWaiting && addPalletAPI.result) {
    dispatch(hideActivityModal());
    Toast.show({
      type: 'success',
      position: 'bottom',
      text1: strings('LOCATION.PALLET_ADDED'),
      visibilityTime: SNACKBAR_TIMEOUT
    });
    dispatch({ type: ADD_PALLET.RESET });
    dispatch(clearSelectedWorklistPalletId());
    navigation.goBack();
  }

  // on api failure
  if (!addPalletAPI.isWaiting && addPalletAPI.error) {
    dispatch(hideActivityModal());
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
    dispatch({ type: ADD_PALLET.RESET });
  }

  // on api request
  if (addPalletAPI.isWaiting) {
    dispatch(showActivityModal());
  }
};

export const ScanLocationScreen = (props: ScanLocationProps) => {
  const {
    addPalletAPI,
    dispatch,
    isManualScanEnabled,
    navigation,
    route,
    selectedPalletId,
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
          const isManualScan = scan.type === 'manual';
          dispatch(
            addPallet({
              palletId: selectedPalletId,
              sectionId: !isManualScan ? scan.value : null,
              locationName: isManualScan ? scan.value : null
            })
          );
        });
      }
    });
    return () => {
      scannedSubscription.remove();
    };
  }, []);

  // Add Pallet API
  useEffectHook(
    () => updatePalletLocationHook(addPalletAPI, dispatch, navigation),
    [addPalletAPI]
  );
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
  const selectedWorklistPalletId = useTypedSelector(
    state => state.PalletWorklist.selectedWorklistPalletId
  );

  return (
    <ScanLocationScreen
      addPalletAPI={addPalletAPI}
      dispatch={dispatch}
      isManualScanEnabled={isManualScanEnabled}
      navigation={navigation}
      route={route}
      selectedPalletId={selectedWorklistPalletId}
      trackEventCall={trackEvent}
      useEffectHook={useEffect}
      validateSessionCall={validateSession}
    />
  );
};
