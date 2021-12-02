import React, { useLayoutEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Text,
  View
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Dispatch } from 'redux';
import { Picker } from '@react-native-picker/picker';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import NumericSelector from '../../components/NumericSelector/NumericSelector';
import Button from '../../components/buttons/Button';
import styles from './AddZone.style';
import { CREATE_FLOW, PossibleZone, ZoneItem } from '../../models/LocationItems';
import { setAislesToCreate, setNewZone } from '../../state/actions/Location';
import { strings } from '../../locales';

interface AddZoneScreenProps {
  zones: ZoneItem[];
  possibleZones: PossibleZone[];
  currentZone: { id: number; name: string; }
  createFlow: CREATE_FLOW;
  selectedZone: string;
  setSelectedZone: React.Dispatch<React.SetStateAction<string>>;
  numberOfAisles: number;
  setNumberOfAisles: React.Dispatch<React.SetStateAction<number>>;
  existingAisles: number;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
}

const NEW_ZONE_AISLE_MIN = 1;
const NEW_ZONE_AISLE_MAX = 99;

const addZonesToPicker = (
  zones: ZoneItem[],
  possibleZones: PossibleZone[],
  currentZone: { id: number; name: string },
  createFlow: CREATE_FLOW
) => {
  const availableZones = possibleZones.filter(possibleZone => !zones.some(zone => possibleZone.name === zone.zoneName));
  switch (createFlow) {
    case CREATE_FLOW.CREATE_AISLE:
      return (
        <Picker.Item label={currentZone.name} value={currentZone.name} />
      );
    default:
      return [<Picker.Item label="" value="" key={-1} />,
        ...availableZones.map((zone: PossibleZone) => {
          const zoneLabel = `${zone.name} - ${zone.description}`;
          return (
            <Picker.Item label={zoneLabel} value={zone.name} key={zoneLabel} />
          );
        })];
  }
};

const validateNumericInput = (aisles: number, existingAisles = 0): boolean => (aisles >= NEW_ZONE_AISLE_MIN)
  && (aisles <= (NEW_ZONE_AISLE_MAX - existingAisles));

const disableContinue = (aisles: number, existingAisles = 0, selectedZone: string) => aisles < NEW_ZONE_AISLE_MIN
  || aisles > (NEW_ZONE_AISLE_MAX - existingAisles)
  || selectedZone === '';

export const AddZoneScreen = (props: AddZoneScreenProps): JSX.Element => {
  useLayoutEffect(() => {
    if (props.navigation.isFocused()) {
      if (props.createFlow === CREATE_FLOW.CREATE_AISLE) {
        props.navigation.setOptions({
          headerTitle: strings('LOCATION.ADD_AISLES')
        });
      } else {
        props.navigation.setOptions({
          headerTitle: strings('LOCATION.ADD_ZONE')
        });
      }
    }
  }, []);

  const handleIncreaseAisle = () => {
    props.setNumberOfAisles((prevState: number) => {
      if (prevState < NEW_ZONE_AISLE_MAX - props.existingAisles) {
        return prevState + 1;
      }
      return prevState;
    });
  };

  const handleDecreaseAisle = () => {
    props.setNumberOfAisles((prevState: number) => {
      if (prevState > NEW_ZONE_AISLE_MIN) {
        return prevState - 1;
      }
      return prevState;
    });
  };
  const handleTextChange = (text: string) => {
    const newQty: number = parseInt(text, 10);
    if (!Number.isNaN(newQty)) {
      props.setNumberOfAisles(newQty);
    }
  };

  const handleContinue = () => {
    switch (props.createFlow) {
      case CREATE_FLOW.CREATE_AISLE:
        props.dispatch(setAislesToCreate(props.numberOfAisles));
        break;
      default:
        props.dispatch(setAislesToCreate(props.numberOfAisles));
        props.dispatch(setNewZone(props.selectedZone));
    }
    props.navigation.navigate('AddSection');
  };

  const handleUnhandledTouches = () => {
    Keyboard.dismiss();
    return false;
  };

  return (
    <KeyboardAvoidingView
      style={styles.safeAreaView}
      behavior="height"
      keyboardVerticalOffset={110}
      onStartShouldSetResponder={handleUnhandledTouches}
    >
      <View style={styles.bodyContainer}>
        <View style={styles.zonePickerContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>{strings('LOCATION.ZONE')}</Text>
          </View>
          <Picker
            selectedValue={props.selectedZone}
            onValueChange={zone => props.setSelectedZone(zone)}
          >
            {addZonesToPicker(props.zones, props.possibleZones, props.currentZone, props.createFlow)}
          </Picker>
        </View>
        <View style={styles.aisleContainer}>
          <View style={styles.aisleNumericContainer}>
            <Text style={styles.aisleText}>
              {strings('LOCATION.ADD_AISLES')}
            </Text>
            <NumericSelector
              isValid={validateNumericInput(props.numberOfAisles, props.existingAisles)}
              onDecreaseQty={handleDecreaseAisle}
              onIncreaseQty={handleIncreaseAisle}
              onTextChange={handleTextChange}
              value={props.numberOfAisles}
            />
          </View>
          {!validateNumericInput(props.numberOfAisles, props.existingAisles) && (
            <Text style={styles.invalidLabel}>
              {strings('ITEM.OH_UPDATE_ERROR', {
                min: NEW_ZONE_AISLE_MIN,
                max: NEW_ZONE_AISLE_MAX - props.existingAisles
              })}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={strings('GENERICS.CONTINUE')}
          onPress={handleContinue}
          disabled={disableContinue(props.numberOfAisles, props.existingAisles, props.selectedZone)}
          style={styles.continueButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const AddZone = (): JSX.Element => {
  const zones = useTypedSelector(state => state.Location.zones);
  const possibleZones = useTypedSelector(state => state.Location.possibleZones);
  const currentZone = useTypedSelector(state => state.Location.selectedZone);
  const createFlow = useTypedSelector(state => state.Location.createFlow);
  const [selectedZone, setSelectedZone] = useState(createFlow === CREATE_FLOW.CREATE_AISLE ? currentZone.name : '');
  const [numberOfAisles, setNumberOfAisles] = useState(1);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  let existingAisles = 0;

  if (createFlow === CREATE_FLOW.CREATE_AISLE) {
    const zoneAisles = zones.find(zone => zone.zoneId === currentZone.id);
    if (zoneAisles) {
      existingAisles = zoneAisles.aisleCount;
    }
  }

  return (
    <AddZoneScreen
      zones={zones}
      possibleZones={possibleZones}
      currentZone={currentZone}
      createFlow={createFlow}
      selectedZone={selectedZone}
      setSelectedZone={setSelectedZone}
      numberOfAisles={numberOfAisles}
      setNumberOfAisles={setNumberOfAisles}
      existingAisles={existingAisles}
      dispatch={dispatch}
      navigation={navigation}
    />
  );
};

export default AddZone;
