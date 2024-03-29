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
import {
  NavigationProp, RouteProp, useNavigation, useRoute
} from '@react-navigation/native';
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
import { setFloorLocations, setReserveLocations, setupScreen } from '../../state/actions/ItemDetailScreen';
import { AsyncState } from '../../models/AsyncState';
import { setPickCreateFloor, setPickCreateReserve } from '../../state/actions/Picking';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import {
  CREATE_NEW_PICK,
  CREATE_NEW_PICK_V1,
  GET_LOCATIONS_FOR_ITEM,
  GET_LOCATIONS_FOR_ITEM_V1
} from '../../state/actions/asyncAPI';
import { createNewPick, createNewPickV1 } from '../../state/actions/saga';
import { SNACKBAR_TIMEOUT } from '../../utils/global';
import { Configurations } from '../../models/User';

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
  getLocationV1Api: AsyncState;
  createPickApi: AsyncState;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  countryCode: string;
  userConfigs: Configurations;
  route: RouteProp<any, string>
}

export const getLocationsApiHook = (getLocationApi: AsyncState, dispatch: Dispatch<any>, isFocused: boolean) => {
  const { isWaiting, result, error } = getLocationApi;
  if (isFocused) {
    // API success
    if (!isWaiting && result) {
      dispatch(setPickCreateFloor(result.data.location.floor || []));
      dispatch(setPickCreateReserve(result.data.location.reserve || []));
      dispatch(hideActivityModal());
      dispatch({ type: GET_LOCATIONS_FOR_ITEM.RESET });
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
      dispatch({ type: GET_LOCATIONS_FOR_ITEM.RESET });
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

export const getLocationsV1ApiHook = (
  locationForItemsV1Api: AsyncState,
  dispatch: Dispatch<any>,
  isFocused: boolean,
) => {
  if (isFocused) {
    if (!locationForItemsV1Api.isWaiting && locationForItemsV1Api.result) {
      const response = locationForItemsV1Api.result.data;
      const { salesFloorLocation, reserveLocation } = response;
      dispatch(setPickCreateFloor(salesFloorLocation || []));
      dispatch(setPickCreateReserve(reserveLocation || []));
      dispatch({ type: GET_LOCATIONS_FOR_ITEM_V1.RESET });
      dispatch(hideActivityModal());
      Toast.show({
        type: 'success',
        text1: strings('PICKING.LOCATIONS_UPDATED'),
        visibilityTime: 4000,
        position: 'bottom'
      });
    }
    // API failure
    if (!locationForItemsV1Api.isWaiting && locationForItemsV1Api.error) {
      dispatch(hideActivityModal());
      dispatch({ type: GET_LOCATIONS_FOR_ITEM.RESET });
      Toast.show({
        type: 'error',
        text1: strings('PICKING.LOCATIONS_FAILED_UPDATE'),
        visibilityTime: 4000,
        position: 'bottom'
      });
    }
    // API waiting
    if (locationForItemsV1Api.isWaiting) {
      dispatch(showActivityModal());
    }
  }
};

export const createPickApiHook = (
  createPickApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  route: RouteProp<any, string>
) => {
  const { isWaiting, result, error } = createPickApi;
  if (navigation.isFocused()) {
    // API success
    if (!isWaiting && result) {
      dispatch(hideActivityModal());
      dispatch({ type: CREATE_NEW_PICK.RESET });
      dispatch({ type: CREATE_NEW_PICK_V1.RESET });
      if (route.params && route.params.source === 'OtherAction') {
        navigation.navigate('ReviewItemDetailsHome');
      } else {
        navigation.goBack();
      }
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
      dispatch({ type: CREATE_NEW_PICK_V1.RESET });
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
    null,
    -999,
    false,
    false
  ));
  dispatch(setFloorLocations(floorLocations));
  dispatch(setReserveLocations(reserveLocations));
  navigation.navigate('AddLocation');
};

export const CreatePickScreen = (props: CreatePickProps) => {
  const {
    item, floorLocations, reserveLocations, selectedSectionState, createPickApi,
    palletNumberState, dispatch, navigation, getLocationApi, getLocationV1Api,
    useEffectHook, selectedTab, countryCode, userConfigs, route
  } = props;

  const [selectedSection, setSelectedSection] = selectedSectionState;
  const [palletNumber, setPalletNumber] = palletNumberState;

  useEffectHook(
    () => getLocationsApiHook(getLocationApi, dispatch, navigation.isFocused()),
    [getLocationApi]
  );
  useEffectHook(
    () => getLocationsV1ApiHook(getLocationV1Api, dispatch, navigation.isFocused()),
    [getLocationV1Api]
  );
  useEffectHook(
    () => createPickApiHook(createPickApi, dispatch, navigation, route),
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
    } else if (typeof (numberOfPallets) !== 'number' || Number.isNaN(numberOfPallets)) {
      setNumberOfPallets(1);
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

  const onPalletEndEditing = (
    numberOfPallets: number,
    setNumberOfPallets: React.Dispatch<React.SetStateAction<number>>
  ) => {
    if (typeof (numberOfPallets) !== 'number' || Number.isNaN(numberOfPallets)) {
      setNumberOfPallets(1);
    }
  };

  const onPalletTextChange = (text: string, setNumberOfPallets: React.Dispatch<React.SetStateAction<number>>) => {
    const newQty = parseInt(text, 10);
    if (text === '' || (!Number.isNaN(newQty) && newQty >= PALLET_MIN && newQty <= PALLET_MAX)) {
      setNumberOfPallets(newQty);
    }
  };

  const isNumberOfPalletsValid = (numberOfPallets: number) => (
    numberOfPallets >= PALLET_MIN && numberOfPallets <= PALLET_MAX
  );

  const disableCreateButton = () => !selectedSection
    || !reserveLocations.length
    || !isNumberOfPalletsValid(palletNumber);

  const onSubmit = () => {
    const locationDetails = floorLocations?.find(loc => loc.locationName === selectedSection);
    if (userConfigs.inProgress) {
      dispatch(createNewPickV1({
        category: item.categoryNbr,
        itemDesc: item.itemName,
        itemNbr: item.itemNbr,
        quickPick: selectedTab === Tabs.QUICKPICK,
        salesFloorLocationName: selectedSection,
        upcNbr: item.upcNbr,
        moveToFront: selectedSection === MOVE_TO_FRONT,
        numberOfPallets: palletNumber,
        salesFloorLocationId: locationDetails?.sectionId
      }));
    } else {
      dispatch(createNewPick({
        category: item.categoryNbr,
        itemDesc: item.itemName,
        itemNbr: item.itemNbr,
        quickPick: selectedTab === Tabs.QUICKPICK,
        salesFloorLocationName: selectedSection,
        upcNbr: item.upcNbr,
        moveToFront: selectedSection === MOVE_TO_FRONT,
        numberOfPallets: palletNumber,
        salesFloorLocationId: locationDetails?.sectionId
      }));
    }
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
          countryCode={countryCode}
          showItemImage={false}
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
            onEndEditing={() => onPalletEndEditing(palletNumber, setPalletNumber)}
          />
        </View>
      </View>
      <View style={styles.createButtonView}>
        <Button
          title={strings('GENERICS.CREATE')}
          disabled={disableCreateButton()}
          testID="createButton"
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
  const getLocationsApi = useTypedSelector(state => state.async.getLocationsForItem);
  const getLocationsV1Api = useTypedSelector(state => state.async.getLocationsForItemV1);
  const { countryCode, configs } = useTypedSelector(state => state.User);
  const createPickApi = configs.inProgress ? useTypedSelector(state => state.async.createNewPickV1)
    : useTypedSelector(state => state.async.createNewPick);
  const selectedSectionState = useState(floorLocations && floorLocations.length ? floorLocations[0].locationName : '');
  const palletNumberState = useState(1);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
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
      getLocationV1Api={getLocationsV1Api}
      createPickApi={createPickApi}
      useEffectHook={useEffect}
      countryCode={countryCode}
      userConfigs={configs}
      route={route}
    />
  );
};

export default CreatePick;
