import React, {
  MutableRefObject, useCallback, useEffect, useRef, useState
} from 'react';
import {
  BackHandler,
  EmitterSubscription,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  Text,
  View
} from 'react-native';
import { head } from 'lodash';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import Toast from 'react-native-toast-message';
import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Config from 'react-native-config';
import { trackEvent } from '../../utils/AppCenterTool';
import { barcodeEmitter, openCamera } from '../../utils/scannerUtils';
import { validateSession } from '../../utils/sessionTimeout';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';
import styles from './Binning.style';
import ManualScan from '../../components/manualscan/ManualScan';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import {
  getPalletDetails
} from '../../state/actions/saga';
import {
  GET_PALLET_DETAILS
} from '../../state/actions/asyncAPI';
import { AsyncState } from '../../models/AsyncState';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { BinningPallet } from '../../models/Binning';
import { addPallet, clearPallets } from '../../state/actions/Binning';
import { resetScannedEvent, setScannedEvent } from '../../state/actions/Global';
import { UseStateType } from '../../models/Generics.d';
import { CustomModalComponent } from '../Modal/Modal';
import Button, { ButtonType } from '../../components/buttons/Button';

const SCREEN_NAME = 'Binning_Screen';
export interface BinningScreenProps {
  scannedPallets: BinningPallet[];
  route: RouteProp<any, string>;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  isManualScanEnabled: boolean;
  useEffectHook: typeof useEffect;
  useFocusEffectHook: typeof useFocusEffect;
  useCallbackHook: typeof useCallback;
  getPalletDetailsApi: AsyncState;
  scannedEvent: { value: any; type: string | null};
  isMounted: MutableRefObject<boolean>;
  trackEventCall: typeof trackEvent;
  displayWarningModalState: UseStateType<boolean>;
}

const onValidateHardwareBackPress = (
  setDisplayWarningModal: UseStateType<boolean>[1],
  scannedPallets: BinningPallet[]
) => {
  if (scannedPallets.length > 0) {
    setDisplayWarningModal(true);
    return true;
  }
  return false;
};

const ItemSeparator = () => <View style={styles.separator} />;

const resetApis = (dispatch: Dispatch<any>) => {
  dispatch({ type: GET_PALLET_DETAILS.RESET });
};

const navigateAssignLocationScreen = (
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  route: RouteProp<any>
) => {
  dispatch(resetScannedEvent());
  navigation.navigate('AssignLocation', route.params);
};

