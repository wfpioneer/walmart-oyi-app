import React, { useEffect, useState } from 'react';
import { RadioButton, Text } from 'react-native-paper';
import { ActivityIndicator, EmitterSubscription, Modal, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Button from '../../components/buttons/Button';
import EnterLocation from '../../components/enterlocation/EnterLocation';
import Location from '../../models/Location';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { addLocation, editLocation } from '../../state/actions/saga';
import { addLocationToExisting, editExistingLocation, isUpdating } from '../../state/actions/Location';
import { setActionCompleted } from "../../state/actions/ItemDetailScreen";
import { resetScannedEvent, setManualScan, setScannedEvent } from '../../state/actions/Global';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { barcodeEmitter, manualScan } from '../../utils/scannerUtils';
import { strings } from '../../locales';
import styles from './SelectLocationType.style';
import { COLOR } from '../../themes/Color';

interface LocParams {
  currentLocation?: Location;
  locIndex?: number;
}

const LOCATION_TYPES = {
  SALES_FLOOR: '8',
  DISPLAY: '11',
  END_CAP: '12',
  POD: '13'
};

const SelectLocationType = () => {
  const [type, setType] = useState(LOCATION_TYPES.SALES_FLOOR);
  const [inputLocation, setInputLocation] = useState(false);
  const [loc, setLoc] = useState('');
  const [apiInProgress, setAPIInProgress] = useState(false);
  const [error, setError] = useState({ error: false, message: '' });
  const addAPI = useTypedSelector(state => state.async.addLocation);
  const editAPI = useTypedSelector(state => state.async.editLocation);
  const floorLocations = useTypedSelector(state => state.Location.floorLocations);
  const itemLocDetails = useTypedSelector(state => state.Location.itemLocDetails);
  const { actionCompleted } = useTypedSelector(state => state.ItemDetailScreen);
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const routeSource = route.name;
  const locParams: LocParams = route.params ? route.params : {};
  const currentLocation = {
    locationName: locParams.currentLocation ? locParams.currentLocation.locationName : '',
    type: locParams.currentLocation ? locParams.currentLocation.typeNbr.toString() : '',
    locIndex: locParams.locIndex !== null && locParams.locIndex !== undefined ? locParams.locIndex : -1
  };
  let scannedSubscription: EmitterSubscription;

  useEffect(() => {
    if (routeSource === 'EditLocation') {
      setLoc(currentLocation.locationName);
      setType(currentLocation.type);
    }
  }, []);

  useEffect(() => {
    scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused()) {
        dispatch(setScannedEvent(scan));
        dispatch(setManualScan(false));
        setLoc(scan.value);
      }
    });
    return () => {
      dispatch(resetScannedEvent());
      scannedSubscription.remove();
    };
  }, []);

  useEffect(() => {
    // on api success
    if (apiInProgress && addAPI.isWaiting === false && addAPI.result) {
      dispatch(addLocationToExisting(loc, parseInt(type, 10), 'floor'));
      if (!actionCompleted && itemLocDetails.exceptionType === 'NSFL') dispatch(setActionCompleted());
      setAPIInProgress(false);
      navigation.navigate('LocationDetails');
      dispatch(isUpdating(true));
      return undefined;
    }

    // on api failure
    if (apiInProgress && addAPI.isWaiting === false && addAPI.error) {
      setAPIInProgress(false);
      return setError({ error: true, message: strings('LOCATION.ADD_LOCATION_API_ERROR') });
    }

    // on api submission
    if (!apiInProgress && addAPI.isWaiting) {
      setError({ error: false, message: '' });
      return setAPIInProgress(true);
    }

    return undefined;
  }, [addAPI]);

  useEffect(() => {
    // on api success
    if (apiInProgress && editAPI.isWaiting === false && editAPI.result) {
      dispatch(editExistingLocation(loc, parseInt(type, 10), 'floor', currentLocation.locIndex));
      setAPIInProgress(false);
      navigation.navigate('LocationDetails');
      dispatch(isUpdating(true));
      return undefined;
    }

    // on api failure
    if (apiInProgress && editAPI.isWaiting === false && editAPI.error) {
      setAPIInProgress(false);
      return setError({ error: true, message: strings('LOCATION.EDIT_LOCATION_API_ERROR') });
    }

    // on api submission
    if (!apiInProgress && editAPI.isWaiting) {
      setError({ error: false, message: '' });
      return setAPIInProgress(true);
    }

    return undefined;
  }, [editAPI]);

  const modelOnSubmit = (value: string) => {
    manualScan(value);
    dispatch(setManualScan(false));
    setInputLocation(false);
  };

  const onSubmit = () => {
    if (routeSource === 'AddLocation') {
      setError({ error: false, message: '' });
      const sameLoc = floorLocations.find((location: Location) => location.locationName === loc && location.typeNbr.toString() === type);
      if (!sameLoc) {
        dispatch(addLocation({
          upc: itemLocDetails.upcNbr,
          sectionId: loc,
          locationTypeNbr: type
        }));
      } else {
        setError({ error: true, message: strings('LOCATION.ADD_DUPLICATE_ERROR') });
      }
    } else if (routeSource === 'EditLocation') {
      setError({ error: false, message: '' });
      const sameLoc = floorLocations.find((location: Location) => location.locationName === loc && location.typeNbr.toString() === type);
      if (!sameLoc) {
        dispatch(editLocation({
          upc: itemLocDetails.upcNbr,
          sectionId: currentLocation.locationName,
          newSectionId: loc,
          locationTypeNbr: currentLocation.type,
          newLocationTypeNbr: type
        }));
      } else {
        setError({ error: true, message: strings('LOCATION.EDIT_DUPLICATE_ERROR') });
      }
    }
  };

  const handleManualScan = () => {
    setInputLocation(true);
    dispatch(setManualScan(true));
  };

  const validateLocation = () => {
    // TODO add better validation of location
    return !((loc.length > 3) && (type === LOCATION_TYPES.SALES_FLOOR || type === LOCATION_TYPES.POD || type === LOCATION_TYPES.END_CAP || type === LOCATION_TYPES.DISPLAY));
  };

  return (
    <>
      <View style={styles.mainContainer}>
        <Modal visible={inputLocation} onRequestClose={() => setInputLocation(false)} transparent>
          <EnterLocation setEnterLocation={setInputLocation} onSubmit={modelOnSubmit} />
        </Modal>
        <View style={styles.sectionLabel}>
          <Text style={styles.labelText}>{strings('LOCATION.SELECTION_INSTRUCTION')}</Text>
        </View>
        <RadioButton.Group onValueChange={value => setType(value)} value={type}>
          <View style={styles.typeListItem}>
            <RadioButton value={LOCATION_TYPES.SALES_FLOOR} status={type === LOCATION_TYPES.SALES_FLOOR ? 'checked' : 'unchecked'} color={COLOR.MAIN_THEME_COLOR} />
            <TouchableOpacity style={styles.labelBox} onPress={() => setType(LOCATION_TYPES.SALES_FLOOR)}>
              <Text style={styles.typeLabel}>{strings('SELECTLOCATIONTYPE.FLOOR')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.typeListItem}>
            <RadioButton value={LOCATION_TYPES.END_CAP} status={type === LOCATION_TYPES.END_CAP ? 'checked' : 'unchecked'} color={COLOR.MAIN_THEME_COLOR} />
            <TouchableOpacity style={styles.labelBox} onPress={() => setType(LOCATION_TYPES.END_CAP)}>
              <Text style={styles.typeLabel}>{strings('SELECTLOCATIONTYPE.ENDCAP')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.typeListItem}>
            <RadioButton value={LOCATION_TYPES.POD} status={type === LOCATION_TYPES.POD ? 'checked' : 'unchecked'} color={COLOR.MAIN_THEME_COLOR} />
            <TouchableOpacity style={styles.labelBox} onPress={() => setType(LOCATION_TYPES.POD)}>
              <Text style={styles.typeLabel}>{strings('SELECTLOCATIONTYPE.POD')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.typeListItem}>
            <RadioButton value={LOCATION_TYPES.DISPLAY} status={type === LOCATION_TYPES.DISPLAY ? 'checked' : 'unchecked'} color={COLOR.MAIN_THEME_COLOR} />
            <TouchableOpacity style={styles.labelBox} onPress={() => setType(LOCATION_TYPES.DISPLAY)}>
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
          </View>) :
          null}
      </View>
      <View style={styles.container}>
        {addAPI.isWaiting || editAPI.isWaiting ?
          <ActivityIndicator
            animating={addAPI.isWaiting || editAPI.isWaiting}
            hidesWhenStopped
            color={COLOR.MAIN_THEME_COLOR}
            size="large"
            style={styles.activityIndicator}
          /> :
          <Button title={strings('GENERICS.SUBMIT')} radius={0} onPress={onSubmit} disabled={validateLocation()} />}
      </View>
    </>
  );
};

export default SelectLocationType;
