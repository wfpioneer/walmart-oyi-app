import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTypedSelector } from '../state/reducers/RootReducer';
import { HomeNavigator } from './HomeNavigator';
import COLOR from '../themes/Color';
import { strings } from '../locales';
import { WorklistNavigator } from './WorklistNavigator';
import { ApprovalListNavigator } from './ApprovalListNavigator';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const isManager = useTypedSelector(state => state.User.isManager);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === strings('HOME.HOME')) {
            return <MaterialIcons name="home" size={size} color={color} />;
          } if (route.name === strings('WORKLIST.WORKLIST')) {
            return <AntDesign name="profile" size={size} color={color} />;
          } if (route.name === strings('APPROVAL.APPROVAL_ITEMS')) {
            return <MaterialCommunityIcons name="clipboard-check" size={size} color={color} />;
          }

          // You can return any component that you like here!
          return <MaterialIcons name="help" size={size} color={color} />;
        }
      })}
      tabBarOptions={{
        activeTintColor: COLOR.MAIN_THEME_COLOR,
        inactiveTintColor: COLOR.GREY
      }}
    >
      { /* @ts-ignore */ }
      <Tab.Screen name={strings('HOME.HOME')} component={HomeNavigator} />

      { /* @ts-ignore */ }
      <Tab.Screen
        name={strings('WORKLIST.WORKLIST')}
        component={WorklistNavigator}
      />
      {isManager
        ? (
          <Tab.Screen
            name={strings('APPROVAL.APPROVAL_ITEMS')} // Needs translation
            component={ApprovalListNavigator}
          />
        ) : <></>}
    </Tab.Navigator>
  );
};

export default TabNavigator;
