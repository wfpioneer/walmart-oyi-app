import React from 'react';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import COLOR from '../themes/Color';
import { strings } from '../locales';
import { useNavigation } from '@react-navigation/native';
import PrintPriceSign from '../screens/PrintPriceSign/PrintPriceSign';

export type PrintPriceSignStackParamList = {
  PrintPriceSign: {
    image?: any;
    itemName: string;
    itemNbr: number;
    upcNbr: string;
    category: string;
  }
}

const Stack = createStackNavigator<PrintPriceSignStackParamList>();

const PrintPriceSignNavigator = () => {

  const navigation = useNavigation();


  const navigateBack = () =>{
    navigation.goBack();
  }

  return (
    <Stack.Navigator
      headerMode="float"
      screenOptions={{
        headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
        headerTintColor: COLOR.WHITE
      }}
    >
      <Stack.Screen
        name="PrintPriceSign"
        component={PrintPriceSign}
        options={{
          headerTitle: strings('PRINT.TITLE'),
          headerTitleAlign: 'left',
          headerTitleStyle: {fontSize: 18},
          headerBackTitleVisible: false,
          headerLeft: (props) => (
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
  )
}

export default PrintPriceSignNavigator;
