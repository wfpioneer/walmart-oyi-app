import React, {
  EffectCallback, useEffect, useLayoutEffect, useState
} from 'react';
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
import { GET_ZONE_NAMES } from '../../state/actions/asyncAPI';

interface AddZoneScreenProps {
  zones: ZoneItem[];
  possibleZones: PossibleZone[];
  currentZone: { id: number; name: string };
  createFlow: CREATE_FLOW;
  selectedZone: string;
  setSelectedZone: React.Dispatch<React.SetStateAction<string>>;
  numberOfAisles: number;
  setNumberOfAisles: React.Dispatch<React.SetStateAction<number>>;
  existingAisles: number;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
}

const NEW_ZONE_AISLE_MIN = 1;
const NEW_ZONE_AISLE_MAX = 99;

const addZonesToPicker = (
  zones: ZoneItem[],
  possibleZones: PossibleZone[],
  currentZone: { id: number; name: string },
  createFlow: CREATE_FLOW
) => {
  const availableZones = possibleZones.filter(
    possibleZone => !zones.some(zone => possibleZone.zoneName === zone.zoneName)
  );
  switch (createFlow) {
    case CREATE_FLOW.CREATE_AISLE:
      return <Picker.Item label={currentZone.name} value={currentZone.name} />;
    default:
      return [<Picker.Item label={strings('LOCATION.SELECT_ZONE')} value="" key={-1} />,
        ...availableZones.filter(zone => zone.description != null).map((zone: PossibleZone) => {
          const zoneLabel = `${zone.zoneName} - ${zone.description}`;
          return (
            <Picker.Item label={zoneLabel} value={zone.zoneName} key={zoneLabel} />
          );
        })];
  }
};

const validateNumericInput = (aisles: number, existingAisles = 0): boolean => (aisles >= NEW_ZONE_AISLE_MIN)
  && (aisles <= (NEW_ZONE_AISLE_MAX - existingAisles));

const disableContinue = (aisles: number, existingAisles = 0, selectedZone: string) => !aisles
  || aisles < NEW_ZONE_AISLE_MIN
  || aisles > (NEW_ZONE_AISLE_MAX - existingAisles)
  || selectedZone === '';

export const AddZoneScreen = (props: AddZoneScreenProps): JSX.Element => {
  const {
    createFlow,
    currentZone,
    dispatch,
    existingAisles,
    navigation,
    numberOfAisles,
    possibleZones,
    selectedZone,
    setNumberOfAisles,
    setSelectedZone,
    useEffectHook,
    zones
  } = props;

  // Navigation Listener clear zone name api when leaving this screen
  useEffectHook(() => navigation.addListener('beforeRemove', () => {
    dispatch({ type: GET_ZONE_NAMES.RESET });
  }), []);

  useLayoutEffect(() => {
    if (navigation.isFocused()) {
      if (createFlow === CREATE_FLOW.CREATE_AISLE) {
        navigation.setOptions({
          headerTitle: strings('LOCATION.ADD_AISLES')
        });
      } else {
        navigation.setOptions({
          headerTitle: strings('LOCATION.ADD_ZONE')
        });
      }
    }
  }, []);

  const handleIncreaseAisle = () => {
    setNumberOfAisles((prevState: number) => {
      if (prevState < NEW_ZONE_AISLE_MAX - existingAisles) {
        return prevState + 1;
      }
      return prevState;
    });
  };

  const handleDecreaseAisle = () => {
    setNumberOfAisles((prevState: number) => {
      if (prevState > NEW_ZONE_AISLE_MIN) {
        return prevState - 1;
      }
      return prevState;
    });
  };
  const handleTextChange = (text: string) => {
    const newQty: number = parseInt(text, 10);
    setNumberOfAisles(newQty);
  };

  const handleAisleEndEditing = () => {
    if (!numberOfAisles) {
      setNumberOfAisles(1);
    }
  };

  const handleContinue = () => {
    switch (createFlow) {
      case CREATE_FLOW.CREATE_AISLE:
        dispatch(setAislesToCreate(numberOfAisles));
        break;
      default:
        dispatch(setAislesToCreate(numberOfAisles));
        dispatch(setNewZone(selectedZone));
    }
    navigation.navigate('AddSection');
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
            selectedValue={selectedZone}
            onValueChange={zone => setSelectedZone(zone)}
          >
            {addZonesToPicker(zones, possibleZones, currentZone, createFlow)}
          </Picker>
        </View>
        <View style={styles.aisleContainer}>
          <View style={styles.aisleNumericContainer}>
            <Text style={styles.aisleText}>
              {strings('LOCATION.ADD_AISLES')}
            </Text>
            <NumericSelector
              isValid={validateNumericInput(numberOfAisles, existingAisles)}
              onDecreaseQty={handleDecreaseAisle}
              onIncreaseQty={handleIncreaseAisle}
              onTextChange={handleTextChange}
              minValue={NEW_ZONE_AISLE_MIN}
              maxValue={NEW_ZONE_AISLE_MAX}
              value={numberOfAisles}
              onEndEditing={handleAisleEndEditing}
            />
          </View>
          {!validateNumericInput(numberOfAisles, existingAisles) && (
            <Text style={styles.invalidLabel}>
              {strings('ITEM.OH_UPDATE_ERROR', {
                min: NEW_ZONE_AISLE_MIN,
                max: NEW_ZONE_AISLE_MAX - existingAisles
              })}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={strings('GENERICS.CONTINUE')}
          onPress={handleContinue}
          disabled={disableContinue(numberOfAisles, existingAisles, selectedZone)}
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
      useEffectHook={useEffect}
    />
  );
};

export default AddZone;
