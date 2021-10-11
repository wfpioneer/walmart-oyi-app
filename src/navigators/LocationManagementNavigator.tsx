import React, { Dispatch } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { strings } from '../locales';
import COLOR from '../themes/Color';
import ZoneList from '../screens/Zone/ZoneList';
import AisleList from '../screens/Aisle/AisleList';
import SectionList from '../screens/Section/SectionList';
import LocationTabs from './LocationTabs/LocationTabNavigator';
import { setManualScan } from '../state/actions/Global';
import { useTypedSelector } from '../state/reducers/RootReducer';
import styles from './LocationManagementNavigator.style';
import { openCamera } from '../utils/scannerUtils';

const Stack = createStackNavigator();
interface LocationManagementProps {
  isManualScanEnabled: boolean;
  dispatch: Dispatch<any>;
}

const renderScanButton = (dispatch: Dispatch<any>, isManualScanEnabled: boolean) => (
  <TouchableOpacity onPress={() => { dispatch(setManualScan(!isManualScanEnabled)); }}>
    <View style={styles.scanButton}>
      <MaterialCommunityIcon name="barcode-scan" size={20} color={COLOR.WHITE} />
    </View>
  </TouchableOpacity>
);

const renderCamButton = () => (
  <TouchableOpacity onPress={() => { openCamera(); }}>
    <View style={styles.camButton}>
      <MaterialCommunityIcon name="camera" size={20} color={COLOR.WHITE} />
    </View>
  </TouchableOpacity>
);

export const LocationManagementNavigatorStack = (props: LocationManagementProps): JSX.Element => {
  const { isManualScanEnabled, dispatch } = props;

  return (
    <Stack.Navigator
      headerMode="float"
      screenOptions={{
        headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
        headerTintColor: COLOR.WHITE,
        headerRight: () => (
          <View style={styles.headerContainer}>
            {renderCamButton()}
            {renderScanButton(dispatch, isManualScanEnabled)}
          </View>
        )
      }}
    >
      <Stack.Screen
        name="Zones"
        component={ZoneList}
        options={{
          headerTitle: strings('LOCATION.ZONES')
        }}
      />
      <Stack.Screen
        name="Aisles"
        component={AisleList}
        options={{
          headerTitle: strings('LOCATION.AISLES')
        }}
      />
      <Stack.Screen
        name="Sections"
        component={SectionList}
        options={{
          headerTitle: strings('LOCATION.SECTIONS')
        }}
      />
      <Stack.Screen
        name="SectionDetails"
        component={LocationTabs}
        options={{
          headerTitle: strings('LOCATION.LOCATION_DETAILS') // TODO update translation names
        }}
      />
    </Stack.Navigator>
  );
};

const LocationManagementNavigator = (): JSX.Element => {
  const { isManualScanEnabled } = useTypedSelector(state => state.Global);
  const dispatch = useDispatch();

  return (
    <LocationManagementNavigatorStack
      isManualScanEnabled={isManualScanEnabled}
      dispatch={dispatch}
    />
  );
};

export default LocationManagementNavigator;
