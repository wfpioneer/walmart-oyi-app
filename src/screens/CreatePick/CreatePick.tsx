import React, {
  Dispatch,
  EffectCallback,
  useEffect,
  useState
} from 'react';
import {
  Pressable,
  SafeAreaView,
  Text,
  View
} from 'react-native';
import { useDispatch } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import ItemInfo from '../../components/iteminfo/ItemInfo';
import NumericSelector from '../../components/NumericSelector/NumericSelector';
import Button from '../../components/buttons/Button';
import Location from '../../models/Location';
import { strings } from '../../locales';
import styles from './CreatePick.style';
import { UseStateType } from '../../models/Generics.d';
import { PickCreateItem, Tabs } from '../../models/Picking.d';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { setupScreen } from '../../state/actions/ItemDetailScreen';
import { AsyncState } from '../../models/AsyncState';
import { setPickCreateFloor, setPickCreateReserve } from '../../state/actions/Picking';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { CREATE_NEW_PICK, GET_LOCATION_DETAILS } from '../../state/actions/asyncAPI';
import { createNewPick } from '../../state/actions/saga';
import { SNACKBAR_TIMEOUT } from '../../utils/global';

export const MOVE_TO_FRONT = 'moveToFront';
export const PALLET_MIN = 1;
export const PALLET_MAX = 99;

interface CreatePickProps {
  item: PickCreateItem;
  floorLocations: Location[];
  reserveLocations: Location[];
  selectedSectionState: UseStateType<string>;
  palletNumberState: UseStateType<number>;
  selectedTab: Tabs;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  getLocationApi: AsyncState;
  createPickApi: AsyncState;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
}

export const getLocationsApiHook = (getLocationApi: AsyncState, dispatch: Dispatch<any>, isFocused: boolean) => {
  const { isWaiting, result, error } = getLocationApi;
  if (isFocused) {
    // API success
    if (!isWaiting && result) {
      dispatch(setPickCreateFloor(result.data.location.floor || []));
      dispatch(setPickCreateReserve(result.data.location.reserve || []));
      dispatch(hideActivityModal());
      dispatch({ type: GET_LOCATION_DETAILS.RESET });
      Toast.show({
        type: 'success',
        text1: strings('PICKING.LOCATIONS_UPDATED'),
        visibilityTime: 4000,
        position: 'bottom'
      });
    }
    // API failure
    if (!isWaiting && error) {
      dispatch(hideActivityModal());
      dispatch({ type: GET_LOCATION_DETAILS.RESET });
      Toast.show({
        type: 'error',
        text1: strings('PICKING.LOCATIONS_FAILED_UPDATE'),
        visibilityTime: 4000,
        position: 'bottom'
      });
    }
    // API waiting
    if (isWaiting) {
      dispatch(showActivityModal());
    }
  }
};

