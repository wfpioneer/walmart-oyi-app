import React, { EffectCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  Text,
  View
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import { trackEvent } from 'appcenter-analytics';
import Toast from 'react-native-toast-message';
import Config from 'react-native-config';
import ManualScan from '../../components/manualscan/ManualScan';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { setManualScan } from '../../state/actions/Global';
import { barcodeEmitter, openCamera } from '../../utils/scannerUtils';
import { AsyncState } from '../../models/AsyncState';
import { strings } from '../../locales';
import { styles } from './NoActionScan.style';
import COLOR from '../../themes/Color';
import { NO_ACTION } from '../../state/actions/asyncAPI';
import { setActionCompleted } from '../../state/actions/ItemDetailScreen';
import { renderBarcodeErrorModal } from '../ReviewItemDetails/ReviewItemDetails';
import { noAction } from '../../state/actions/saga';
import { validateSession } from '../../utils/sessionTimeout';
import { SNACKBAR_TIMEOUT_LONG } from '../../utils/global';

const NO_ACTION_SCAN = 'No_Action_Scan';
export const COMPLETE_API_409_ERROR = 'Request failed with status code 409';
export const ITEM_SCAN_DOESNT_MATCH = 'ITEM.SCAN_DOESNT_MATCH';
export const ITEM_SCAN_DOESNT_MATCH_DETAILS = 'ITEM.SCAN_DOESNT_MATCH_DETAILS';

export interface NoActionScanScreenProps {
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  completeItemApi: AsyncState;
  isManualScanEnabled: boolean;
  trackEventCall: typeof trackEvent;
  route: RouteProp<any>;
  userId: string;
  actionCompleted: boolean;
  upcNbr: string;
  itemNbr: number;
  exceptionType: string | undefined | null;
  validateSessionCall: typeof validateSession;
  barcodeErrorState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

const handleUnhandledTouches = () => {
  Keyboard.dismiss();
  return false;
};

export const callBackbarcodeEmitter = (
  scan: any,
  upcNbr: string,
  itemNbr: number,
  userId: string,
  route: RouteProp<any>,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  setErrorModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
  trackEventCall: typeof trackEvent,
  validateSessionCall: typeof validateSession
) => {
  if (navigation.isFocused()) {
    validateSessionCall(navigation, route.name)
      .then(() => {
        trackEventCall(NO_ACTION_SCAN, {
          action: 'barcode_scan',
          value: scan.value,
          type: scan.type
        });
        if (!(scan.type.includes('QR Code') || scan.type.includes('QRCODE'))) {
          dispatch(
            noAction({
              upc: upcNbr,
              itemNbr,
              scannedValue: scan.value
            })
          );
          dispatch(setManualScan(false));
        } else {
          setErrorModalVisible(true);
        }
      })
      .catch(() => {
        trackEventCall('session_timeout', { user: userId });
      });
  }
};

export const completeItemApiHook = (
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  completeItemApi: AsyncState
) => {
  if (navigation.isFocused()) {
    // on api success
    if (!completeItemApi.isWaiting && completeItemApi.result) {
      dispatch({ type: NO_ACTION.RESET });
      if (completeItemApi.result.status === 204) {
        Toast.show({
          type: 'info',
          text1: strings(ITEM_SCAN_DOESNT_MATCH),
          text2: strings(ITEM_SCAN_DOESNT_MATCH_DETAILS),
          visibilityTime: SNACKBAR_TIMEOUT_LONG,
          position: 'bottom'
        });
      } else {
        dispatch(setActionCompleted());
        navigation.goBack();
        navigation.goBack();
      }
    }

    // on api failure
    if (!completeItemApi.isWaiting && completeItemApi.error) {
      dispatch({ type: NO_ACTION.RESET });
      if (completeItemApi.error === COMPLETE_API_409_ERROR) {
        Toast.show({
          type: 'error',
          text1: strings(ITEM_SCAN_DOESNT_MATCH),
          text2: strings(ITEM_SCAN_DOESNT_MATCH_DETAILS),
          visibilityTime: SNACKBAR_TIMEOUT_LONG,
          position: 'bottom'
        });
      } else {
        Toast.show({
          type: 'error',
          text1: strings('ITEM.ACTION_COMPLETE_ERROR'),
          text2: strings('ITEM.ACTION_COMPLETE_ERROR_DETAILS'),
          visibilityTime: SNACKBAR_TIMEOUT_LONG,
          position: 'bottom'
        });
      }
    }
  }
};

export const NoActionScanScreen = (props: NoActionScanScreenProps): JSX.Element => {
  const {
    dispatch,
    navigation,
    useEffectHook,
    completeItemApi,
    isManualScanEnabled,
    trackEventCall,
    route,
    userId,
    actionCompleted,
    upcNbr,
    itemNbr,
    exceptionType,
    validateSessionCall,
    barcodeErrorState
  } = props;

  const [barcodeErrorVisible, setBarcodeErrorVisible] = barcodeErrorState;
  // Barcode event listener effect
  useEffectHook(() => {
    const scanSubscription = barcodeEmitter.addListener('scanned', scan => {
      callBackbarcodeEmitter(
        scan,
        upcNbr,
        itemNbr,
        userId,
        route,
        dispatch,
        navigation,
        setBarcodeErrorVisible,
        trackEventCall,
        validateSessionCall
      );
    });
    return () => {
      scanSubscription.remove();
    };
  }, [actionCompleted]);

  // Complete Item Details API
  useEffectHook(() => {
    completeItemApiHook(dispatch, navigation, completeItemApi);
  }, [completeItemApi]);

  if (completeItemApi.isWaiting) {
    return (
      <ActivityIndicator
        animating={completeItemApi.isWaiting}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.completeActivityIndicator}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.safeAreaView}
      behavior="height"
      keyboardVerticalOffset={110}
      onStartShouldSetResponder={handleUnhandledTouches}
    >
      {renderBarcodeErrorModal(barcodeErrorVisible, setBarcodeErrorVisible)}
      <View style={styles.container}>
        {isManualScanEnabled && (
          <ManualScan placeholder={strings('GENERICS.ENTER_UPC_ITEM_NBR')} />
        )}
        <View style={styles.scanContainer}>
          <Pressable onPress={() => {
            if (Config.ENVIRONMENT === 'dev' || Config.ENVIRONMENT === 'stage') {
              return openCamera();
            }
            return null;
          }}
          >
            <MaterialCommunityIcons
              size={100}
              name="barcode-scan"
              color={COLOR.BLACK}
            />
          </Pressable>
          <View style={styles.scanText}>
            <Text>{strings('ITEM.SCAN_FOR_NO_ACTION')}</Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const NoActionScan = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const completeItemApi = useTypedSelector(state => state.async.noAction);
  const { isManualScanEnabled } = useTypedSelector(state => state.Global);
  const {
    itemNbr,
    upcNbr,
    exceptionType,
    actionCompleted
  } = useTypedSelector(
    state => state.ItemDetailScreen
  );
  const { userId } = useTypedSelector(state => state.User);
  const barcodeErrorState = useState(false);
  return (
    <NoActionScanScreen
      dispatch={dispatch}
      navigation={navigation}
      useEffectHook={useEffect}
      completeItemApi={completeItemApi}
      isManualScanEnabled={isManualScanEnabled}
      trackEventCall={trackEvent}
      actionCompleted={actionCompleted}
      exceptionType={exceptionType}
      itemNbr={itemNbr}
      route={route}
      upcNbr={upcNbr}
      userId={userId}
      validateSessionCall={validateSession}
      barcodeErrorState={barcodeErrorState}
    />
  );
};

export default NoActionScan;
