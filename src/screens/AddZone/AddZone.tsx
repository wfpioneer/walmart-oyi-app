import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Dispatch } from 'redux';
import { Picker } from '@react-native-picker/picker';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import NumericSelector from '../../components/NumericSelector/NumericSelector';
import styles from './AddZone.style';
import { CREATE_FLOW, PossibleZone, ZoneItem } from '../../models/LocationItems';
import { setNewZone, setNumberOfAislesToCreate } from '../../state/actions/Location';
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
        ...availableZones.map((zone: PossibleZone, index: number) => {
          const zoneLabel = `${zone.name} - ${zone.description}`;
          return (
            <Picker.Item label={zoneLabel} value={zone.name} key={index} />
          );
        })];
  }
};

const validateNumericInput = (aisles: number, existingAisles = 0): boolean =>
  (aisles >= NEW_ZONE_AISLE_MIN) && (aisles <= (NEW_ZONE_AISLE_MAX - existingAisles));


const disableContinue = (aisles: number, existingAisles = 0, selectedZone: string) =>
  aisles < NEW_ZONE_AISLE_MIN || aisles > (NEW_ZONE_AISLE_MAX - existingAisles) || selectedZone === '';

export const AddZoneScreen = (props: AddZoneScreenProps): JSX.Element => {
  const handleIncreaseAisle = () => {
    props.setNumberOfAisles((prevState: number) => prevState < NEW_ZONE_AISLE_MAX - props.existingAisles ? prevState + 1 : prevState);
  };

  const handleDecreaseAisle = () => {
    props.setNumberOfAisles((prevState: number) => prevState > NEW_ZONE_AISLE_MIN ? prevState - 1 : prevState);
  };

  const handleTextChange = (text: string) => {
    const newQty: number = parseInt(text, 10);
    if (!Number.isNaN(newQty)) {
      props.setNumberOfAisles(newQty);
    }
  };

  const handleContinue = () => {
    // TODO add navigation to new aisles screen once it is created
    switch (props.createFlow) {
      case CREATE_FLOW.CREATE_AISLE:
        props.dispatch(setNumberOfAislesToCreate(props.numberOfAisles));
        break;
      default:
        props.dispatch(setNumberOfAislesToCreate(props.numberOfAisles));
        props.dispatch(setNewZone(props.selectedZone));
    }
  };

  return (
    <View style={styles.safeAreaView}>
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
        <TouchableOpacity
          style={styles.continueButton}
          disabled={disableContinue(props.numberOfAisles, props.existingAisles, props.selectedZone)}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>{strings('GENERICS.CONTINUE')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AddZone = (): JSX.Element => {
  const zones = useTypedSelector(state => state.Location.zones);
  const possibleZones = useTypedSelector(state => state.Location.possibleZones);
  const currentZone = useTypedSelector(state => state.Location.selectedZone);
  const createFlow = useTypedSelector(state => state.Location.createFlow);
  const [selectedZone, setSelectedZone] = useState('');
  const [numberOfAisles, setNumberOfAisles] = useState(1);
  const dispatch = useDispatch();

  let existingAisles = 0;

  if (createFlow === CREATE_FLOW.CREATE_AISLE) {
    const zoneAisles = zones.find(zone => zone.zoneId === currentZone.id);
    if ( zoneAisles ) {
      existingAisles = zoneAisles.aisleCount
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
    />
  );
};

export default AddZone;
