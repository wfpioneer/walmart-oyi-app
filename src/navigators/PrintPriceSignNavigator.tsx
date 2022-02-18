import React from 'react';
import { HeaderBackButton, createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native';
import COLOR from '../themes/Color';
import { strings } from '../locales';
import PrintPriceSign from '../screens/PrintPriceSign/PrintPriceSign';
import PrintQueue from '../screens/PrintQueue/PrintQueue';
import { ChangePrinter } from '../screens/PrintPriceSign/ChangePrinter/ChangePrinter';
import PrinterList from '../screens/PrintPriceSign/PrinterList/PrinterList';
import styles from './PrintPriceSignNavigator.styles';
import { useTypedSelector } from '../state/reducers/RootReducer';

const Stack = createStackNavigator();

const PrintPriceSignNavigator = (): JSX.Element => {
  const navigation = useNavigation();
  const { printingLocationLabels, printingPalletLabel } = useTypedSelector(state => state.Print);

  const navigateBack = () => {
    navigation.goBack();
  };

  const getHeaderTitle = () => {
    let title;
    if (printingLocationLabels) {
      title = strings('PRINT.LOCATION_TITLE');
    } else if (printingPalletLabel) {
      title = strings('PRINT.PALLET_TITLE');
    } else {
      title = strings('PRINT.MAIN_TITLE');
    }
    return title;
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
          headerTitle: getHeaderTitle(),
          headerTitleAlign: 'left',
          headerTitleStyle: styles.headerTitle,
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
          headerTitleStyle: styles.headerTitle,
          headerRight: () => (
            <TouchableOpacity style={styles.changePrinterButton} onPress={() => navigation.navigate('ChangePrinter')}>
              <MaterialCommunityIcons name="plus" size={30} color={COLOR.WHITE} />
            </TouchableOpacity>
          )
        }}
      />
      <Stack.Screen
        name="ChangePrinter"
        component={ChangePrinter}
        options={{
          headerTitle: strings('PRINT.CHANGE_PRINTER'),
          headerTitleAlign: 'left',
          headerTitleStyle: styles.headerTitle
        }}
      />
      <Stack.Screen
        name="PrintQueue"
        component={PrintQueue}
        options={{
          headerTitle: strings('PRINT.QUEUE_TITLE'),
          headerTitleAlign: 'left',
          headerTitleStyle: styles.headerTitle,
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
