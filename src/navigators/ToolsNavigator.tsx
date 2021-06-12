import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View } from 'react-native';
import { strings } from '../locales';
import COLOR from '../themes/Color';

const Stack = createStackNavigator();

const renderTools = (): JSX.Element => {
  const tools = ['location management'];
  return (
    <View>
      <Text>TEMP</Text>
    </View>
  );
};

export const ToolsNavigatorStack = (): JSX.Element => {

  return (
    <Stack.Navigator
      headerMode="float"
      screenOptions={{
        headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
        headerTintColor: COLOR.WHITE

      }}
    >
      <Stack.Screen
        name="Tools"
        component={() => renderTools()}
        options={{
          headerTitle: strings('GENERICS.TOOLS')
        }}
      />
    </Stack.Navigator>
  );
};

export const ToolsNavigator = (): JSX.Element => {

  return (
    <ToolsNavigatorStack />
  );
};
