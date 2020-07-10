import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeNavigator } from "./HomeNavigator";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import COLOR from "../themes/Color";
import { strings } from "../locales";

const Tab = createBottomTabNavigator();

const TestScreenTwo = () => (
  <Text>
    Test Screen 2!
  </Text>
);

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Screen2') {
            iconName = 'help';
          }
          console.log(iconName);

          // You can return any component that you like here!
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: COLOR.MAIN_THEME_COLOR,
        inactiveTintColor: COLOR.GREY,
      }}
    >
      { /* @ts-ignore */ }
      <Tab.Screen name="Home" title={strings('HOME.HOME')} component={HomeNavigator} />
      <Tab.Screen name="Screen2" component={TestScreenTwo} />
    </Tab.Navigator>
  );
}

