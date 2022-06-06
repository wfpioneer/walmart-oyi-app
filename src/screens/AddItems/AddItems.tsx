import React, {EffectCallback, useEffect, useState} from 'react';
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
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { trackEvent } from 'appcenter-analytics';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import { addLocation } from '../../state/actions/saga';
import { ADD_LOCATION } from '../../state/actions/asyncAPI';
import ManualScan from '../../components/manualscan/ManualScan';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { setManualScan } from '../../state/actions/Global';
import { barcodeEmitter } from '../../utils/scannerUtils';
import { SNACKBAR_TIMEOUT } from '../../utils/global';
import { AsyncState } from '../../models/AsyncState';
import { SALES_FLOOR_LOCATION_TYPE } from '../SelectLocationType/SelectLocationType';
import { strings } from '../../locales';
import styles from './AddItems.style';
import COLOR from '../../themes/Color';

interface AddItemsScreenProps {
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  section: { id: number | string; name: string; };
  addAPI: AsyncState;
  isManualScanEnabled: boolean;
  addItemsApiStart: number;
  setAddItemsApiStart: React.Dispatch<React.SetStateAction<number>>;
  trackEventCall: (eventName: string, params?: any) => void;
}

const handleUnhandledTouches = () => {
  Keyboard.dismiss();
  return false;
};

export const addItemApiHook = (
  isFocusted: boolean,
  addItemApi: AsyncState,
  dispatch: Dispatch<any>,
  navigateBack: Function,
  trackEventCall: Function,
  addItemApiStart: number
) => {
  if (isFocusted) {
    if (!addItemApi.isWaiting && addItemApi.result) {
      trackEventCall('create_items_to_section_success', { duration: moment().valueOf() - addItemApiStart });
      Toast.show({
          type: 'success',
          text1: strings('LOCATION.ITEM_ADDED'),
          visibilityTime: SNACKBAR_TIMEOUT,
          position: 'bottom'
        });
      dispatch({ type: ADD_LOCATION.RESET });
      navigateBack();
    }

    // on api failure
    if (!addItemApi.isWaiting && addItemApi.error) {
      trackEventCall(
        'create_items_to_section_failure',
        {
          errorDetails: addItemApi.error.message || addItemApi.error,
          duration: moment().valueOf() - addItemApiStart
        }
      );
      Toast.show({
        type: 'error',
        text1: strings('LOCATION.ADD_ITEM_ERROR'),
        text2: strings('LOCATION.ADD_ITEM_API_ERROR'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
      dispatch({ type: ADD_LOCATION.RESET });
    }
  }
};

export const scanItemListener = (
  scannedEvent: { value: any; type: string | null},
  section: { id: number | string; name: string; },
  dispatch: Dispatch<any>,
  setAddItemsApiStart: React.Dispatch<React.SetStateAction<number>>,
  isFocused: boolean
) => {
  if (isFocused) {
    if (scannedEvent.value) {
      setAddItemsApiStart(moment().valueOf());
      dispatch(addLocation({
        upc: scannedEvent.value,
        sectionId: section.id.toString(),
        locationTypeNbr: Number.parseInt(SALES_FLOOR_LOCATION_TYPE, 10)
      }));
      dispatch(setManualScan(false));
    }
  }
};

export const AddItemsScreen = (props: AddItemsScreenProps): JSX.Element => {
  const {
    dispatch,
    navigation,
    useEffectHook,
    section,
    addAPI,
    isManualScanEnabled,
    addItemsApiStart,
    setAddItemsApiStart,
    trackEventCall
  } = props;

  // Navigation Listener
  useEffectHook(() => {
    // Resets location api response data when navigating off-screen
    navigation.addListener('beforeRemove', () => {
      dispatch({ type: 'API/ADD_LOCATION/RESET' });
    });
  }, []);

  // Barcode event listener effect
  useEffectHook(() => {
    const scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      scanItemListener(scan, section, dispatch, setAddItemsApiStart, navigation.isFocused());
    });

    return () => {
      scannedSubscription.remove();
      return undefined;
    };
  }, []);

  // Add Location API
  useEffectHook(() => {
    addItemApiHook(
      navigation.isFocused(),
      addAPI,
      dispatch,
      navigation.goBack,
      trackEventCall,
      addItemsApiStart
    );
  }, [addAPI]);

  if (addAPI.isWaiting) {
    return (
      <ActivityIndicator
        animating={addAPI.isWaiting}
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
      <View style={styles.container}>
        {isManualScanEnabled && <ManualScan placeholder={strings('GENERICS.ENTER_UPC_ITEM_NBR')} />}
        <View style={styles.scanContainer}>
          <MaterialCommunityIcons size={100} name="barcode-scan" color={COLOR.BLACK} />
          <View style={styles.scanText}>
            <Text>{strings('PALLET.SCAN_INSTRUCTIONS')}</Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>

  );
};

const AddItems = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const section = useTypedSelector(state => state.Location.selectedSection);
  const addAPI = useTypedSelector(state => state.async.addLocation);
  const { isManualScanEnabled } = useTypedSelector(state => state.Global);
  const [addItemsApiStart, setAddItemsApiStart] = useState(0);
  return (
    <AddItemsScreen
      dispatch={dispatch}
      navigation={navigation}
      useEffectHook={useEffect}
      section={section}
      addAPI={addAPI}
      isManualScanEnabled={isManualScanEnabled}
      addItemsApiStart={addItemsApiStart}
      setAddItemsApiStart={setAddItemsApiStart}
      trackEventCall={trackEvent}
    />
  );
};

export default AddItems;
