import React, { EffectCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, EmitterSubscription, Text, View
} from 'react-native';
import {
  NavigationProp, useNavigation
} from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dispatch } from 'redux';
import Button from '../../components/buttons/Button';
import EnterLocation from '../../components/enterlocation/EnterLocation';
import Location from '../../models/Location';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import {
  addLocation,
  editLocation,
  getLocationDetails,
  getSectionDetails
} from '../../state/actions/saga';
import { clearSelectedLocation, setActionCompleted } from '../../state/actions/ItemDetailScreen';
import { resetScannedEvent, setManualScan, setScannedEvent } from '../../state/actions/Global';
import { barcodeEmitter, manualScan } from '../../utils/scannerUtils';
import { strings } from '../../locales';
import styles from './SelectLocationType.style';
import { COLOR } from '../../themes/Color';
import { validateSession } from '../../utils/sessionTimeout';
import { trackEvent } from '../../utils/AppCenterTool';
import { AsyncState } from '../../models/AsyncState';
import { CustomModalComponent } from '../Modal/Modal';

export const SALES_FLOOR_LOCATION_TYPE = '8';

interface SelectLocationProps {
  inputLocation: boolean;
  setInputLocation: React.Dispatch<React.SetStateAction<boolean>>;
  loc: string;
  setLoc: React.Dispatch<React.SetStateAction<string>>;
  scanType: string;
  setScanType: React.Dispatch<React.SetStateAction<string>>;
  error: { error: boolean; message: string };
  setError: React.Dispatch<React.SetStateAction<{ error: boolean; message: string; }>>;
  addAPI: AsyncState;
  editAPI: AsyncState;
  floorLocations: Location[];
  itemNbr: number;
  upcNbr: string;
  exceptionType: string | null | undefined;
  actionCompleted: boolean;
  navigation: NavigationProp<any>;
  dispatch: Dispatch<any>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  trackEventCall: (eventName: string, params?: any) => void;
  validateSessionCall: (navigation: any, route?: string) => Promise<void>;
  selectedLocation: Location | null;
  salesFloor: boolean;
}

export const validateLocation = (loc: string): boolean => {
  const locRegex = new RegExp(/^[\d]+$|[A-z][0-9]+-[0-9]+/);
  return loc.length > 0 && locRegex.test(loc);
};
export const onValidateSessionCallResponse = (
  loc: string,
  setError: React.Dispatch<React.SetStateAction<{ error: boolean; message: string; }>>,
  floorLocations: Location[],
  upcNbr: string,
  dispatch: Dispatch<any>,
  trackEventCall: (eventName: string, params?: any) => void,
  selectedLocation: Location | null
) => {
  if (!selectedLocation) {
    setError({ error: false, message: '' });
    const sameLoc = floorLocations.find(
      (location: Location) => location.locationName === loc
    );
    if (!sameLoc) {
      dispatch(addLocation({
        upc: upcNbr,
        sectionId: loc,
        locationTypeNbr: Number.parseInt(SALES_FLOOR_LOCATION_TYPE, 10)
      }));
    } else {
      trackEventCall('select_location_add_duplicate');
      setError({ error: true, message: strings('LOCATION.ADD_DUPLICATE_ERROR') });
    }
  } else {
    setError({ error: false, message: '' });
    const sameLoc = floorLocations.find(
      (location: Location) => location.locationName === loc
    );
    if (!sameLoc) {
      dispatch(editLocation({
        upc: upcNbr,
        sectionId: selectedLocation.locationName,
        newSectionId: loc,
        locationTypeNbr: selectedLocation.typeNbr,
        newLocationTypeNbr: Number.parseInt(SALES_FLOOR_LOCATION_TYPE, 10)
      }));
    } else {
      trackEventCall('select_location_edit_duplicate');
      setError({ error: true, message: strings('LOCATION.EDIT_DUPLICATE_ERROR') });
    }
  }
};

export const onBarcodeEmitterResponse = (
  setLoc: React.Dispatch<React.SetStateAction<string>>,
  setScanType: React.Dispatch<React.SetStateAction<string>>,
  navigation: NavigationProp<any>,
  dispatch: Dispatch<any>,
  trackEventCall: (eventName: string, params?: any) => void,
  scan: any
) => {
  trackEventCall('select_location_scan', { value: scan.value, type: scan.type });
  if (navigation.isFocused()) {
    const unProcessedScanValue: string = scan.value;
    switch (scan.type) {
      case 'manual': {
        dispatch(setScannedEvent(scan));
        setLoc(scan.value);
        break;
      }
      case 'LABEL-TYPE-UPCA': {
        const processedScanValue = parseInt(unProcessedScanValue.substring(1,
          unProcessedScanValue.length - 1), 10).toString();
        dispatch(setScannedEvent({ value: processedScanValue, type: scan.type }));
        setScanType(scan.type);
        setLoc(processedScanValue);
        break;
      }
      default:
        break;
    }
    dispatch(setManualScan(false));
  }
};

