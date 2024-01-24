import React, { Dispatch, EffectCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  EmitterSubscription,
  Pressable,
  Text,
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
import Config from 'react-native-config';
import COLOR from '../../themes/Color';
import styles from './PalletManagement.style';
import { strings } from '../../locales';
import { barcodeEmitter, openCamera } from '../../utils/scannerUtils';
import { validateSession } from '../../utils/sessionTimeout';
import { getPalletDetails } from '../../state/actions/saga';
import { AsyncState } from '../../models/AsyncState';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { trackEvent } from '../../utils/AppCenterTool';
import {
  setCreatePalletState,
  setPerishableCategories,
  setupPallet
} from '../../state/actions/PalletManagement';
import { GET_PALLET_DETAILS } from '../../state/actions/asyncAPI';
import { Pallet, PalletItem } from '../../models/PalletManagementTypes';
import { Configurations } from '../../models/User';
import ManualScan from '../../components/manualscan/ManualScan';
import Button, { ButtonType } from '../../components/buttons/Button';

const SCREEN_NAME = 'Pallet_Management_Screen';
interface PalletManagementProps {
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  getInfoComplete: boolean;
  setGetInfoComplete: React.Dispatch<React.SetStateAction<boolean>>;
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  dispatch: Dispatch<any>;
  getPalletDetailsApi: AsyncState;
  userConfig: Configurations;
  isManualScanEnabled: boolean;
  trackEventCall: typeof trackEvent;
}

export const showActivitySpinner = (
  getInfoWaiting: boolean,
  getInfoCompleted: boolean
) => getInfoWaiting || getInfoCompleted;

export const navigateToPalletManageHook = (
  getInfoComplete: boolean,
  navigation: NavigationProp<any>,
  trackEventCall: (eventName: string, params?: any) => void,
  setGetInfoComplete: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (getInfoComplete) {
    trackEventCall(SCREEN_NAME, {
      action: 'initiating_manage_pallet_flow'
    });
    navigation.navigate('ManagePallet');
    setGetInfoComplete(false);
  }
};

export const setPerishableCategoriesHook = (
  perishableCategories: string,
  navigation: NavigationProp<any>,
  trackEventCall: (eventName: string, params?: any) => void,
  dispatch: Dispatch<any>,
  route: RouteProp<any, string>
) => {
  const backupPerishableCategories = perishableCategories
    .split('-')
    .map(Number);
  dispatch(setPerishableCategories(backupPerishableCategories));
  barcodeEmitter.addListener('scanned', scan => {
    if (navigation.isFocused()) {
      validateSession(navigation, route.name).then(() => {
        trackEventCall('pallet_managment_scanned', {
          barcode: scan.value,
          type: scan.type
        });
        dispatch(
          getPalletDetails({
            palletIds: [scan.value],
            isAllItems: true,
            isSummary: false
          })
        );
      });
    }
  });
};

export const getPalletDetailsApiHook = (
  getPalletDetailsApi: AsyncState,
  dispatch: Dispatch<any>,
  setGetInfoComplete: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // on api success
  if (!getPalletDetailsApi.isWaiting && getPalletDetailsApi.result) {
    if (getPalletDetailsApi.result.status === 200) {
      const { id, createDate, expirationDate, items } =
        getPalletDetailsApi.result.data.pallets[0];
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

export const PalletManagementScreen = (
  props: PalletManagementProps
): JSX.Element => {
  const {
    useEffectHook,
    getInfoComplete,
    setGetInfoComplete,
    navigation,
    route,
    dispatch,
    getPalletDetailsApi,
    userConfig,
    isManualScanEnabled,
    trackEventCall
  } = props;
  const { perishableCategories } = userConfig;
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
    setPerishableCategoriesHook(
      perishableCategories,
      navigation,
      trackEventCall,
      dispatch,
      route
    );
    return () => {
      scannedSubscription.remove();
    };
  }, []);

  // Get Pallet Info Api
  useEffectHook(() => {
    if (navigation.isFocused()) {
      getPalletDetailsApiHook(
        getPalletDetailsApi,
        dispatch,
        setGetInfoComplete
      );
    }
  }, [getPalletDetailsApi]);

  useEffectHook(() => {
    if (navigation.isFocused()) {
      navigateToPalletManageHook(
        getInfoComplete,
        navigation,
        trackEventCall,
        setGetInfoComplete
      );
    }
  }, [getInfoComplete]);
  const showActivitySpinnerResult = showActivitySpinner(
    getPalletDetailsApi.isWaiting,
    getInfoComplete
  );
  if (showActivitySpinnerResult) {
    return (
      <ActivityIndicator
        animating={showActivitySpinnerResult}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    );
  }

  return (
    <View style={styles.container}>
      {isManualScanEnabled && (
        <ManualScan placeholder={strings('PALLET.ENTER_PALLET_ID')} />
      )}
      <View style={styles.scanContainer}>
        <Pressable
          onPress={() => {
            if (
              Config.ENVIRONMENT === 'dev' ||
              Config.ENVIRONMENT === 'stage'
            ) {
              return openCamera();
            }
            return null;
          }}
        >
          <Icon size={100} name="barcode-scan" color={COLOR.BLACK} />
        </Pressable>
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
                trackEventCall(SCREEN_NAME, {
                  action: 'initiating_create_pallet_flow'
                });
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
  const getPalletDetailsApi = useTypedSelector(
    state => state.async.getPalletDetails
  );
  const isManualScanEnabled = useTypedSelector(
    state => state.Global.isManualScanEnabled
  );
  const userConfig = useTypedSelector(state => state.User.configs);
  const [getInfoComplete, setGetInfoComplete] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  return (
    <PalletManagementScreen
      isManualScanEnabled={isManualScanEnabled}
      useEffectHook={useEffect}
      getInfoComplete={getInfoComplete}
      setGetInfoComplete={setGetInfoComplete}
      getPalletDetailsApi={getPalletDetailsApi}
      navigation={navigation}
      route={route}
      dispatch={dispatch}
      userConfig={userConfig}
      trackEventCall={trackEvent}
    />
  );
};

export default PalletManagement;
