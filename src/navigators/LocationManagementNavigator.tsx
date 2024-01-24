import React, { Dispatch } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import SelectLocationType from '../screens/SelectLocationType/SelectLocationType';
import AddPallet from '../screens/AddPallet/AddPallet';
import AddZone from '../screens/AddZone/AddZone';
import AddSection from '../screens/AddSection/AddSection';
import {
  hideLocationPopup,
  setIsToolBarNavigation,
  showLocationPopup
} from '../state/actions/Location';
import { strings } from '../locales';
import COLOR from '../themes/Color';
import ZoneList from '../screens/Zone/ZoneList';
import AisleList from '../screens/Aisle/AisleList';
import SectionList from '../screens/Section/SectionList';
import LocationTabs from './LocationTabs/LocationTabNavigator';
import { setBottomTab, setManualScan } from '../state/actions/Global';
import { openCamera } from '../utils/scannerUtils';
import { trackEvent } from '../utils/AppCenterTool';
import { useTypedSelector } from '../state/reducers/RootReducer';
import styles from './LocationManagementNavigator.style';
import { setPrintingLocationLabels } from '../state/actions/Print';
import { LocationName } from '../models/Location';
import { AsyncState } from '../models/AsyncState';
import AddItems from '../screens/AddItems/AddItems';
import User from '../models/User';

const Stack = createStackNavigator();
interface LocationManagementProps {
  isManualScanEnabled: boolean;
  user: User;
  locationPopupVisible: boolean;
  navigation: NavigationProp<any>;
  dispatch: Dispatch<any>;
  getSectionDetailsApi: AsyncState;
}

export const renderScanButton = (
  dispatch: Dispatch<any>,
  isManualScanEnabled: boolean
): React.JSX.Element => (
  <TouchableOpacity
    onPress={() => {
      dispatch(setManualScan(!isManualScanEnabled));
    }}
  >
    <View style={styles.scanButton}>
      <MaterialCommunityIcon
        name="barcode-scan"
        size={20}
        color={COLOR.WHITE}
      />
    </View>
  </TouchableOpacity>
);

export const renderCamButton = (): React.JSX.Element => (
  <TouchableOpacity
    onPress={() => {
      openCamera();
    }}
  >
    <View style={styles.leftButton}>
      <MaterialCommunityIcon name="camera" size={20} color={COLOR.WHITE} />
    </View>
  </TouchableOpacity>
);

export const resetLocManualScan = (
  isManualScanEnabled: boolean,
  dispatch: Dispatch<any>
): void => {
  if (isManualScanEnabled) {
    dispatch(setManualScan(false));
  }
};

export const hideLocBottomSheetPopup = (
  locationPopupVisible: boolean,
  dispatch: Dispatch<any>
): void => {
  if (locationPopupVisible) {
    dispatch(hideLocationPopup());
  }
};

export const aislesOptions = (
  props: LocationManagementProps,
  renderLocationKebabButton: (isVisible: boolean) => false | React.JSX.Element,
  locationManagementEdit: () => boolean
) => ({
  headerTitle: strings('LOCATION.AISLES'),
  headerRight: () => (
    <View style={styles.headerContainer}>
      {renderCamButton()}
      {renderScanButton(props.dispatch, props.isManualScanEnabled)}
      {renderLocationKebabButton(locationManagementEdit())}
    </View>
  )
});

export const sectionOptions = (
  props: LocationManagementProps,
  renderLocationKebabButton: (isVisible: boolean) => false | React.JSX.Element,
  locationManagementEdit: () => boolean,
  renderPrintQueueButton: (isVisible: boolean) => false | React.JSX.Element
) => ({
  headerTitle: strings('LOCATION.SECTIONS'),
  headerRight: () => (
    <View style={styles.headerContainer}>
      {renderCamButton()}
      {renderPrintQueueButton(locationManagementEdit())}
      {renderScanButton(props.dispatch, props.isManualScanEnabled)}
      {renderLocationKebabButton(locationManagementEdit())}
    </View>
  )
});

export const sectionDetailsOptions = (
  props: LocationManagementProps,
  renderLocationKebabButton: (isVisible: boolean) => false | React.JSX.Element,
  locationManagementEdit: () => boolean,
  renderPrintQueueButton: (isVisible: boolean) => false | React.JSX.Element,
  sectionExists: boolean
) => ({
  headerTitle: strings('LOCATION.LOCATION_DETAILS'),
  headerRight: () => (
    <View style={styles.headerContainer}>
      {renderCamButton()}
      {renderPrintQueueButton(locationManagementEdit())}
      {renderScanButton(props.dispatch, props.isManualScanEnabled)}
      {renderLocationKebabButton(locationManagementEdit() && sectionExists)}
    </View>
  )
});

export const addItemsOptions = (
  props: LocationManagementProps
) => ({
  headerTitle: strings('LOCATION.SCAN_ITEM'),
  headerRight: () => (
    <View style={styles.headerContainer}>
      {renderScanButton(props.dispatch, props.isManualScanEnabled)}
    </View>
  )
});

export const zonesOptions = (
  props: LocationManagementProps,
  renderLocationKebabButton: (isVisible: boolean) => false | React.JSX.Element,
  locationManagementEdit: () => boolean
) => ({
  headerTitle: strings('LOCATION.ZONES'),
  headerRight: () => (
    <View style={styles.headerContainer}>
      {renderCamButton()}
      {renderScanButton(props.dispatch, props.isManualScanEnabled)}
      {renderLocationKebabButton(
        props.user.features.includes('manager approval')
          && locationManagementEdit()
      )}
    </View>
  )
});

