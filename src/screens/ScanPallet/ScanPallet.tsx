import React, { EffectCallback, useEffect } from 'react';
import {
  EmitterSubscription, Text, TouchableOpacity, View
} from 'react-native';
import { trackEvent } from 'appcenter-analytics';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import Toast from 'react-native-toast-message';
import {
  NavigationProp, RouteProp, useNavigation, useRoute
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Config from 'react-native-config';
import { barcodeEmitter, openCamera } from '../../utils/scannerUtils';
import { validateSession } from '../../utils/sessionTimeout';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';
import styles from './ScanPallet.style';
import ManualScan from '../../components/manualscan/ManualScan';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { resetScannedEvent, setScannedEvent } from '../../state/actions/Global';
import { SNACKBAR_TIMEOUT } from '../../utils/global';

export interface ScanPalletScreenProps {
    route: RouteProp<any, string>;
    dispatch: Dispatch<any>;
    navigation: NavigationProp<any>;
    isManualScanEnabled: boolean;
    useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
    scannedEvent: { type: string | null; value: string | null };
    trackEventCall: (eventName: string, params?: any) => void;
    validateSessionCall: (navigation: NavigationProp<any>, route?: string) => Promise<void>;
    selectedWorklistPalletId: string;
  }

const navigateScanLocationScreen = (navigation: NavigationProp<any>) => {
  navigation.navigate('ScanLocation');
};

export const getScannedPalletEffect = (
  navigation: NavigationProp<any>,
  scannedEvent: { type: string | null; value: string | null },
  selectedWorklistPalletId: string,
  dispatch: Dispatch<any>
) => {
  if (navigation.isFocused() && scannedEvent.value) {
    if (scannedEvent.value === selectedWorklistPalletId) {
      navigateScanLocationScreen(navigation);
    } else {
      Toast.show({
        type: 'error',
        text1: strings('WORKLIST.SCAN_PALLET_ERROR'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
    }
    dispatch(resetScannedEvent());
  }
};

export const ScanPalletScreen = (props: ScanPalletScreenProps): JSX.Element => {
  const {
    isManualScanEnabled, dispatch, navigation, route, useEffectHook,
    scannedEvent, validateSessionCall, trackEventCall, selectedWorklistPalletId
  } = props;

  let scannedSubscription: EmitterSubscription;

  // Scanner listener
  useEffectHook(() => {
    scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused()) {
        validateSessionCall(navigation, route.name).then(() => {
          trackEventCall('section_details_scan', { value: scan.value, type: scan.type });
          dispatch(setScannedEvent(scan));
        });
      }
    });
    return () => {
      scannedSubscription.remove();
    };
  }, []);

  useEffectHook(() => getScannedPalletEffect(
    navigation, scannedEvent, selectedWorklistPalletId, dispatch
  ), [scannedEvent]);

  return (
    <View style={styles.container}>
      {isManualScanEnabled && <ManualScan placeholder={strings('PALLET.ENTER_PALLET_ID')} />}
      <View style={styles.scanContainer}>
        <TouchableOpacity onPress={() => {
          if (Config.ENVIRONMENT === 'dev' || Config.ENVIRONMENT === 'stage') {
            return openCamera();
          }
          return null;
        }}
        >
          <Icon size={100} name="barcode-scan" color={COLOR.BLACK} />
        </TouchableOpacity>
        <View style={styles.scanText}>
          <Text>{strings('WORKLIST.SCAN_PALLET_LABEL')}</Text>
        </View>
      </View>
    </View>
  );
};

const ScanPallet = (): JSX.Element => {
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const { scannedEvent, isManualScanEnabled } = useTypedSelector(state => state.Global);
  const selectedWorklistPalletId = useTypedSelector(state => state.PalletWorklist.selectedWorklistPalletId);

  return (
    <ScanPalletScreen
      dispatch={dispatch}
      route={route}
      navigation={navigation}
      useEffectHook={useEffect}
      trackEventCall={trackEvent}
      validateSessionCall={validateSession}
      isManualScanEnabled={isManualScanEnabled}
      scannedEvent={scannedEvent}
      selectedWorklistPalletId={selectedWorklistPalletId}
    />
  );
};

export default ScanPallet;
