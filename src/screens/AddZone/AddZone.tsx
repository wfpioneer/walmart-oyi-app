import React, { EffectCallback, useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { useTypedSelector } from '../../state/reducers/RootReducer';
import NumericSelector from '../../components/NumericSelector/NumericSelector';
import styles from './AddZone.style';
import COLOR from '../../themes/Color';
import { PossibleZone, ZoneItem } from '../../models/LocationItems';

interface AddZoneScreenProps {
  zones: ZoneItem[];
  possibleZones: PossibleZone[];
  selectedZone: string;
  setSelectedZone: any;
  numberOfAisles: number;
  setNumberOfAisles: any;
}

const NEW_ZONE_AISLE_MIN = 1;
const NEW_ZONE_AISLE_MAX = 99;

const addZonesToPicker = (zones: ZoneItem[], possibleZones: PossibleZone[]) => {
  const availableZones = possibleZones.filter(possibleZone => !zones.some(zone => possibleZone.name === zone.zoneName));
  return availableZones.map((zone: PossibleZone, index: number) => {
    const zoneLabel = `${zone.name} - ${zone.description}`;
    return (
      <Picker.Item label={zoneLabel} value={zone.name} key={index}/>
    )
  })
};

const validateNumericInput = (aisles: number, existingAisles = 0): boolean => {
  return (aisles >= NEW_ZONE_AISLE_MIN) && (aisles <= (NEW_ZONE_AISLE_MAX - existingAisles));
};


export const AddZoneScreen = (props: AddZoneScreenProps): JSX.Element => {
  const handleIncreaseAisle = () => {
    props.setNumberOfAisles((prevState: number) => prevState + 1)
  };

  const handleDecreaseAisle = () => {
    props.setNumberOfAisles((prevState: number) => prevState - 1)
  };

  return (
    <View>
      <View style={styles.zonePickerContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>Zone</Text>
        </View>
        <Picker
          selectedValue={props.selectedZone}
          onValueChange={zone => props.setSelectedZone(zone)}
        >
          {addZonesToPicker(props.zones, props.possibleZones)}
        </Picker>
      </View>
      <View style={styles.aisleContainer}>
        <Text style={styles.aisleText}>
          Number of aisles
        </Text>
        <NumericSelector
          isValid={validateNumericInput(props.numberOfAisles)}
          onDecreaseQty={handleDecreaseAisle}
          onIncreaseQty={handleIncreaseAisle}
          onTextChange={() => {}}
          value={props.numberOfAisles}
        />
      </View>
    </View>
  )
};

const AddZone = (): JSX.Element => {
  const zones = useTypedSelector(state => state.Location.zones);
  const possibleZones = useTypedSelector(state => state.Location.possibleZones);
  const [selectedZone, setSelectedZone] = useState('');
  const [numberOfAisles, setNumberOfAisles] = useState(1);

  return (
    <AddZoneScreen
      zones={zones}
      possibleZones={possibleZones}
      selectedZone={selectedZone}
      setSelectedZone={setSelectedZone}
      numberOfAisles={numberOfAisles}
      setNumberOfAisles={setNumberOfAisles}
    />
  )
};

export default AddZone;