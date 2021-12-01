import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Dispatch } from 'redux';
import styles from './addSection.style';
import { strings } from '../../locales';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { CreateAisles, LocationIdName } from '../../state/reducers/Location';
import NumericSelector from '../../components/NumericSelector/NumericSelector';
import { CREATE_FLOW } from '../../models/LocationItems';
import { useDispatch } from 'react-redux';
import { setAisleSectionCount } from '../../state/actions/Location';

interface AddSectionProps {
  aislesToCreate: CreateAisles[];
  selectedZone: { id: number; name: string };
  newZone: string;
  createFlow: CREATE_FLOW;
  dispatch: Dispatch<any>;
  existingSections: number;
  currentAisle: LocationIdName
}

interface RenderAisles {
  item: CreateAisles;
  index: number;
}

const NEW_SECTION_MAX = 99;
const SECTION_MIN = 1;

const validateNumericInput = (sections: number, existingSections = 0): boolean => (sections >= SECTION_MIN)
  && (sections <= (NEW_SECTION_MAX - existingSections));

const validateSectionCounts = (aislesToCreate: CreateAisles[], existingSections: number): boolean => {
  let validation = true;
  aislesToCreate.forEach(aisle => {
    if ((aisle.sectionCount < SECTION_MIN) || (aisle.sectionCount > (NEW_SECTION_MAX - existingSections))) {
      validation = false;
    }
  });
  return validation;
};

export const AddSectionScreen = (props: AddSectionProps): JSX.Element => {
  const handleAisleSectionCountIncrement = (aisleIndex: number, sectionCount: number) => {
    if (sectionCount < NEW_SECTION_MAX - props.existingSections) {
      props.dispatch(setAisleSectionCount(aisleIndex, sectionCount + 1));
    }
  };

  const handleAisleSectionCountDecrement = (aisleIndex: number, sectionCount: number) => {
    if (sectionCount > SECTION_MIN) {
      props.dispatch(setAisleSectionCount(aisleIndex, sectionCount - 1));
    }
  };

  const handleTextSectionCountChange = (text: string, aisleIndex: number) => {
    const newQty = parseInt(text, 10);
    if (!Number.isNaN(newQty)) {
      props.dispatch(setAisleSectionCount(aisleIndex, newQty));
    }
  };

  const renderAisles = (aisle: RenderAisles) => {
    const zoneName = props.createFlow === CREATE_FLOW.CREATE_ZONE ? props.newZone : props.selectedZone.name;
    const fullAisleName = `${strings('LOCATION.AISLE')} ${zoneName}${aisle.item.name}`;
    return (
      <View style={styles.aisleContainer} key={fullAisleName}>
        <View style={styles.aisleNumericContainer}>
          <Text style={styles.aisleText}>
            {fullAisleName}
          </Text>
          <NumericSelector
            isValid={validateNumericInput(aisle.item.sectionCount, props.existingSections)}
            onDecreaseQty={() => {
              handleAisleSectionCountDecrement(aisle.index, aisle.item.sectionCount);
            }}
            onIncreaseQty={() => {
              handleAisleSectionCountIncrement(aisle.index, aisle.item.sectionCount);
            }}
            onTextChange={(text: string) => {
              handleTextSectionCountChange(text, aisle.index);
            }}
            value={aisle.item.sectionCount}
          />
        </View>
        {!validateNumericInput(aisle.item.sectionCount, props.existingSections) && (
          <Text style={styles.invalidLabel}>
            {strings('ITEM.OH_UPDATE_ERROR', {
              min: SECTION_MIN,
              max: NEW_SECTION_MAX - props.existingSections
            })}
          </Text>
        )}
      </View>
    );
  };

  const handleContinue = () => {
    console.log('continue pressed');
    switch (props.createFlow) {
      case CREATE_FLOW.CREATE_ZONE:
        // TODO implement createZoneAisleSection
        const createZoneAisleSectionRequest = {
          zoneName: props.newZone,
          aisles: props.aislesToCreate
        };
        break;
      case CREATE_FLOW.CREATE_AISLE:
        // TODO implement createAisleSection
        const createAisleSectionRequest = {
          zoneId: props.selectedZone.id,
          aisles: props.aislesToCreate
        };
        break;
      case CREATE_FLOW.CREATE_SECTION:
        // TODO implement createSection
        const createSectionRequest = {
          aisles: [{
            aisleId: props.currentAisle.id,
            sectionCount: props.aislesToCreate[0].sectionCount
          }]
        };
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.safeAreaView}>
      <View style={styles.bodyContainer}>
        <FlatList
          data={props.aislesToCreate}
          renderItem={renderAisles}
          keyExtractor={(item) => item.name.toString()}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={handleContinue}
          disabled={!validateSectionCounts(props.aislesToCreate, props.existingSections)}
        >
          <Text style={styles.buttonText}>{strings('GENERICS.CONTINUE')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AddSection = (): JSX.Element => {
  const aisles = useTypedSelector(state => state.Location.aisles);
  const currentAisle = useTypedSelector(state => state.Location.selectedAisle);
  const aislesToCreate = useTypedSelector(state => state.Location.aislesToCreate);
  const selectedZone = useTypedSelector(state => state.Location.selectedZone);
  const newZone = useTypedSelector(state => state.Location.newZone);
  const createFlow = useTypedSelector(state => state.Location.createFlow);
  const dispatch = useDispatch();

  let existingSections = 0;
  if (createFlow === CREATE_FLOW.CREATE_SECTION) {
    const zoneAisles = aisles.find(aisle => aisle.aisleId === currentAisle.id);
    if (zoneAisles) {
      existingSections = zoneAisles.sectionCount;
    }
  }

  return (
    <AddSectionScreen
      aislesToCreate={aislesToCreate}
      selectedZone={selectedZone}
      newZone={newZone}
      createFlow={createFlow}
      dispatch={dispatch}
      existingSections={existingSections}
      currentAisle={currentAisle}
    />
  );
};

export default AddSection;