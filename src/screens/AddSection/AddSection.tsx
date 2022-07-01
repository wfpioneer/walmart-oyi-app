import React, { EffectCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  View
} from 'react-native';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { showSnackBar } from '../../state/actions/SnackBar';
import styles from './addSection.style';
import { strings } from '../../locales';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { CreateAisles, CreateZoneRequest, LocationIdName } from '../../state/reducers/Location';
import { createSections, postCreateAisles, postCreateZone } from '../../state/actions/saga';
import NumericSelector from '../../components/NumericSelector/NumericSelector';
import Button from '../../components/buttons/Button';
import { trackEvent } from '../../utils/AppCenterTool';
import { validateSession } from '../../utils/sessionTimeout';
import { CREATE_FLOW, PossibleZone } from '../../models/LocationItems';
import { AsyncState } from '../../models/AsyncState';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { setAisleSectionCount } from '../../state/actions/Location';
import { CreateAisleRequest, CreateAisleResponse } from '../../models/CreateZoneAisleSection.d';
import { SNACKBAR_TIMEOUT } from '../../utils/global';
import { CREATE_SECTIONS, CREATE_ZONE, POST_CREATE_AISLES } from '../../state/actions/asyncAPI';

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
  createAislesApiStart: number;
  setCreateAislesApiStart: React.Dispatch<React.SetStateAction<number>>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  createSectionsAPI: AsyncState;
  createSectionsAPIStart: number;
  setCreateSectionsAPIStart: React.Dispatch<React.SetStateAction<number>>;
  possibleZones: PossibleZone[];
  createZoneAPI: AsyncState;
}

interface RenderAisles {
  item: CreateAisles;
  index: number;
}

const NEW_SECTION_MAX = 99;
const SECTION_MIN = 1;

export const validateNumericInput = (sections: number, existingSections = 0): boolean => (sections >= SECTION_MIN)
  && (sections <= (NEW_SECTION_MAX - existingSections));

export const validateSectionCounts = (aislesToCreate: CreateAisles[], existingSections: number): boolean => {
  let validation = true;
  aislesToCreate.forEach(aisle => {
    if (!aisle.sectionCount
      || (aisle.sectionCount < SECTION_MIN)
      || (aisle.sectionCount > (NEW_SECTION_MAX - existingSections))) {
      validation = false;
    }
  });
  return validation;
};

export const activityModalEffect = (
  navigation: NavigationProp<any>,
  modal: { showActivity: boolean; showModal: boolean; content: any },
  createAislesApi: AsyncState,
  createSectionsAPI: AsyncState,
  dispatch: Dispatch<any>,
  createZoneAPI: AsyncState
): void => {
  if (navigation.isFocused()) {
    if (!modal.showActivity) {
      if (createZoneAPI.isWaiting || createAislesApi.isWaiting || createSectionsAPI.isWaiting) {
        dispatch(showActivityModal());
      }
    } else if (!createZoneAPI.isWaiting && !createAislesApi.isWaiting && !createSectionsAPI.isWaiting) {
      dispatch(hideActivityModal());
    }
  }
};

export const createAisleSectionsEffect = (
  createAislesApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  createAislesApiStart: number,
  trackApiEvents: (eventName: string, params: any) => void
): void => {
  if (navigation.isFocused() && !createAislesApi.isWaiting) {
    // Success
    if (createAislesApi.result) {
      const createdAisles = createAislesApi.result.data as Array<CreateAisleResponse>;
      switch (createAislesApi.result.status) {
        case 200:
          trackApiEvents('create_aisles_success', { duration: moment().valueOf() - createAislesApiStart });
          dispatch(showSnackBar(
            strings('LOCATION.AISLES_ADDED').replace('{number}', createdAisles.length.toString()),
            2000
          ));
          dispatch({ type: POST_CREATE_AISLES.RESET });
          navigation.navigate('Aisles');
          break;
        case 207: {
          let succeeded = 0;
          createdAisles.forEach(aisle => {
            if (aisle.status === 200) {
              succeeded++;
            }
          });
          trackApiEvents('create_aisles_partial_success', {
            duration: moment().valueOf() - createAislesApiStart,
            succeeded,
            total: createdAisles.length
          });
          dispatch(showSnackBar(
            `${strings('LOCATION.INCOMPLETE_AISLES_ADDED').replace('{number}', succeeded.toString())}`
            + `\n${strings('LOCATION.INCOMPLETE_AISLES_PLEASE_CHECK')}`,
            3000
          ));
          dispatch({ type: POST_CREATE_AISLES.RESET });
          navigation.navigate('Aisles');
          break;
        }
        default:
      }
    }

    // Failure
    if (createAislesApi.error) {
      trackApiEvents('create_aisles_failure', {
        duration: moment().valueOf() - createAislesApiStart,
        errorDetails: createAislesApi.error.message || createAislesApi.error.toString()
      });
      dispatch(showSnackBar(strings('LOCATION.ADD_AISLES_ERROR'), 2000));
    }
  }
};