export const isNotActionCompleted = (
  actionCompleted: boolean,
  dispatch: Dispatch<any>,
  exceptionType: string | null | undefined
) => {
  if (!actionCompleted && exceptionType === 'NSFL') {
    dispatch(setActionCompleted());
  }
};

const isApiError = (api: AsyncState) => !api.isWaiting && api.error;
const isApiSuccess = (api: AsyncState) => !api.isWaiting && api.result;
const isApiWaiting = (addApi: AsyncState, editApi: AsyncState) => addApi.isWaiting || editApi.isWaiting;
const isError = (error: { error: boolean; message: string }) => (
  error.error ? (
    <View style={styles.errorContainer}>
      <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_300} />
      <Text style={styles.errorText}>{error.message}</Text>
    </View>
  )
    : null
);

export const AddLocationApiHook = (
  addAPI: AsyncState,
  setError: React.Dispatch<React.SetStateAction<{ error: boolean; message: string; }>>,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  salesFloor: boolean,
  actionCompleted: boolean,
  exceptionType: string | null | undefined,
  itemNbr: number,
  selectedLocation: Location | null,
) => {
  // on api submission
  if (addAPI.isWaiting) {
    setError({ error: false, message: '' });
  }
  // on api failure
  if (isApiError(addAPI)) {
    setError({ error: true, message: strings('LOCATION.ADD_LOCATION_API_ERROR') });
  }
  // on api success
  if (isApiSuccess(addAPI)) {
    if (salesFloor) {
      isNotActionCompleted(actionCompleted, dispatch, exceptionType);
      dispatch(getLocationDetails({ itemNbr }));
    } else if (!salesFloor && !selectedLocation) {
      dispatch(getLocationDetails({ itemNbr }));
    }
    navigation.goBack();
  }
};

export const EditLocationApiHook = (
  editAPI: AsyncState,
  setError: React.Dispatch<React.SetStateAction<{ error: boolean; message: string; }>>,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  salesFloor: boolean,
  itemNbr: number,
  selectedLocation: Location | null
) => {
  // on api submission
  if (editAPI.isWaiting) {
    setError({ error: false, message: '' });
  }
  // on api failure
  if (isApiError(editAPI)) {
    setError({ error: true, message: strings('LOCATION.EDIT_LOCATION_API_ERROR') });
  }
  // on api success
  if (isApiSuccess(editAPI)) {
    if (salesFloor) {
      dispatch(getLocationDetails({ itemNbr }));
    } else {
      dispatch(getSectionDetails({ sectionId: selectedLocation ? selectedLocation.sectionId.toString() : '' }));
    }
    navigation.goBack();
  }
};

export const scanUPCAHook = (
  scanType: string,
  onSubmit: () => void,
  setScanType:React.Dispatch<React.SetStateAction<string>>
) => {
  if (scanType === 'LABEL-TYPE-UPCA') {
    onSubmit();
    setScanType('');
  }
};

