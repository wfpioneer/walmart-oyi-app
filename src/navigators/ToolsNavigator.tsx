import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { strings } from '../locales';
import Tools from '../screens/Tools/Tools';
import COLOR from '../themes/Color';
import LocationManagementNavigator from './LocationManagementNavigator';

const Stack = createStackNavigator();

export const ToolsNavigatorStack = (props: {
  navigation: NavigationProp<any>;
}): JSX.Element => {
  const { navigation } = props;
  const ToolScreenReset = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'ToolsHomeScreen'
        }
      ]
    });
  };
  return (
    <Stack.Navigator
      screenOptions={{
        headerMode: 'float',
        headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
        headerTintColor: COLOR.WHITE
      }}
    >
      <Stack.Screen
        name="ToolsHomeScreen"
        component={Tools}
        options={{
          headerTitle: strings('GENERICS.TOOLS')
        }}
      />
      <Stack.Screen
        name="LocationManagement"
        component={LocationManagementNavigator}
        options={{
          headerShown: false
        }}
        listeners={{
          blur: () => {
            ToolScreenReset();
          }
        }}
      />
    </Stack.Navigator>
  );
};
export const ToolsNavigator = (): JSX.Element => {
  const navigation = useNavigation();
  return <ToolsNavigatorStack navigation={navigation} />;
};
