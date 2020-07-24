import React from 'react';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import COLOR from '../themes/Color';
import { strings } from '../locales';
import { useNavigation } from '@react-navigation/native';
import LocationDetails from "../screens/LocationDetails/LocationDetails";

const Stack = createStackNavigator();

const LocationDetailsNavigator = () => {

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
        name="LocationDetailsScreen"
        component={LocationDetails}
        options={{
          headerTitle: strings('LOCATION.TITLE'),
          headerTitleAlign: 'left',
          headerTitleStyle: {fontSize: 18},
          headerBackTitleVisible: false,
          headerLeft: (props) => (
            // Cloned from PrintPriceSignNavigator
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

export default LocationDetailsNavigator;
