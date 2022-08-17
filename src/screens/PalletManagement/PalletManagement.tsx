import React, {
  Dispatch, EffectCallback, useEffect, useState
} from 'react';
import {
  ActivityIndicator,
  EmitterSubscription,
  Text,
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
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import COLOR from '../../themes/Color';
import styles from './PalletManagement.style';
import { strings } from '../../locales';
import { barcodeEmitter, openCamera } from '../../utils/scannerUtils';
import { validateSession } from '../../utils/sessionTimeout';
import { getPalletConfig, getPalletDetails } from '../../state/actions/saga';
import { AsyncState } from '../../models/AsyncState';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { trackEvent } from '../../utils/AppCenterTool';
import { setCreatePalletState, setPerishableCategories, setupPallet } from '../../state/actions/PalletManagement';
import { GET_PALLET_CONFIG, GET_PALLET_DETAILS } from '../../state/actions/asyncAPI';
import { Pallet, PalletItem } from '../../models/PalletManagementTypes';
import { Configurations } from '../../models/User';
import ManualScan from '../../components/manualscan/ManualScan';
import Button, { ButtonType } from '../../components/buttons/Button';

interface PalletManagementProps {
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  configComplete: boolean;
  setConfigComplete: React.Dispatch<React.SetStateAction<boolean>>;
  getInfoComplete: boolean;
  setGetInfoComplete: React.Dispatch<React.SetStateAction<boolean>>;
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  dispatch: Dispatch<any>;
  getPalletDetailsApi: AsyncState;
  getPalletConfigApi: AsyncState;
  userConfig: Configurations;
  isManualScanEnabled: boolean;
}

export const showActivitySpinner = (
  configWaiting: boolean,
  getInfoWaiting: boolean,
  getInfoCompleted: boolean
) => (getInfoWaiting && configWaiting) || (getInfoWaiting) || (configWaiting && getInfoCompleted);

export const getPalletDetailsApiHook = (
  getPalletDetailsApi: AsyncState,
  dispatch: Dispatch<any>,
  setGetInfoComplete: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // on api success
  if (!getPalletDetailsApi.isWaiting && getPalletDetailsApi.result) {
    if (getPalletDetailsApi.result.status === 200) {
      const {
        id, createDate, expirationDate, items
      } = getPalletDetailsApi.result.data.pallets[0];
      const palletItems = items.map((item: PalletItem) => ({
        ...item,
        quantity: item.quantity || 0,
        newQuantity: item.quantity || 0,
        deleted: false,
        added: false
      }));
      const palletDetails: Pallet = {
        palletInfo: {
          id,
          createDate,
          expirationDate
        },
        items: palletItems
      };
      dispatch(setupPallet(palletDetails));
      setGetInfoComplete(true);
    } else if (getPalletDetailsApi.result.status === 204) {
      Toast.show({
        type: 'error',
        text1: strings('LOCATION.PALLET_NOT_FOUND'),
        visibilityTime: 3000,
        position: 'bottom'
      });
    }
  }

  // on api error
  if (!getPalletDetailsApi.isWaiting && getPalletDetailsApi.error) {
    Toast.show({
      type: 'error',
      text1: strings('PALLET.PALLET_DETAILS_ERROR'),
      text2: strings('GENERICS.TRY_AGAIN'),
      visibilityTime: 4000,
      position: 'bottom'
    });
  }
};

export const getPalletConfigHook = (
  getPalletConfigApi: AsyncState,
  dispatch: Dispatch<any>,
  setConfigComplete: React.Dispatch<React.SetStateAction<boolean>>,
  backupCategories: string
) => {
  // on api success
  if (!getPalletConfigApi.isWaiting && getPalletConfigApi.result) {
    const { perishableCategories } = getPalletConfigApi.result.data;
    dispatch(setPerishableCategories(perishableCategories));
    dispatch({ type: GET_PALLET_CONFIG.RESET });
    setConfigComplete(true);
  }
  // on api error
  if (getPalletConfigApi.error) {
    const backupPerishableCategories = backupCategories.split(',').map(Number);
    dispatch(setPerishableCategories(backupPerishableCategories));
    dispatch({ type: GET_PALLET_CONFIG.RESET });
    setConfigComplete(true);
  }
};

export const PalletManagementScreen = (
  props: PalletManagementProps
): JSX.Element => {
  const {
    useEffectHook,
    configComplete,
    setConfigComplete,
    getInfoComplete,
    setGetInfoComplete,
    navigation,
    route,
    dispatch,
    getPalletDetailsApi,
    getPalletConfigApi,
    userConfig,
    isManualScanEnabled
  } = props;

  let scannedSubscription: EmitterSubscription;

  // Resets Get PalletInfo api state when navigating off-screen
  useEffectHook(() => {
    navigation.addListener('blur', () => {
      if (getPalletDetailsApi.value) {
        dispatch({ type: GET_PALLET_DETAILS.RESET });
      }
    });
  }, [getPalletDetailsApi]);

  // Scanner listener
  useEffectHook(() => {
    dispatch(getPalletConfig());
    scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused()) {
        validateSession(navigation, route.name).then(() => {
          trackEvent('pallet_managment_scanned', {
            barcode: scan.value,
            type: scan.type
          });
          dispatch(
            getPalletDetails({ palletIds: [scan.value], isAllItems: true, isSummary: false })
          );
        });
      }
    });
    return () => {
      scannedSubscription.remove();
    };
  }, []);

  // Get Pallet Info Api
  useEffectHook(() => {
    if (navigation.isFocused()) {
      getPalletDetailsApiHook(getPalletDetailsApi, dispatch, setGetInfoComplete);
    }
  }, [getPalletDetailsApi]);

  // GetPalletConfig API
  useEffectHook(() => {
    if (navigation.isFocused()) {
      getPalletConfigHook(getPalletConfigApi, dispatch, setConfigComplete, userConfig.backupCategories);
    }
  }, [getPalletConfigApi]);

  useEffectHook(() => {
    if (navigation.isFocused()) {
      if (configComplete && getInfoComplete) {
        navigation.navigate('ManagePallet');
        setGetInfoComplete(false);
      }
    }
  }, [configComplete, getInfoComplete]);

  if (showActivitySpinner(getPalletConfigApi.isWaiting, getPalletDetailsApi.isWaiting, getInfoComplete)) {
    return (
      <ActivityIndicator
        animating={showActivitySpinner(getPalletConfigApi.isWaiting, getPalletDetailsApi.isWaiting, getInfoComplete)}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    );
  }

  return (
    <View style={styles.container}>
      {isManualScanEnabled && <ManualScan placeholder={strings('PALLET.ENTER_PALLET_ID')} />}
      <View style={styles.scanContainer}>
        <TouchableOpacity onPress={() => openCamera()}>
          <Icon size={100} name="barcode-scan" color={COLOR.BLACK} />
        </TouchableOpacity>
        <View style={styles.scanText}>
          <Text>{strings('PALLET.SCAN_PALLET')}</Text>
        </View>
        {userConfig.createPallet && (
        <>
          <View style={styles.orText}>
            <Text>{strings('GENERICS.OR')}</Text>
          </View>
          <Button
            title={strings('PALLET.CREATE_PALLET')}
            type={ButtonType.PRIMARY}
            style={styles.btnCreate}
            onPress={() => {
              dispatch(setCreatePalletState(true));
              navigation.navigate('ManagePallet');
            }}
          />
        </>
        )}
      </View>
    </View>
  );
};

const PalletManagement = (): JSX.Element => {
  const getPalletDetailsApi = useTypedSelector(state => state.async.getPalletDetails);
  const isManualScanEnabled = useTypedSelector(state => state.Global.isManualScanEnabled);
  const getPalletConfigApi = useTypedSelector(state => state.async.getPalletConfig);
  const userConfig = useTypedSelector(state => state.User.configs);
  const [configComplete, setConfigComplete] = useState(false);
  const [getInfoComplete, setGetInfoComplete] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  return (
    <PalletManagementScreen
      isManualScanEnabled={isManualScanEnabled}
      useEffectHook={useEffect}
      configComplete={configComplete}
      setConfigComplete={setConfigComplete}
      getInfoComplete={getInfoComplete}
      setGetInfoComplete={setGetInfoComplete}
      getPalletDetailsApi={getPalletDetailsApi}
      getPalletConfigApi={getPalletConfigApi}
      navigation={navigation}
      route={route}
      dispatch={dispatch}
      userConfig={userConfig}
    />
  );
};

export default PalletManagement;
