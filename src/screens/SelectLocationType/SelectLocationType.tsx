import React, { EffectCallback, useEffect, useState } from 'react';
import { RadioButton, Text } from 'react-native-paper';
import {
  ActivityIndicator, EmitterSubscription, TouchableOpacity, View
} from 'react-native';
import {
  NavigationProp, Route, useNavigation, useRoute
} from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dispatch } from 'redux';
import Button from '../../components/buttons/Button';
import EnterLocation from '../../components/enterlocation/EnterLocation';
import Location from '../../models/Location';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { addLocation, editLocation, getLocationDetails } from '../../state/actions/saga';
import { addLocationToExisting, editExistingLocation } from '../../state/actions/Location';
import { setActionCompleted } from '../../state/actions/ItemDetailScreen';
import { resetScannedEvent, setManualScan, setScannedEvent } from '../../state/actions/Global';
import { barcodeEmitter, manualScan } from '../../utils/scannerUtils';
import { strings } from '../../locales';
import styles from './SelectLocationType.style';
import { COLOR } from '../../themes/Color';
import { validateSession } from '../../utils/sessionTimeout';
import { trackEvent } from '../../utils/AppCenterTool';
import { AsyncState } from '../../models/AsyncState';
import { CustomModalComponent } from '../Modal/Modal';

interface LocParams {
  currentLocation?: Location;
  locIndex?: number;
}

export enum LOCATION_TYPES {
  SALES_FLOOR = '8',
  DISPLAY = '11',
  END_CAP = '12',
  POD = '13'
}

interface SelectLocationProps {
  locType: string;
  setLocType: React.Dispatch<React.SetStateAction<string>>;
  inputLocation: boolean;
  setInputLocation: React.Dispatch<React.SetStateAction<boolean>>;
  loc: string;
  setLoc: React.Dispatch<React.SetStateAction<string>>;
  scanType: string;
  setScanType: React.Dispatch<React.SetStateAction<string>>;
  error: { error: boolean; message: string };
  setError: React.Dispatch<React.SetStateAction<{error: boolean;message: string;}>>;
  addAPI: AsyncState;
  editAPI: AsyncState;
  floorLocations: Location[];
  itemLocDetails: {
    itemNbr: number;
    upcNbr: string;
    exceptionType: string;
  };
  actionCompleted: boolean;
  route: Route<any>;
  navigation: NavigationProp<any>;
  dispatch: Dispatch<any>;
  useEffectHook: (effect: EffectCallback, deps?:ReadonlyArray<any>) => void;
  trackEventCall: (eventName: string, params?: any) => void;
  validateSessionCall: (navigation: any, route?: string) => Promise<void>;
}

export const validateLocation = (loc: string): boolean => {
  const locRegex = new RegExp(/^[\d]+$|[A-z][0-9]+-[0-9]+/);

  return loc.length > 0 && locRegex.test(loc);
};

