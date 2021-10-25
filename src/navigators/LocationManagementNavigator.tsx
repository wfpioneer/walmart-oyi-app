import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Image, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { showLocationPopup } from '../state/actions/Location';
import { strings } from '../locales';
import COLOR from '../themes/Color';
import ZoneList from '../screens/Zone/ZoneList';
import AisleList from '../screens/Aisle/AisleList';
import SectionList from '../screens/Section/SectionList';
import LocationTabs from './LocationTabs/LocationTabNavigator';
import { trackEvent } from '../utils/AppCenterTool';
import styles from './LocationManagementNavigator.style';
import { useTypedSelector } from '../state/reducers/RootReducer';

const Stack = createStackNavigator();

interface NavigationStackProps {
  userFeatures: string[],
  dispatch: Dispatch<any>
}

export const LocationManagementNavigatorStack = (props: NavigationStackProps): JSX.Element => {
  const { userFeatures, dispatch } = props;

  const renderLocationKebabButton = (visible: boolean) => (visible ? (
    <TouchableOpacity onPress={() => {
      dispatch(showLocationPopup());
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
        headerTintColor: COLOR.WHITE
      }}
    >
      <Stack.Screen
        name="Zones"
        component={ZoneList}
        options={{
          headerTitle: strings('LOCATION.ZONES'),
          headerRight: () => renderLocationKebabButton(userFeatures.includes('manager approval'))
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
        name="LocationDetails"
        component={LocationTabs}
        options={{
          headerTitle: strings('LOCATION.LOCATION_DETAILS')
        }}
      />
    </Stack.Navigator>
  );
};

const LocationManagementNavigator = (): JSX.Element => {
  const dispatch = useDispatch();
  const userFeatures = useTypedSelector(state => state.User.features);
  return (
    <LocationManagementNavigatorStack
      dispatch={dispatch}
      userFeatures={userFeatures}
    />
  );
};

export default LocationManagementNavigator;
