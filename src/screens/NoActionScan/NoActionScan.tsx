import React, { EffectCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
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
import ManualScan from '../../components/manualscan/ManualScan';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import {
  setManualScan,
  setScannedEvent
} from '../../state/actions/Global';
import { barcodeEmitter } from '../../utils/scannerUtils';
import { AsyncState } from '../../models/AsyncState';
import { strings } from '../../locales';
import { styles } from './NoActionScan.style';
import COLOR from '../../themes/Color';
import { NO_ACTION } from '../../state/actions/asyncAPI';
import { showInfoModal } from '../../state/actions/Modal';
import { setActionCompleted } from '../../state/actions/ItemDetailScreen';
import {
  COMPLETE_API_409_ERROR,
  renderBarcodeErrorModal
} from '../ReviewItemDetails/ReviewItemDetails';
import { noAction } from '../../state/actions/saga';
import { validateSession } from '../../utils/sessionTimeout';
import { SNACKBAR_TIMEOUT } from '../../utils/global';

const NO_ACTION_SCAN = 'No_Action_Scan';

interface NoActionScanScreenProps {
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
  exceptionType: string | undefined | null,
  upcNbr: string,
  itemNbr: number,
  userId: string,
  actionCompleted: boolean,
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
          if (exceptionType && !actionCompleted) {
            dispatch(
              noAction({
                upc: upcNbr,
                itemNbr,
                scannedValue: scan.value
              })
            );
            dispatch(setManualScan(false));
          } else {
            dispatch(setScannedEvent(scan));
          }
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
        dispatch(
          showInfoModal(
            strings('ITEM.SCAN_DOESNT_MATCH'),
            strings('ITEM.SCAN_DOESNT_MATCH_DETAILS')
          )
        );
      } else {
        dispatch(setActionCompleted());
        navigation.goBack();
      }
    }

    // on api failure
    if (!completeItemApi.isWaiting && completeItemApi.error) {
      dispatch({ type: NO_ACTION.RESET });
      if (completeItemApi.error === COMPLETE_API_409_ERROR) {
        // dispatch(
        //   showInfoModal(
        //     strings('ITEM.SCAN_DOESNT_MATCH'),
        //     strings('ITEM.SCAN_DOESNT_MATCH_DETAILS')
        //   )
        // );
        Toast.show({
          type: 'error',
          text1: strings('ITEM.SCAN_DOESNT_MATCH_DETAILS'),
          visibilityTime: SNACKBAR_TIMEOUT,
          position: 'bottom'
        });
      } else {
        // dispatch(
        //   showInfoModal(
        //     strings('ITEM.ACTION_COMPLETE_ERROR'),
        //     strings('ITEM.ACTION_COMPLETE_ERROR_DETAILS')
        //   )
        // );
        Toast.show({
          type: 'error',
          text1: strings('ITEM.ACTION_COMPLETE_ERROR_DETAILS'),
          visibilityTime: SNACKBAR_TIMEOUT,
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
        exceptionType,
        upcNbr,
        itemNbr,
        userId,
        actionCompleted,
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

  // // Navigation Listener
  // useEffectHook(() => {
  //   // Resets location api response data when navigating off-screen
  //   navigation.addListener('focus', () => {
  //     dispatch(setBottomTab(false));
  //   });
  //   navigation.addListener('beforeRemove', () => {
  //     dispatch(setBottomTab(true));
  //     dispatch({ type: 'API/ADD_LOCATION/RESET' });
  //   });

  //   return () => {
  //     navigation.removeListener('focus', () => {});
  //     navigation.removeListener('beforeRemove', () => {});
  //   };
  // }, []);

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
          <MaterialCommunityIcons
            size={100}
            name="barcode-scan"
            color={COLOR.BLACK}
          />
          <View style={styles.scanText}>
            <Text>{strings('PALLET.SCAN_INSTRUCTIONS')}</Text>
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