export const SelectLocationTypeScreen = (props: SelectLocationProps): JSX.Element => {
  const {
    locType, setLocType, inputLocation, setInputLocation, loc, setLoc,
    scanType, setScanType, error, setError, addAPI, editAPI,
    floorLocations, itemLocDetails, actionCompleted, route,
    navigation, dispatch, useEffectHook, trackEventCall, validateSessionCall
  } = props;
  const routeSource: string = route.name;
  const locParams: LocParams = route.params ? route.params : {};
  const currentLocation = {
    locationName: locParams.currentLocation ? locParams.currentLocation.locationName : '',
    type: locParams.currentLocation ? locParams.currentLocation.typeNbr.toString() : '',
    locIndex: locParams.locIndex !== null && locParams.locIndex !== undefined ? locParams.locIndex : -1
  };
  let scannedSubscription: EmitterSubscription;

  // Set Location Name & Type when Editing location
  useEffectHook(() => {
    if (routeSource === 'EditLocation') {
      setLoc(currentLocation.locationName);
      setLocType(currentLocation.type);
    }
  }, []);

  // Navigation Listener
  useEffectHook(() => {
    // Resets location api response data when navigating off-screen
    navigation.addListener('beforeRemove', () => {
      dispatch({ type: 'API/ADD_LOCATION/RESET' });
      dispatch({ type: 'API/EDIT_LOCATION/RESET' });
    });
  }, []);

  // Scanner listener
  useEffectHook(() => {
    scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
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
    });
    return () => {
      dispatch(resetScannedEvent());
      scannedSubscription.remove();
    };
  }, []);

  // Add Location API
  useEffectHook(() => {
    // on api success
    if (!addAPI.isWaiting && addAPI.result) {
      dispatch(addLocationToExisting(loc, parseInt(locType, 10), 'floor'));
      if (!actionCompleted && itemLocDetails.exceptionType === 'NSFL') dispatch(setActionCompleted());
      dispatch(getLocationDetails({ itemNbr: itemLocDetails.itemNbr }));
      navigation.navigate('LocationDetails');
    }

    // on api failure
    if (!addAPI.isWaiting && addAPI.error) {
      setError({ error: true, message: strings('LOCATION.ADD_LOCATION_API_ERROR') });
    }

    // on api submission
    if (addAPI.isWaiting) {
      setError({ error: false, message: '' });
    }
  }, [addAPI]);

  // Edit Location API
  useEffectHook(() => {
    // on api success
    if (!editAPI.isWaiting && editAPI.result) {
      dispatch(editExistingLocation(loc, parseInt(locType, 10), 'floor', currentLocation.locIndex));
      dispatch(getLocationDetails({ itemNbr: itemLocDetails.itemNbr }));
      navigation.navigate('LocationDetails');
    }

    // on api failure
    if (!editAPI.isWaiting && editAPI.error) {
      setError({ error: true, message: strings('LOCATION.EDIT_LOCATION_API_ERROR') });
    }

    // on api submission
    if (editAPI.isWaiting) {
      setError({ error: false, message: '' });
    }
  }, [editAPI]);

  const modelOnSubmit = (value: string) => {
    validateSessionCall(navigation, routeSource).then(() => {
      manualScan(value);
      dispatch(setManualScan(false));
      setInputLocation(false);
    }).catch(() => {});
  };

  const onSubmit = () => {
    validateSessionCall(navigation, routeSource).then(() => {
      if (routeSource === 'AddLocation') {
        setError({ error: false, message: '' });
        const sameLoc = floorLocations.find(
          (location: Location) => location.locationName === loc && location.typeNbr.toString() === locType
        );
        if (!sameLoc) {
          dispatch(addLocation({
            headers: { itemNbr: itemLocDetails.itemNbr },
            upc: itemLocDetails.upcNbr,
            sectionId: loc,
            locationTypeNbr: locType
          }));
        } else {
          trackEventCall('select_location_add_duplicate');
          setError({ error: true, message: strings('LOCATION.ADD_DUPLICATE_ERROR') });
        }
      } else if (routeSource === 'EditLocation') {
        setError({ error: false, message: '' });
        const sameLoc = floorLocations.find(
          (location: Location) => location.locationName === loc && location.typeNbr.toString() === locType
        );
        if (!sameLoc) {
          dispatch(editLocation({
            headers: { itemNbr: itemLocDetails.itemNbr },
            upc: itemLocDetails.upcNbr,
            sectionId: currentLocation.locationName,
            newSectionId: loc,
            locationTypeNbr: currentLocation.type,
            newLocationTypeNbr: locType
          }));
        } else {
          trackEventCall('select_location_edit_duplicate');
          setError({ error: true, message: strings('LOCATION.EDIT_DUPLICATE_ERROR') });
        }
      }
    }).catch(() => {});
  };

  // Submits Add/Edit Location after Barcode Scan
  // This useEffect is not grouped with other useEffects only to call 'onSubmit()' from the upper scope.
  useEffectHook(() => {
    if (scanType === 'LABEL-TYPE-UPCA') {
      onSubmit();
      setScanType('');
    }
  }, [loc]);

  const handleManualScan = () => {
    validateSessionCall(navigation, routeSource).then(() => {
      setInputLocation(true);
      dispatch(setManualScan(true));
    }).catch(() => {});
  };

  return (
    <>
      <View style={styles.mainContainer}>
        <CustomModalComponent isVisible={inputLocation} onClose={() => setInputLocation(false)} modalType="Form">
          <EnterLocation setEnterLocation={setInputLocation} onSubmit={modelOnSubmit} />
        </CustomModalComponent>
        <View style={styles.sectionLabel}>
          <Text style={styles.labelText}>{strings('LOCATION.SELECTION_INSTRUCTION')}</Text>
        </View>
        <RadioButton.Group onValueChange={value => setLocType(value)} value={locType}>
          <View style={styles.typeListItem}>
            <RadioButton
              value={LOCATION_TYPES.SALES_FLOOR}
              status={locType === LOCATION_TYPES.SALES_FLOOR ? 'checked' : 'unchecked'}
              color={COLOR.MAIN_THEME_COLOR}
            />
            <TouchableOpacity style={styles.labelBox} onPress={() => setLocType(LOCATION_TYPES.SALES_FLOOR)}>
              <Text style={styles.typeLabel}>{strings('SELECTLOCATIONTYPE.FLOOR')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.typeListItem}>
            <RadioButton
              value={LOCATION_TYPES.END_CAP}
              status={locType === LOCATION_TYPES.END_CAP ? 'checked' : 'unchecked'}
              color={COLOR.MAIN_THEME_COLOR}
            />
            <TouchableOpacity style={styles.labelBox} onPress={() => setLocType(LOCATION_TYPES.END_CAP)}>
              <Text style={styles.typeLabel}>{strings('SELECTLOCATIONTYPE.ENDCAP')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.typeListItem}>
            <RadioButton
              value={LOCATION_TYPES.POD}
              status={locType === LOCATION_TYPES.POD ? 'checked' : 'unchecked'}
              color={COLOR.MAIN_THEME_COLOR}
            />
            <TouchableOpacity style={styles.labelBox} onPress={() => setLocType(LOCATION_TYPES.POD)}>
              <Text style={styles.typeLabel}>{strings('SELECTLOCATIONTYPE.POD')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.typeListItem}>
            <RadioButton
              value={LOCATION_TYPES.DISPLAY}
              status={locType === LOCATION_TYPES.DISPLAY ? 'checked' : 'unchecked'}
              color={COLOR.MAIN_THEME_COLOR}
            />
            <TouchableOpacity style={styles.labelBox} onPress={() => setLocType(LOCATION_TYPES.DISPLAY)}>
              <Text style={styles.typeLabel}>{strings('SELECTLOCATIONTYPE.DISPLAY')}</Text>
            </TouchableOpacity>
          </View>
        </RadioButton.Group>
        <View style={styles.sectionLabel}>
          <Text style={styles.labelText}>{strings('LOCATION.SCAN_INSTRUCTION')}</Text>
        </View>
        <View style={styles.locationContainer}>
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
          />
        </View>
        {error.error ? (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_300} />
            <Text style={styles.errorText}>{error.message}</Text>
          </View>
        )
          : null}
      </View>
      <View style={styles.container}>
        {addAPI.isWaiting || editAPI.isWaiting
          ? (
            <ActivityIndicator
              animating={addAPI.isWaiting || editAPI.isWaiting}
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
            />
          )}
      </View>
    </>
  );
};

const SelectLocationType = (): JSX.Element => {
  // Convert locType to a string To resolve type errors from RadioButtonGroup & currentLocation.type
  const [locType, setLocType] = useState(LOCATION_TYPES.SALES_FLOOR.toString());
  const [inputLocation, setInputLocation] = useState(false);
  const [loc, setLoc] = useState('');
  const [scanType, setScanType] = useState('');
  const [error, setError] = useState({ error: false, message: '' });
  const addAPI = useTypedSelector(state => state.async.addLocation);
  const editAPI = useTypedSelector(state => state.async.editLocation);
  const floorLocations = useTypedSelector(state => state.Location.floorLocations);
  const itemLocDetails = useTypedSelector(state => state.Location.itemLocDetails);
  const { actionCompleted } = useTypedSelector(state => state.ItemDetailScreen);
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <SelectLocationTypeScreen
      locType={locType}
      setLocType={setLocType}
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
      itemLocDetails={itemLocDetails}
      actionCompleted={actionCompleted}
      route={route}
      navigation={navigation}
      dispatch={dispatch}
      useEffectHook={useEffect}
      trackEventCall={trackEvent}
      validateSessionCall={validateSession}
    />
  );
};
export default SelectLocationType;
