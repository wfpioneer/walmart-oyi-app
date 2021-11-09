import React, { Dispatch } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SelectLocationType from '../screens/SelectLocationType/SelectLocationType';
import AddPallet from '../screens/AddPallet/AddPallet';
import { hideLocationPopup, showLocationPopup } from '../state/actions/Location';
import { strings } from '../locales';
import COLOR from '../themes/Color';
import ZoneList from '../screens/Zone/ZoneList';
import AisleList from '../screens/Aisle/AisleList';
import SectionList from '../screens/Section/SectionList';
import LocationTabs from './LocationTabs/LocationTabNavigator';
import { setManualScan } from '../state/actions/Global';
import { openCamera } from '../utils/scannerUtils';
import { trackEvent } from '../utils/AppCenterTool';
import { useTypedSelector } from '../state/reducers/RootReducer';
import styles from './LocationManagementNavigator.style';

const Stack = createStackNavigator();
interface LocationManagementProps {
  isManualScanEnabled: boolean;
  userFeatures: string[],
  locationPopupVisible: boolean,
  dispatch: Dispatch<any>;
}

export const renderScanButton = (dispatch: Dispatch<any>, isManualScanEnabled: boolean): JSX.Element => (
  <TouchableOpacity onPress={() => { dispatch(setManualScan(!isManualScanEnabled)); }}>
    <View style={styles.leftButton}>
      <MaterialCommunityIcon name="barcode-scan" size={20} color={COLOR.WHITE} />
    </View>
  </TouchableOpacity>
);

export const renderCamButton = (): JSX.Element => (
  <TouchableOpacity onPress={() => { openCamera(); }}>
    <View style={styles.leftButton}>
      <MaterialCommunityIcon name="camera" size={20} color={COLOR.WHITE} />
    </View>
  </TouchableOpacity>
);

export const resetLocManualScan = (isManualScanEnabled: boolean, dispatch: Dispatch<any>): void => {
  if (isManualScanEnabled) {
    dispatch(setManualScan(false));
  }
};

export const LocationManagementNavigatorStack = (props: LocationManagementProps): JSX.Element => {
  const {
    isManualScanEnabled, userFeatures, locationPopupVisible, dispatch
  } = props;

  const renderLocationKebabButton = (visible: boolean) => (visible ? (
    <TouchableOpacity onPress={() => {
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
  ) : null);

  return (
    <Stack.Navigator
      headerMode="float"
      screenOptions={{
        headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
        headerTitleStyle: { fontSize: 18 },
        headerTintColor: COLOR.WHITE
      }}
    >
      <Stack.Screen
        name="Zones"
        component={ZoneList}
        options={{
          headerTitle: strings('LOCATION.ZONES'),
          headerRight: () => (
            <View style={styles.headerContainer}>
              {renderCamButton()}
              {renderScanButton(dispatch, isManualScanEnabled)}
              {renderLocationKebabButton(
                userFeatures.includes('manager approval')
                && userFeatures.includes('location management edit')
              )}
            </View>
          )
        }}
        listeners={{
          blur: () => {
            resetLocManualScan(isManualScanEnabled, dispatch);
          }
        }}
      />
      <Stack.Screen
        name="Aisles"
        component={AisleList}
        options={{
          headerTitle: strings('LOCATION.AISLES'),
          headerRight: () => (
            <View style={styles.headerContainer}>
              {renderCamButton()}
              {renderScanButton(dispatch, isManualScanEnabled)}
              {renderLocationKebabButton(userFeatures.includes('location management edit'))}
            </View>
          )
        }}
        listeners={{
          blur: () => {
            resetLocManualScan(isManualScanEnabled, dispatch);
          },
          beforeRemove: () => {
            resetLocManualScan(isManualScanEnabled, dispatch);
          }
        }}
      />
      <Stack.Screen
        name="Sections"
        component={SectionList}
        options={{
          headerTitle: strings('LOCATION.SECTIONS'),
          headerRight: () => (
            <View style={styles.headerContainer}>
              {renderCamButton()}
              {renderScanButton(dispatch, isManualScanEnabled)}
              {renderLocationKebabButton(userFeatures.includes('location management edit'))}
            </View>
          )
        }}
        listeners={{
          blur: () => {
            resetLocManualScan(isManualScanEnabled, dispatch);
          },
          beforeRemove: () => {
            resetLocManualScan(isManualScanEnabled, dispatch);
          }
        }}
      />
      <Stack.Screen
        name="SectionDetails"
        component={LocationTabs}
        options={{
          headerTitle: strings('LOCATION.LOCATION_DETAILS'),
          headerRight: () => (
            <View style={styles.headerContainer}>
              {renderCamButton()}
              {renderScanButton(dispatch, isManualScanEnabled)}
              {renderLocationKebabButton(userFeatures.includes('location management edit'))}
            </View>
          )
        }}
        listeners={{
          blur: () => {
            resetLocManualScan(isManualScanEnabled, dispatch);
          },
          beforeRemove: () => {
            resetLocManualScan(isManualScanEnabled, dispatch);
          }
        }}
      />
      <Stack.Screen
        name="AddLocation"
        component={SelectLocationType}
        options={{
          headerTitle: strings('LOCATION.ADD_NEW_LOCATION'),
          headerTitleAlign: 'left',
          headerBackTitleVisible: false
        }}
      />
      <Stack.Screen
        name="AddPallet"
        component={AddPallet}
        options={{
          headerTitle: strings('LOCATION.SCAN_PALLET')
        }}
      />
    </Stack.Navigator>
  );
};

const LocationManagementNavigator = (): JSX.Element => {
  const { isManualScanEnabled } = useTypedSelector(state => state.Global);
  const userFeatures = useTypedSelector(state => state.User.features);
  const locationPopupVisible = useTypedSelector(state => state.Location.locationPopupVisible);
  const dispatch = useDispatch();

  return (
    <LocationManagementNavigatorStack
      isManualScanEnabled={isManualScanEnabled}
      dispatch={dispatch}
      userFeatures={userFeatures}
      locationPopupVisible={locationPopupVisible}
    />
  );
};

export default LocationManagementNavigator;