export const createSectionsAPIEffect = (
  createSectionsAPI: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  createSectionsAPIStart: number,
  aisleSectionCount: number,
  trackAPIEvents: (eventName: string, params: any) => void
): void => {
  // on api success
  if (!createSectionsAPI.isWaiting && createSectionsAPI.result) {
    trackAPIEvents('create_sections_success', { duration: moment().valueOf() - createSectionsAPIStart });
    dispatch(
      showSnackBar(strings('LOCATION.SECTIONS_ADDED', { number: aisleSectionCount }), 3000)
    );
    dispatch({ type: CREATE_SECTIONS.RESET });
    navigation.goBack();
  }

  // on api failure
  if (!createSectionsAPI.isWaiting && createSectionsAPI.error) {
    trackAPIEvents(
      'create_sections_failure',
      {
        errorDetails: createSectionsAPI.error.message || createSectionsAPI.error,
        duration: moment().valueOf() - createSectionsAPIStart
      }
    );
    dispatch(showSnackBar(strings('LOCATION.ADD_SECTIONS_ERROR'), 3000));
  }
};

export const AddSectionScreen = (props: AddSectionProps): JSX.Element => {
  const {
    createAislesApi,
    createSectionsAPI,
    createAislesApiStart,
    createSectionsAPIStart,
    setCreateAislesApiStart,
    dispatch,
    navigation,
    useEffectHook,
    createZoneAPI
  } = props;

  // activity modal
  useEffectHook(() => activityModalEffect(
    navigation,
    props.modal,
    createAislesApi,
    createSectionsAPI,
    dispatch,
    createZoneAPI
  ), [props.modal, createAislesApi, createSectionsAPI, createZoneAPI]);

  useEffectHook(() => createAisleSectionsEffect(
    createAislesApi,
    dispatch,
    navigation,
    createAislesApiStart,
    trackEvent
  ), [createAislesApi]);

  useEffectHook(() => {
    createSectionsAPIEffect(
      createSectionsAPI,
      dispatch,
      navigation,
      createSectionsAPIStart,
      props.aislesToCreate[0].sectionCount,
      trackEvent
    );
  }, [createSectionsAPI]);

  const handleAisleSectionCountIncrement = (aisleIndex: number, sectionCount: number) => {
    if (sectionCount < NEW_SECTION_MAX - props.existingSections) {
      props.dispatch(setAisleSectionCount(aisleIndex, sectionCount + 1));
    } else if (!sectionCount) {
      props.dispatch(setAisleSectionCount(aisleIndex, 1));
    }
  };

  const handleAisleSectionCountDecrement = (aisleIndex: number, sectionCount: number) => {
    if (sectionCount > SECTION_MIN) {
      props.dispatch(setAisleSectionCount(aisleIndex, sectionCount - 1));
    }
  };

  const handleTextSectionCountChange = (text: string, aisleIndex: number) => {
    const newQty = parseInt(text, 10);
    props.dispatch(setAisleSectionCount(aisleIndex, newQty));
  };

  const handleSectionEndEditing = (aisleIndex: number, sectionCount: number) => {
    if (typeof (sectionCount) !== 'number' || Number.isNaN(sectionCount)) {
      props.dispatch(setAisleSectionCount(aisleIndex, 1));
    }
  };

  props.useEffectHook(() => {
    if (!props.createZoneAPI.isWaiting && props.createZoneAPI.result) {
      props.dispatch(hideActivityModal());
      switch (props.createZoneAPI.result.status) {
        case 200:
          props.dispatch(
            showSnackBar(strings('LOCATION.ZONE_ADDED', {
              name:
                props.possibleZones.filter(zone => zone.description != null)
                  .find(zone => zone.zoneName === props.newZone)?.description
            }), SNACKBAR_TIMEOUT)
          );
          props.dispatch({ type: CREATE_ZONE.RESET });
          props.navigation.navigate('Zones');
          break;
        case 207: {
          props.dispatch(
            showSnackBar(strings('LOCATION.INCOMPLETE_ZONE_ADDED', {
              name:
                props.possibleZones.filter(zone => zone.description != null)
                  .find(zone => zone.zoneName === props.newZone)?.description
            }), SNACKBAR_TIMEOUT)
          );
          props.dispatch({ type: CREATE_ZONE.RESET });
          navigation.navigate('Zones');
          break;
        }
        default:
      }
    }

    // on api failure
    if (!props.createZoneAPI.isWaiting && props.createZoneAPI.error) {
      props.dispatch(hideActivityModal());
      props.dispatch(showSnackBar(strings('LOCATION.ADD_ZONE_ERROR'), 3000));
      props.dispatch({ type: 'API/CREATE_ZONE/RESET' });
    }
  }, [props.createZoneAPI]);

  const aisleDivider = () => (
    <View style={styles.aisleSeparator} />
  );

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
            onEndEditing={() => {
              handleSectionEndEditing(aisle.index, aisle.item.sectionCount);
            }}
            minValue={SECTION_MIN}
            maxValue={NEW_SECTION_MAX}
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
    validateSession(props.navigation).then(() => {
      switch (props.createFlow) {
        case CREATE_FLOW.CREATE_ZONE: {
          // TODO implement createZoneAisleSection
          const createZoneAisleSectionRequest: CreateZoneRequest = {
            zoneName: props.newZone,
            description: props.possibleZones.find(zone => zone.zoneName === props.newZone)?.description ?? '',
            aisles: props.aislesToCreate
          };
          props.dispatch(postCreateZone(createZoneAisleSectionRequest));
          break;
        }
        case CREATE_FLOW.CREATE_AISLE: {
          const createAisleSectionRequest: CreateAisleRequest = {
            zoneId: props.selectedZone.id,
            aisles: props.aislesToCreate
          };
          setCreateAislesApiStart(moment().valueOf());
          dispatch(postCreateAisles({ aislesToCreate: createAisleSectionRequest }));
          break;
        }
        case CREATE_FLOW.CREATE_SECTION: {
          props.setCreateSectionsAPIStart(moment().valueOf());
          props.dispatch(createSections([{
            aisleId: props.currentAisle.id,
            sectionCount: props.aislesToCreate[0].sectionCount
          }]));
          break;
        }
        default:
          break;
      }
    });
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
        <FlatList
          data={props.aislesToCreate}
          renderItem={renderAisles}
          keyExtractor={item => item.aisleName.toString()}
          removeClippedSubviews={false}
          ItemSeparatorComponent={aisleDivider}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={strings('GENERICS.SUBMIT')}
          style={styles.doneButton}
          onPress={handleContinue}
          disabled={!validateSectionCounts(props.aislesToCreate, props.existingSections)}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const AddSection = (): JSX.Element => {
  const createSectionsAPI = useTypedSelector(state => state.async.createSections);
  const aisles = useTypedSelector(state => state.Location.aisles);
  const currentAisle = useTypedSelector(state => state.Location.selectedAisle);
  const aislesToCreate = useTypedSelector(state => state.Location.aislesToCreate);
  const selectedZone = useTypedSelector(state => state.Location.selectedZone);
  const newZone = useTypedSelector(state => state.Location.newZone);
  const createFlow = useTypedSelector(state => state.Location.createFlow);
  const modal = useTypedSelector(state => state.modal);
  const createAislesApi = useTypedSelector(state => state.async.postCreateAisles);
  const possibleZones = useTypedSelector(state => state.Location.possibleZones);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [createAislesApiStart, setCreateAislesApiStart] = useState(0);
  const [createSectionsAPIStart, setCreateSectionsAPIStart] = useState(0);
  const createZoneAPI = useTypedSelector(state => state.async.postCreateZone);
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
      createAislesApiStart={createAislesApiStart}
      setCreateAislesApiStart={setCreateAislesApiStart}
      useEffectHook={useEffect}
      createSectionsAPI={createSectionsAPI}
      createSectionsAPIStart={createSectionsAPIStart}
      setCreateSectionsAPIStart={setCreateSectionsAPIStart}
      possibleZones={possibleZones}
      createZoneAPI={createZoneAPI}
    />
  );
};

export default AddSection;
