import React from 'react';
import { HeaderBackButton, createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import COLOR from '../themes/Color';
import { strings } from '../locales';
import PrintPriceSign from '../screens/PrintPriceSign/PrintPriceSign';
import PrintQueue from '../screens/PrintQueue/PrintQueue';
import { ChangePrinter } from '../screens/PrintPriceSign/ChangePrinter/ChangePrinter';
import { PrinterList } from '../screens/PrintPriceSign/PrinterList/PrinterList';

const Stack = createStackNavigator();

const PrintPriceSignNavigator = () => {
  const navigation = useNavigation();


  const navigateBack = () => {
    navigation.goBack();
  };

  return (
    <Stack.Navigator
      headerMode="float"
      screenOptions={{
        headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
        headerTintColor: COLOR.WHITE
      }}
    >
      <Stack.Screen
        name="PrintPriceSignScreen"
        component={PrintPriceSign}
        options={{
          headerTitle: strings('PRINT.MAIN_TITLE'),
          headerTitleAlign: 'left',
          headerTitleStyle: { fontSize: 18 },
          headerBackTitleVisible: false,
          headerLeft: props => (
            // Shouldn't need to do this, but not showing on its own for some reason
            // See https://reactnavigation.org/docs/nesting-navigators/#each-navigator-keeps-its-own-navigation-history
            <HeaderBackButton
              {...props}
              onPress={navigateBack}
            />
          )
        }}
      />
      <Stack.Screen
        name="PrinterList"
        component={PrinterList}
        options={{
          headerTitle: strings('PRINT.PRINTER_LIST'),
          headerTitleAlign: 'left',
          headerTitleStyle: { fontSize: 18 }
        }}
      />
      <Stack.Screen
        name="ChangePrinter"
        component={ChangePrinter}
        options={{
          headerTitle: strings('PRINT.CHANGE_PRINTER'),
          headerTitleAlign: 'left',
          headerTitleStyle: { fontSize: 18 }
        }}
      />
      <Stack.Screen
        name="PrintQueue"
        component={PrintQueue}
        options={{
          headerTitle: strings('PRINT.QUEUE_TITLE'),
          headerTitleAlign: 'left',
          headerTitleStyle: { fontSize: 18 },
          headerBackTitleVisible: false,
          headerLeft: props => (
            // Shouldn't need to do this, but not showing on its own for some reason
            // See https://reactnavigation.org/docs/nesting-navigators/#each-navigator-keeps-its-own-navigation-history
            <HeaderBackButton
              {...props}
              onPress={navigateBack}
            />
          )
        }}
      />
    </Stack.Navigator>
  );
};

export default PrintPriceSignNavigator;