export const LocationManagementNavigatorStack = (
  props: LocationManagementProps
): React.JSX.Element => {
  const {
    isManualScanEnabled,
    user,
    locationPopupVisible,
    navigation,
    dispatch,
    getSectionDetailsApi
  } = props;
  const userFeatures = user.features;

  const locationManagementEdit = () => user.features.includes('location management edit')
    || user.configs.locationManagementEdit;

  // Disable Location Management Edit if the section details api 204's
  const sectionExists: boolean = getSectionDetailsApi.result && getSectionDetailsApi.result?.status !== 204;
  // TODO add "badge" to show signs currently in queue
  const renderPrintQueueButton = (isVisible: boolean) => isVisible && (
  <TouchableOpacity
    onPress={() => {
      trackEvent('print_queue_list_click');
      dispatch(setPrintingLocationLabels(LocationName.SECTION));
      navigation.navigate('PrintPriceSign', { screen: 'PrintQueue' });
      dispatch(setIsToolBarNavigation(false));
    }}
  >
    <View style={styles.rightButton}>
      <MaterialCommunityIcon name="printer" size={20} color={COLOR.WHITE} />
    </View>
  </TouchableOpacity>
  );

  const renderLocationKebabButton = (isVisible: boolean) => isVisible && (
  <TouchableOpacity
    onPress={() => {
      if (locationPopupVisible) {
        dispatch(hideLocationPopup());
      } else {
        dispatch(showLocationPopup());
      }
      trackEvent('location_menu_button_click');
    }}
  >
    <View style={styles.rightButton}>
      <Image
        style={styles.image}
        source={require('../assets/images/menu.png')}
      />
    </View>
  </TouchableOpacity>
  );

  const screensNeedListeners = [
    'Zones',
    'Aisles',
    'Sections',
    'SectionDetails'
  ];

  return (
    <Stack.Navigator
      screenOptions={{
        headerMode: 'float',
        headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
        headerTitleStyle: { fontSize: 18 },
        headerTintColor: COLOR.WHITE
      }}
      screenListeners={{
        focus: () => {
          dispatch(setIsToolBarNavigation(true));
        },
        blur: screen => {
          if (
            screen.target
            && screensNeedListeners.some(screenName => screen.target?.includes(screenName))
          ) {
            resetLocManualScan(isManualScanEnabled, dispatch);
          }
        },
        beforeRemove: screen => {
          if (
            screen.target
            && screensNeedListeners.some(screenName => screen.target?.includes(screenName))
          ) {
            resetLocManualScan(isManualScanEnabled, dispatch);
            hideLocBottomSheetPopup(locationPopupVisible, dispatch);
          }
        }
      }}
    >
      <Stack.Screen
        name="Zones"
        component={ZoneList}
        options={() => zonesOptions(props, renderLocationKebabButton, locationManagementEdit)}
      />
      <Stack.Screen
        name="Aisles"
        component={AisleList}
        options={() => aislesOptions(
          props,
          renderLocationKebabButton,
          locationManagementEdit
        )}
      />
      <Stack.Screen
        name="Sections"
        component={SectionList}
        options={() => sectionOptions(
          props,
          renderLocationKebabButton,
          locationManagementEdit,
          renderPrintQueueButton
        )}
      />
      <Stack.Screen
        name="SectionDetails"
        component={LocationTabs}
        options={() => sectionDetailsOptions(
          props,
          renderLocationKebabButton,
          locationManagementEdit,
          renderPrintQueueButton,
          sectionExists
        )}
      />
      <Stack.Screen
        name="EditLocation"
        component={SelectLocationType}
        options={{
          headerTitle: strings('LOCATION.EDIT_LOCATION'),
          headerTitleAlign: 'left',
          headerBackTitleVisible: false
        }}
        listeners={{
          focus: () => {
            dispatch(setBottomTab(false));
          },
          beforeRemove: () => {
            dispatch(setBottomTab(true));
          }
        }}
      />
      <Stack.Screen
        name="AddPallet"
        component={AddPallet}
        options={{
          headerTitle: strings('LOCATION.SCAN_PALLET')
        }}
      />
      <Stack.Screen
        name="AddZone"
        component={AddZone}
        options={{
          headerTitle: strings('LOCATION.ADD_ZONE')
        }}
        listeners={{
          focus: () => {
            dispatch(setBottomTab(false));
          },
          beforeRemove: () => {
            dispatch(setBottomTab(true));
          }
        }}
      />
      <Stack.Screen
        name="AddSection"
        component={AddSection}
        options={{
          headerTitle: strings('LOCATION.ADD_SECTIONS')
        }}
        listeners={{
          focus: () => {
            dispatch(setBottomTab(false));
          },
          beforeRemove: () => {
            dispatch(setBottomTab(true));
          }
        }}
      />
      <Stack.Screen
        name="AddItems"
        component={AddItems}
        options={() => addItemsOptions(
          props,
        )}
      />
    </Stack.Navigator>
  );
};

const LocationManagementNavigator = (): React.JSX.Element => {
  const getSectionDetailsApi = useTypedSelector(
    state => state.async.getSectionDetails
  );
  const { isManualScanEnabled } = useTypedSelector(state => state.Global);
  const user = useTypedSelector(state => state.User);
  const locationPopupVisible = useTypedSelector(
    state => state.Location.locationPopupVisible
  );
  const dispatch = useDispatch();
  const navigation = useNavigation();

  return (
    <LocationManagementNavigatorStack
      isManualScanEnabled={isManualScanEnabled}
      dispatch={dispatch}
      user={user}
      navigation={navigation}
      locationPopupVisible={locationPopupVisible}
      getSectionDetailsApi={getSectionDetailsApi}
    />
  );
};

export default LocationManagementNavigator;
