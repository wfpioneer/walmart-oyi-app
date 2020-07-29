import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeNavigator } from "./HomeNavigator";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import COLOR from "../themes/Color";
import { strings } from "../locales";
import { WorklistNavigator } from "./WorklistNavigator";

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  // @ts-ignore
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          if (route.name === 'Home') {
            return <MaterialIcons name='home' size={size} color={color} />;
          } else if (route.name === 'Work List') {
            return <AntDesign name='profile' size={size} color={color} />;
          }

          // You can return any component that you like here!
          return <MaterialIcons name='help' size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: COLOR.MAIN_THEME_COLOR,
        inactiveTintColor: COLOR.GREY,
      }}
    >
      { /* @ts-ignore */ }
      <Tab.Screen name="Home" title={strings('HOME.HOME')} component={HomeNavigator} />

      { /* @ts-ignore */ }
      <Tab.Screen name="Work List" title={strings('WORKLIST.WORKLIST')} component={WorklistNavigator}  />
    </Tab.Navigator>
  );
}

