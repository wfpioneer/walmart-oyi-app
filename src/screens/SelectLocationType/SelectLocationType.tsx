import React, {useEffect, useState} from 'react';
import { RadioButton, Text } from 'react-native-paper';
import { ActivityIndicator, TouchableOpacity, View, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLOR } from '../../themes/Color';
import styles from './SelectLocationType.style';
import { strings } from '../../locales';
import Button from '../../components/buttons/Button';
import EnterLocation from '../../components/enterlocation/EnterLocation';
import Location from "../../models/Location";
import {useDispatch} from "react-redux";
import {useTypedSelector} from "../../state/reducers/RootReducer";
import {addLocation} from "../../state/actions/saga";
import {addLocationToExisting} from "../../state/actions/Location";
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

interface LocParams {
  currentLocation?: Location;
}


const SelectLocationType = () => {
  const [type, setType] = useState('8');
  const [inputLocation, setInputLocation] = useState(false);
  const [loc, setLoc] = useState('');
  const [apiInProgress, setAPIInProgress] = useState(false);
  const [error, setError] = useState({error: false, message:''});
  const addAPI = useTypedSelector(state => state.async.addLocation);
  const editAPI = useTypedSelector(state => state.async.editLocation);
  const floorLocations = useTypedSelector(state => state.Location.floorLocations);
  const reserveLocations = useTypedSelector(state => state.Location.reserveLocations);
  const itemLocDetails = useTypedSelector(state => state.Location.itemLocDetails);
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const routeSource = route.name;
  const locParams: LocParams = route.params ? route.params : {};

  useEffect(() => {
    if (routeSource === 'EditLocation') {
      locParams.currentLocation ? (locParams.currentLocation.locationName ? setLoc(locParams.currentLocation.locationName) : null) : null;
      locParams.currentLocation ? setType(locParams.currentLocation.typeNbr.toString()): null;
    }
  }, []);

  useEffect(() => {
    // on api success
    if (apiInProgress && addAPI.isWaiting === false && addAPI.result) {
      if (type === '8' || type === '11' || type === '12' || type === '13') {
        console.log('array updated with ', loc);
        dispatch(addLocationToExisting(loc, parseInt(type), 'floor'));
        setAPIInProgress(false);
        console.log('location added');
        navigation.navigate('LocationDetails');
      }
      return undefined
    }

    // on api failure
    if (apiInProgress && addAPI.isWaiting === false && addAPI.error) {
      setAPIInProgress(false);
      return setError({error: true, message: strings('LOCATION.ADD_LOCATION_API_ERROR')});
    }

    // on api submission
    if (!apiInProgress && addAPI.isWaiting) {
      setError({error: false, message:''});
      return setAPIInProgress(true);
    }

    return undefined;
  }, [addAPI]);

  useEffect(() => {
    //TODO add logic for edit service
  }, [editAPI]);

  const modelOnSubmit = (value: string) => {
    setLoc(value);
    setInputLocation(false);
  };

  const onSubmit = () => {
    if (routeSource === 'AddLocation') {
      setError({error: false, message:''});
      const sameLoc = floorLocations.find((location: Location) => location.locationName === loc && location.typeNbr.toString() === type);
      console.log(sameLoc);
      if (!sameLoc) {
        dispatch(addLocation({
          upc: itemLocDetails.upcNbr,
          sectionId: loc,
          locationTypeNbr: type
        }))
      } else {
        setError({error: true, message: strings('LOCATION.ADD_DUPLICATE_ERROR')});
      }
    } else if (routeSource === 'EditLocation') {
      //TODO add logic for editing
    }
  };

  const validateLocation =() => {
    //TODO add better validation of location
    return !((loc.length > 3) && (type === '8' || type === '12' || type === '13' || type === '11'));
  };

  if (addAPI.isWaiting || editAPI.isWaiting) {
    return (
      <ActivityIndicator
        animating={addAPI.isWaiting || editAPI.isWaiting}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    );
  }

  return (
    <>
      <Modal
        visible={inputLocation}
        onRequestClose={() => {
          setInputLocation(false);
        }}
        transparent
        >
        <EnterLocation enterLocation={inputLocation} setEnterLocation={setInputLocation}
                       loc={loc} setLoc={setLoc} onSubmit={modelOnSubmit}/>
      </Modal>
      <View style={styles.sectionLabel}>
        <Text style={styles.labelText}>1. Select a location type</Text>
      </View>
      <RadioButton.Group onValueChange={value => setType(value)} value={type}>
        <View style={styles.typeListItem}>
          <RadioButton value='8' status={type === '8' ? 'checked' : 'unchecked'} color={COLOR.MAIN_THEME_COLOR} />
          <TouchableOpacity style={styles.labelBox} onPress={() => setType('8')}>
            <Text style={styles.typeLabel}>{strings('SELECTLOCATIONTYPE.FLOOR')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.typeListItem}>
          <RadioButton value='12' status={type === '12' ? 'checked' : 'unchecked'} color={COLOR.MAIN_THEME_COLOR} />
          <TouchableOpacity style={styles.labelBox} onPress={() => setType('12')}>
            <Text style={styles.typeLabel}>{strings('SELECTLOCATIONTYPE.ENDCAP')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.typeListItem}>
          <RadioButton value='13' status={type === '13' ? 'checked' : 'unchecked'} color={COLOR.MAIN_THEME_COLOR} />
          <TouchableOpacity style={styles.labelBox} onPress={() => setType('13')}>
            <Text style={styles.typeLabel}>{strings('SELECTLOCATIONTYPE.POD')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.typeListItem}>
          <RadioButton value='11' status={type === '11' ? 'checked' : 'unchecked'} color={COLOR.MAIN_THEME_COLOR} />
          <TouchableOpacity style={styles.labelBox} onPress={() => setType('11')}>
            <Text style={styles.typeLabel}>{strings('SELECTLOCATIONTYPE.DISPLAY')}</Text>
          </TouchableOpacity>
        </View>
      </RadioButton.Group>
      <View style={styles.sectionLabel}>
        <Text style={styles.labelText}>2. Scan location label</Text>
      </View>
      <View style={styles.locationContainer}>
        <Text style={styles.locationText}>{loc}</Text>
      </View>
      <View style={styles.manualButtonContainer}>
        <Button style={styles.manualButton} type={2} title={strings('LOCATION.MANUAL_ENTRY_BUTTON')}
                titleColor={COLOR.MAIN_THEME_COLOR} titleFontSize={12}
                titleFontWeight="bold" onPress={() => { setInputLocation(true) }}/>
      </View>
      {error.error ? <View style={styles.errorContainer}>
        <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_300} />
        <Text style={styles.errorText}>{error.message}</Text>
      </View> : null}
      <View style={styles.container}>
        <Button title={strings('GENERICS.SUBMIT')} radius={0} onPress={onSubmit} disabled={validateLocation()}/>
      </View>
    </>
  );
};

export default SelectLocationType;
