import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
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
import PrintListTabs from './PrintListTabNavigator';

const Stack = createStackNavigator();

const PrintPriceSignNavigator = (): JSX.Element => {
  const navigation = useNavigation();
  const { printingLocationLabels, printingPalletLabel } = useTypedSelector(state => state.Print);
  const user = useTypedSelector(state => state.User);
  const isPrintUpdate = user.features.includes('printing update') || user.configs.printingUpdate;

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
      screenOptions={{
        headerMode: 'float',
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
          headerBackTitleVisible: false
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
        component={isPrintUpdate ? PrintListTabs : PrintQueue}
        options={{
          headerTitle: strings('PRINT.QUEUE_TITLE'),
          headerTitleAlign: 'left',
          headerTitleStyle: styles.headerTitle,
          headerBackTitleVisible: false
        }}
      />
    </Stack.Navigator>
  );
};

export default PrintPriceSignNavigator;
