import React, { useState } from 'react';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';

import COLOR from '../themes/Color';
import ReviewItemDetails from '../screens/ReviewItemDetails/ReviewItemDetails';
import { useNavigation } from '@react-navigation/native';
import { strings } from '../locales';


const Stack = createStackNavigator();

const ReviewItemDetailsNavigator = () => {
  const [isManualScanEnabled, setManualScanEnabled] = useState(false);
  const navigation = useNavigation();

  return (
    <Stack.Navigator
      headerMode="float"
      screenOptions={{
        headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
        headerTintColor: COLOR.WHITE
      }}
    >
      <Stack.Screen
        name="ItemDetails"
        component={ReviewItemDetails}
        options={{
          headerTitle: strings('ITEM.TITLE'),
          headerTitleAlign: 'left',
          headerTitleStyle: {fontSize: 18},
          headerBackTitleVisible: false,
          headerLeft: (props) => (
            // Shouldn't need to do this, but not showing on its own for some reason
            // See https://reactnavigation.org/docs/nesting-navigators/#each-navigator-keeps-its-own-navigation-history
            <HeaderBackButton
              {...props}
              onPress={navigation.goBack}
            />
          )
        }}
      />
    </Stack.Navigator>
  )

}

export default ReviewItemDetailsNavigator;