export const createPickApiHook = (
  createPickApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>
) => {
  const { isWaiting, result, error } = createPickApi;
  if (navigation.isFocused()) {
    // API success
    if (!isWaiting && result) {
      dispatch(hideActivityModal());
      dispatch({ type: CREATE_NEW_PICK.RESET });
      navigation.goBack();
      Toast.show({
        type: 'success',
        text1: strings('PICKING.CREATE_NEW_PICK_SUCCESS'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
    }
    // API failure
    if (!isWaiting && error) {
      dispatch(hideActivityModal());
      if (error.response && error.response.status === 409
        && error.response.data.errorEnum === 'NO_RESERVE_PALLETS_AVAILABLE') {
        Toast.show({
          type: 'error',
          text1: strings('PICKING.NO_RESERVE_PALLET_AVAILABLE_ERROR'),
          visibilityTime: SNACKBAR_TIMEOUT,
          position: 'bottom'
        });
      } else if (error.response && error.response.status === 409) {
        Toast.show({
          type: 'error',
          text1: strings('PICKING.PICK_REQUEST_CRITERIA_ALREADY_MET'),
          visibilityTime: SNACKBAR_TIMEOUT,
          position: 'bottom'
        });
      } else {
        Toast.show({
          type: 'error',
          text1: strings('PICKING.CREATE_NEW_PICK_FAILURE'),
          visibilityTime: SNACKBAR_TIMEOUT,
          position: 'bottom'
        });
      }
      dispatch({ type: CREATE_NEW_PICK.RESET });
    }
    // API waiting
    if (isWaiting) {
      dispatch(showActivityModal());
    }
  }
};

export const addLocationHandler = (
  item: PickCreateItem,
  floorLocations: Location[],
  reserveLocations: Location[],
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>
) => {
  dispatch(setupScreen(
    item ? item.itemNbr : 0,
    item ? item.upcNbr : '',
    floorLocations,
    reserveLocations,
    null,
    -999,
    false,
    false
  ));
  navigation.navigate('AddLocation');
};

export const CreatePickScreen = (props: CreatePickProps) => {
  const {
    item, floorLocations, reserveLocations, selectedSectionState, createPickApi,
    palletNumberState, dispatch, navigation, getLocationApi, useEffectHook,
    selectedTab
  } = props;

  const [selectedSection, setSelectedSection] = selectedSectionState;
  const [palletNumber, setPalletNumber] = palletNumberState;

  useEffectHook(
    () => getLocationsApiHook(getLocationApi, dispatch, navigation.isFocused()),
    [getLocationApi]
  );
  useEffectHook(
    () => createPickApiHook(createPickApi, dispatch, navigation),
    [createPickApi]
  );

  const pickerLocations = (locations: Location[]) => {
    const pickerItems = [
      ...locations.map((location: Location) => (
        <Picker.Item label={location.locationName} value={location.locationName} key={location.locationName} />
      )),
      <Picker.Item label={strings('PICKING.MOVE_TO_FRONT')} value={MOVE_TO_FRONT} key={MOVE_TO_FRONT} />
    ];

    if (!locations.length) {
      pickerItems.unshift(<Picker.Item label={strings('PICKING.SELECT_LOCATION')} value="" key={-1} />);
    }

    return pickerItems;
  };

  const onPalletIncrease = (
    numberOfPallets: number,
    setNumberOfPallets: React.Dispatch<React.SetStateAction<number>>
  ) => {
    if (numberOfPallets < PALLET_MAX) {
      setNumberOfPallets((previousState: number) => previousState + 1);
    }
  };

  const onPalletDecrease = (
    numberOfPallets: number,
    setNumberOfPallets: React.Dispatch<React.SetStateAction<number>>
  ) => {
    if (numberOfPallets > PALLET_MIN) {
      setNumberOfPallets((previousState: number) => previousState - 1);
    }
  };

  const onPalletTextChange = (text: string, setNumberOfPallets: React.Dispatch<React.SetStateAction<number>>) => {
    const newQty = parseInt(text, 10);
    if (!Number.isNaN(newQty) && newQty >= PALLET_MIN && newQty <= PALLET_MAX) {
      setNumberOfPallets(newQty);
    }
  };

  const isNumberOfPalletsValid = (numberOfPallets: number) => (
    numberOfPallets >= PALLET_MIN && numberOfPallets <= PALLET_MAX
  );

  const disableCreateButton = () => !selectedSection || !reserveLocations.length;

  const onSubmit = () => {
    dispatch(createNewPick({
      category: item.categoryNbr,
      itemDesc: item.itemName,
      itemNbr: item.itemNbr,
      quickPick: selectedTab === Tabs.QUICKPICK,
      salesFloorLocationName: floorLocations && floorLocations.length ? floorLocations[0].locationName : undefined,
      upcNbr: item.upcNbr,
      moveToFront: selectedSection === MOVE_TO_FRONT,
      numberOfPallets: palletNumber,
      salesFloorLocationId: floorLocations && floorLocations.length ? floorLocations[0].sectionId : undefined
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.itemDetailsView}>
        <ItemInfo
          category={`${item.categoryNbr} - ${item.categoryDesc}`}
          itemName={item.itemName}
          itemNbr={item.itemNbr}
          upcNbr={item.upcNbr}
          price={item.price}
          status={item.status || ''}
        />
      </View>
      <View style={styles.pickParamView}>
        <View style={styles.pickParamLine}>
          <MaterialCommunityIcons name="map-marker-outline" size={40} />
          <Text>{strings('ITEM.LOCATION')}</Text>
          <Pressable
            onPress={() => addLocationHandler(item, floorLocations, reserveLocations, dispatch, navigation)}
            style={styles.pickLocationAddButton}
          >
            <Text style={styles.pickLocationAddText}>{strings('GENERICS.ADD')}</Text>
          </Pressable>
        </View>
        <View style={styles.pickParamLine}>
          <Text>{strings('PICKING.RESERVE_LOC')}</Text>
          <Text>{reserveLocations.length > 0 && reserveLocations[0].locationName}</Text>
        </View>
        <View style={styles.pickParamLine}>
          <Text>{strings('PICKING.FLOOR_LOC')}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedSection}
              onValueChange={section => setSelectedSection(section)}
              mode="dropdown"
              testID="sectionPicker"
            >
              {pickerLocations(floorLocations || [])}
            </Picker>
          </View>
        </View>
        <View style={styles.pickParamLine}>
          <Text>{strings('PICKING.NUMBER_PALLETS')}</Text>
          <NumericSelector
            isValid={isNumberOfPalletsValid(palletNumber)}
            onDecreaseQty={() => onPalletDecrease(palletNumber, setPalletNumber)}
            onIncreaseQty={() => onPalletIncrease(palletNumber, setPalletNumber)}
            onTextChange={(text: string) => onPalletTextChange(text, setPalletNumber)}
            minValue={PALLET_MIN}
            maxValue={PALLET_MAX}
            value={palletNumber}
          />
        </View>
      </View>
      <View style={styles.createButtonView}>
        <Button
          title={strings('GENERICS.CREATE')}
          disabled={disableCreateButton()}
          testId="createButton"
          onPress={() => onSubmit()}
        />
      </View>
    </SafeAreaView>
  );
};

const CreatePick = () => {
  const item = useTypedSelector(state => state.Picking.pickCreateItem);
  const {
    pickCreateFloorLocations: floorLocations,
    pickCreateReserveLocations: reserveLocations,
    selectedTab
  } = useTypedSelector(state => state.Picking);
  const getLocationsApi = useTypedSelector(state => state.async.getLocation);
  const createPickApi = useTypedSelector(state => state.async.createNewPick);
  const selectedSectionState = useState(floorLocations && floorLocations.length ? floorLocations[0].locationName : '');
  const palletNumberState = useState(1);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  return (
    <CreatePickScreen
      item={item}
      floorLocations={floorLocations}
      reserveLocations={reserveLocations}
      selectedSectionState={selectedSectionState}
      palletNumberState={palletNumberState}
      selectedTab={selectedTab}
      dispatch={dispatch}
      navigation={navigation}
      getLocationApi={getLocationsApi}
      createPickApi={createPickApi}
      useEffectHook={useEffect}
    />
  );
};

export default CreatePick;