export const BinningScreen = (props: BinningScreenProps): JSX.Element => {
  const {
    scannedPallets, isManualScanEnabled, dispatch, navigation, route,
    useEffectHook, useFocusEffectHook, useCallbackHook, getPalletDetailsApi, scannedEvent,
    isMounted, trackEventCall, displayWarningModalState
  } = props;
  const [displayWarningModal, setDisplayWarningModal] = displayWarningModalState;

  const palletExistForBinnning = scannedPallets.length > 0;

  let scannedSubscription: EmitterSubscription;

  // Scanner listener
  useEffectHook(() => {
    scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused()) {
        dispatch(setScannedEvent(scan));
      }
    });
    return () => {
      scannedSubscription.remove();
    };
  }, []);

  // validation on app back press
  useEffectHook(() => {
    const navigationListener = navigation.addListener('beforeRemove', e => {
      if (scannedPallets.length > 0) {
        setDisplayWarningModal(true);
        e.preventDefault();
      }
    });
    return navigationListener;
  }, [navigation, scannedPallets]);

  useEffectHook(() => {
    if (displayWarningModal && !palletExistForBinnning) {
      setDisplayWarningModal(false);
      navigation.goBack();
    }
  }, [palletExistForBinnning, displayWarningModal]);

  // validation on Hardware backPress
  useFocusEffectHook(
    useCallbackHook(() => {
      const onHardwareBackPress = () => onValidateHardwareBackPress(setDisplayWarningModal, scannedPallets);
      BackHandler.addEventListener('hardwareBackPress', onHardwareBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onHardwareBackPress);
    }, [])
  );

  useEffectHook(() => {
    if (isMounted.current) {
      if (navigation.isFocused()) {
        validateSession(navigation, route.name).then(() => {
          const alreadyScannedPallet = scannedPallets.find(item => item.id === scannedEvent.value);
          if (alreadyScannedPallet) {
            Toast.show({
              type: 'info',
              text1: strings('PALLET.PALLET_EXISTS'),
              visibilityTime: 3000,
              position: 'bottom'
            });
          } else if (scannedEvent.value) {
            trackEventCall(SCREEN_NAME, {
              action: 'pallet_scanned',
              barcode: scannedEvent.value,
              type: scannedEvent.type ?? ''
            });
            dispatch(getPalletDetails({ palletIds: [scannedEvent.value] }));
          }
        });
      }
    } else {
      isMounted.current = true;
    }
  }, [scannedEvent]);

  useEffectHook(() => {
    // on api success
    if (!getPalletDetailsApi.isWaiting && getPalletDetailsApi.result) {
      if (getPalletDetailsApi.result.status === 200) {
        const {
          pallets
        } = getPalletDetailsApi.result.data;
        const newPallet = head(pallets) as BinningPallet;
        trackEventCall(SCREEN_NAME, {
          action: 'added_pallet_to_bin_list',
          palletId: newPallet.id
        });
        navigateAssignLocationScreen(dispatch, navigation, route);
        dispatch(addPallet(newPallet));
      } else if (getPalletDetailsApi.result.status === 204) {
        Toast.show({
          type: 'error',
          text1: strings('LOCATION.PALLET_NOT_FOUND'),
          visibilityTime: 3000,
          position: 'bottom'
        });
      }
      dispatch(hideActivityModal());
      resetApis(dispatch);
    }
    // on api error
    if (!getPalletDetailsApi.isWaiting && getPalletDetailsApi.error) {
      dispatch(hideActivityModal());
      Toast.show({
        type: 'error',
        text1: strings('LOCATION.ADD_PALLET_ERROR'),
        text2: strings('GENERICS.TRY_AGAIN'),
        visibilityTime: 4000,
        position: 'bottom'
      });
      resetApis(dispatch);
    }
    // on api request
    if (getPalletDetailsApi.isWaiting) {
      dispatch(showActivityModal());
    }
  }, [getPalletDetailsApi]);

  const handleUnhandledTouches = () => {
    Keyboard.dismiss();
    return false;
  };

  const backConfirmed = () => {
    setDisplayWarningModal(false);
    dispatch(clearPallets());
    navigation.goBack();
  };

  const renderWarningModal = () => (
    <CustomModalComponent
      isVisible={displayWarningModal}
      onClose={() => setDisplayWarningModal(false)}
      modalType="Popup"
    >
      <>
        <View>
          <Text style={styles.labelHeader}>{strings('BINNING.WARNING_LABEL')}</Text>
          <Text style={styles.message}>{strings('BINNING.WARNING_DESCRIPTION')}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            style={styles.buttonAlign}
            title={strings('GENERICS.CANCEL')}
            titleColor={COLOR.MAIN_THEME_COLOR}
            type={ButtonType.SOLID_WHITE}
            onPress={() => setDisplayWarningModal(false)}
          />
          <Button
            style={styles.buttonAlign}
            title={strings('GENERICS.OK')}
            type={ButtonType.PRIMARY}
            onPress={backConfirmed}
          />
        </View>
      </>
    </CustomModalComponent>
  );

  return (
    <KeyboardAvoidingView
      style={styles.safeAreaView}
      behavior="height"
      keyboardVerticalOffset={110}
      onStartShouldSetResponder={handleUnhandledTouches}
    >
      {renderWarningModal()}
      <View style={styles.container}>
        {isManualScanEnabled && <ManualScan placeholder={strings('PALLET.ENTER_PALLET_ID')} />}
        {palletExistForBinnning
          && (
          <View>
            <Text style={styles.helperText}>{strings('BINNING.SCAN_PALLET_BIN')}</Text>
            <ItemSeparator />
          </View>
          )}
        <View style={styles.emptyFlatListContainer}>
          <View style={styles.scanContainer}>
            <Pressable onPress={() => {
              if (Config.ENVIRONMENT === 'dev' || Config.ENVIRONMENT === 'stage') {
                return openCamera();
              }
              return null;
            }}
            >
              <Icon size={100} name="barcode-scan" color={COLOR.BLACK} />
            </Pressable>
            <View style={styles.scanText}>
              <Text>{strings('BINNING.SCAN_PALLET')}</Text>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const Binning = (): JSX.Element => {
  const scannedPallets = useTypedSelector(state => state.Binning.pallets);
  const { scannedEvent, isManualScanEnabled } = useTypedSelector(state => state.Global);
  const getPalletDetailsApi = useTypedSelector(state => state.async.getPalletDetails);
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const isMounted = useRef(false);
  const displayWarningModalState = useState(false);

  return (
    <BinningScreen
      scannedPallets={scannedPallets}
      dispatch={dispatch}
      route={route}
      navigation={navigation}
      useEffectHook={useEffect}
      useCallbackHook={useCallback}
      useFocusEffectHook={useFocusEffect}
      isManualScanEnabled={isManualScanEnabled}
      getPalletDetailsApi={getPalletDetailsApi}
      scannedEvent={scannedEvent}
      isMounted={isMounted}
      trackEventCall={trackEvent}
      displayWarningModalState={displayWarningModalState}
    />
  );
};

export default Binning;
