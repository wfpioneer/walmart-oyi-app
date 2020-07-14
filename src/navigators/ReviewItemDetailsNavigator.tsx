import React, { useState } from 'react';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';

import COLOR from '../themes/Color';
import Home from '../screens/Home/Home';
import ItemDetails from '../models/ItemDetails';
import ReviewItemDetails from '../screens/ReviewItemDetails/ReviewItemDetails';
import { useNavigation } from '@react-navigation/native';


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
          headerTitle: 'Review item details',
          headerTitleAlign: 'left',
          headerTitleStyle: {fontSize: 18},
          headerBackTitleVisible: false,
          headerLeft: (props) => (
            <HeaderBackButton //Shouldn't need to do this, but not showing on its own for some reason
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
