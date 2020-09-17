import React, {useEffect, useState} from 'react';
import { RadioButton, Text } from 'react-native-paper';
import { TouchableOpacity, View, Modal } from 'react-native';
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

interface LocParams {
  currentLocation?: Location;
}


const SelectLocationType = () => {
  const [type, setType] = useState('8');
  const [inputLocation, setInputLocation] = useState(false);
  const [loc, setLoc] = useState('');
  const [apiInProgress, setAPIInProgress] = useState(false);
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
  const item = useTypedSelector(state => state.async.getItemDetails);

  useEffect(() => {
    if (routeSource === 'EditLocation') {
      locParams.currentLocation ? setLoc(`${locParams.currentLocation.zoneName}${locParams.currentLocation.aisleName}-${locParams.currentLocation.sectionName}`) : null;
      locParams.currentLocation ? setType(locParams.currentLocation.typeNbr.toString()): null;
    }
  }, []);

  useEffect(() => {

  }, [addAPI]);

  useEffect(() => {

  }, [editAPI]);

  const modelOnSubmit = (value: string) => {
    setLoc(value);
    setInputLocation(false);
  };

  const onSubmit = () => {
    if (item.result) {
      console.log(item.result);
      dispatch(addLocation({
        upc: item.result.data.upcNbr,
        sectionId: loc,
        locationTypeNbr: type
      }))
    }
  };

  const validateLocation =() => {
    return !((loc.length > 3) && (type === '8' || type === '12' || type === '13' || type === '11'));
  };

  console.log(validateLocation());

  return (
    <>
      <Modal
        visible={inputLocation}
        onRequestClose={() => {
          setInputLocation(false);
        }}
        transparent
        >
        <EnterLocation enterLocation={inputLocation} setEnterLocation={setInputLocation} loc={loc} setLoc={setLoc} onSubmit={modelOnSubmit}/>
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
      <Button type={3} title={'Manually key in location'} titleColor={'blue'} titleFontSize={12} titleFontWeight="bold" onPress={() => { setInputLocation(true) }}/>
      <View style={styles.container}>
        <Button title={'Submit'} radius={0} onPress={onSubmit} disabled={validateLocation()}/>
      </View>
    </>
  );
};

export default SelectLocationType;
