import React, { useEffect } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  View
} from 'react-native';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { Header } from '@react-navigation/stack';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import styles from './addSection.style';
import { strings } from '../../locales';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { CreateAisles, LocationIdName } from '../../state/reducers/Location';
import NumericSelector from '../../components/NumericSelector/NumericSelector';
import Button from '../../components/buttons/Button';
import { CREATE_FLOW } from '../../models/LocationItems';
import { setAisleSectionCount } from '../../state/actions/Location';
import { postCreateAisles } from '../../state/actions/saga';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { CreateAisleRequest, CreateAisleResponse } from '../../models/CreateZoneAisleSection.d';
import { AsyncState } from '../../models/AsyncState';
import { showSnackBar } from '../../state/actions/SnackBar';

interface AddSectionProps {
  aislesToCreate: CreateAisles[];
  selectedZone: { id: number; name: string };
  newZone: string;
  createFlow: CREATE_FLOW;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  existingSections: number;
  currentAisle: LocationIdName;
  modal: any;
  createAislesApi: AsyncState;
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
  const { createAislesApi, dispatch, navigation } = props;

  const navigateBack = () => {
    dispatch({ type: 'API/POST_CREATE_AISLES/RESET' });
    navigation.navigate('Aisles');
  };

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
    const fullAisleName = `${strings('LOCATION.AISLE')} ${zoneName}${aisle.item.aisleName}`;
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
      case CREATE_FLOW.CREATE_ZONE: {
        // TODO implement createZoneAisleSection
        const createZoneAisleSectionRequest = {
          zoneName: props.newZone,
          aisles: props.aislesToCreate
        };
        break;
      }
      case CREATE_FLOW.CREATE_AISLE: {
        const createAisleSectionRequest: CreateAisleRequest = {
          zoneId: props.selectedZone.id,
          aisles: props.aislesToCreate
        };
        dispatch(postCreateAisles({ aislesToCreate: createAisleSectionRequest }));
        break;
      }
      case CREATE_FLOW.CREATE_SECTION: {
        // TODO implement createSection
        const createSectionRequest = {
          aisles: [{
            aisleId: props.currentAisle.id,
            sectionCount: props.aislesToCreate[0].sectionCount
          }]
        };
        break;
      }
      default:
        break;
    }
  };

  const handleUnhandledTouches = () => {
    Keyboard.dismiss();
    return false;
  };

  // activity modal
  useEffect(() => {
    if (navigation.isFocused()) {
      if (!props.modal.showActivity) {
        if (createAislesApi.isWaiting) {
          dispatch(showActivityModal());
        }
      } else if (!createAislesApi.isWaiting) {
        dispatch(hideActivityModal());
      }
    }
  }, [props.modal, createAislesApi]);

  // Create Aisles and Sections API
  useEffect(() => {
    if (navigation.isFocused() && !createAislesApi.isWaiting) {
      // Success
      if (createAislesApi.result) {
        const createdAisles = createAislesApi.result.data as Array<CreateAisleResponse>;
        switch (createAislesApi.result.status) {
          case 200:
            dispatch(showSnackBar(
              strings('LOCATION.AISLES_ADDED').replace('{number}', createdAisles.length.toString()),
              2000
            ));
            navigateBack();
            break;
          case 207: {
            let succeeded = 0;
            createdAisles.forEach(aisle => {
              if (aisle.status === 200) {
                succeeded++;
              }
            });
            dispatch(showSnackBar(
              `${strings('LOCATION.INCOMPLETE_AISLES_ADDED').replace('{number}', succeeded.toString())}`
              + `\n${strings('LOCATION.INCOMPLETE_AISLES_PLEASE_CHECK')}`,
              3000
            ));
            break;
          }
          default:
        }
      }

      // Failure
      if (createAislesApi.error) {
        dispatch(showSnackBar(strings('LOCATION.ADD_AISLES_ERROR'), 2000));
      }
    }
  }, [createAislesApi, navigation]);

  return (
    <KeyboardAvoidingView
      style={styles.safeAreaView}
      behavior="height"
      keyboardVerticalOffset={110}
      onStartShouldSetResponder={handleUnhandledTouches}
    >
      <View style={styles.bodyContainer}>
        <FlatList
          data={props.aislesToCreate}
          renderItem={renderAisles}
          keyExtractor={item => item.aisleName.toString()}
          removeClippedSubviews={false}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={strings('GENERICS.CONTINUE')}
          style={styles.doneButton}
          onPress={handleContinue}
          disabled={!validateSectionCounts(props.aislesToCreate, props.existingSections)}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const AddSection = (): JSX.Element => {
  const aisles = useTypedSelector(state => state.Location.aisles);
  const currentAisle = useTypedSelector(state => state.Location.selectedAisle);
  const aislesToCreate = useTypedSelector(state => state.Location.aislesToCreate);
  const selectedZone = useTypedSelector(state => state.Location.selectedZone);
  const newZone = useTypedSelector(state => state.Location.newZone);
  const createFlow = useTypedSelector(state => state.Location.createFlow);
  const modal = useTypedSelector(state => state.modal);
  const createAislesApi = useTypedSelector(state => state.async.postCreateAisles);
  const dispatch = useDispatch();
  const navigation = useNavigation();

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
      navigation={navigation}
      existingSections={existingSections}
      currentAisle={currentAisle}
      modal={modal}
      createAislesApi={createAislesApi}
    />
  );
};

export default AddSection;