export const SelectLocationTypeScreen = (props: SelectLocationProps): JSX.Element => {
  const {
    inputLocation, setInputLocation, loc, setLoc, actionCompleted, floorLocations, upcNbr,
    scanType, setScanType, error, setError, addAPI, editAPI, selectedLocation,
    itemNbr, salesFloor, trackEventCall, exceptionType,
    navigation, dispatch, useEffectHook, validateSessionCall
  } = props;
  let scannedSubscription: EmitterSubscription;

  // Navigation Listener
  useEffectHook(() => {
    // Resets location api response data when navigating off-screen
    navigation.addListener('beforeRemove', () => {
      dispatch(clearSelectedLocation());
      dispatch({ type: 'API/ADD_LOCATION/RESET' });
      dispatch({ type: 'API/EDIT_LOCATION/RESET' });
    });
  }, []);

  // Scanner listener
  useEffectHook(() => {
    scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      onBarcodeEmitterResponse(setLoc, setScanType, navigation, dispatch, trackEventCall, scan);
    });
    return () => {
      dispatch(resetScannedEvent());
      scannedSubscription.remove();
    };
  }, []);

  // Add Location API
  useEffectHook(() => AddLocationApiHook(
    addAPI,
    setError,
    dispatch,
    navigation,
    salesFloor,
    actionCompleted,
    exceptionType,
    itemNbr, selectedLocation
  ),
  [addAPI]);

  // Edit Location API
  useEffectHook(() => EditLocationApiHook(
    editAPI,
    setError,
    dispatch,
    navigation,
    salesFloor,
    itemNbr,
    selectedLocation
  ), [editAPI]);

  const modelOnSubmit = (value: string) => {
    validateSessionCall(navigation).then(() => {
      manualScan(value);
      dispatch(setManualScan(false));
      setInputLocation(false);
    }).catch(() => { });
  };

  const onSubmit = () => {
    validateSessionCall(navigation).then(() => {
      onValidateSessionCallResponse(loc, setError, floorLocations, upcNbr, dispatch, trackEventCall, selectedLocation);
    }).catch(() => { });
  };

  // Submits Add/Edit Location after Barcode Scan
  // This useEffect is not grouped with other useEffects only to call 'onSubmit()' from the upper scope.
  useEffectHook(() => scanUPCAHook(
    scanType,
    onSubmit,
    setScanType
  ), [loc]);

  const handleManualScan = () => {
    validateSessionCall(navigation).then(() => {
      setInputLocation(true);
      dispatch(setManualScan(true));
    }).catch(() => { });
  };

  return (
    <>
      <View style={styles.mainContainer}>
        <CustomModalComponent isVisible={inputLocation} onClose={() => setInputLocation(false)} modalType="Form">
          <EnterLocation setEnterLocation={setInputLocation} onSubmit={modelOnSubmit} />
        </CustomModalComponent>
        <View style={styles.locationContainer}>
          <Text style={styles.labelText}>{strings('LOCATION.SCAN_INSTRUCTION')}</Text>
          <Text style={styles.locationText}>{loc}</Text>
        </View>
        <View style={styles.manualButtonContainer}>
          <Button
            style={styles.manualButton}
            type={2}
            title={strings('LOCATION.MANUAL_ENTRY_BUTTON')}
            titleColor={COLOR.MAIN_THEME_COLOR}
            titleFontSize={12}
            titleFontWeight="bold"
            onPress={handleManualScan}
            testID="manual"
          />
        </View>
        {isError(error)}
      </View>
      <View style={styles.container}>
        {isApiWaiting(addAPI, editAPI)
          ? (
            <ActivityIndicator
              animating={isApiWaiting(addAPI, editAPI)}
              hidesWhenStopped
              color={COLOR.MAIN_THEME_COLOR}
              size="large"
              style={styles.activityIndicator}
            />
          )
          : (
            <Button
              title={strings('GENERICS.SUBMIT')}
              radius={0}
              onPress={onSubmit}
              disabled={!validateLocation(loc)}
              testID="submit"
            />
          )}
      </View>
    </>
  );
};

const SelectLocationType = (): JSX.Element => {
  const [inputLocation, setInputLocation] = useState(false);
  const [scanType, setScanType] = useState('');
  const [error, setError] = useState({ error: false, message: '' });
  const addAPI = useTypedSelector(state => state.async.addLocation);
  const editAPI = useTypedSelector(state => state.async.editLocation);
  const {
    floorLocations,
    itemNbr,
    upcNbr,
    exceptionType,
    actionCompleted,
    selectedLocation,
    salesFloor
  } = useTypedSelector(state => state.ItemDetailScreen);
  const [loc, setLoc] = useState(selectedLocation ? selectedLocation.locationName : '');
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <SelectLocationTypeScreen
      inputLocation={inputLocation}
      setInputLocation={setInputLocation}
      loc={loc}
      setLoc={setLoc}
      scanType={scanType}
      setScanType={setScanType}
      error={error}
      setError={setError}
      addAPI={addAPI}
      editAPI={editAPI}
      floorLocations={floorLocations}
      itemNbr={itemNbr}
      upcNbr={upcNbr}
      exceptionType={exceptionType}
      actionCompleted={actionCompleted}
      navigation={navigation}
      dispatch={dispatch}
      useEffectHook={useEffect}
      trackEventCall={trackEvent}
      validateSessionCall={validateSession}
      selectedLocation={selectedLocation}
      salesFloor={salesFloor}
    />
  );
};
export default SelectLocationType;
