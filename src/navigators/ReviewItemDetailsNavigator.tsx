import React, { useState } from 'react';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';

import COLOR from '../themes/Color';
import ReviewItemDetails from '../screens/ReviewItemDetails/ReviewItemDetails';
import { useNavigation } from '@react-navigation/native';
import { strings } from '../locales';
import { Image, TouchableOpacity, View } from 'react-native';
import { setManualScan } from '../state/actions/Global';
import { useTypedSelector } from '../state/reducers/RootReducer';
import { useDispatch } from 'react-redux';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './ReviewItemDetailsNavigator.style';

const Stack = createStackNavigator();

const ReviewItemDetailsNavigator = () => {
  const { isManualScanEnabled } = useTypedSelector(state => state.Global);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const renderScanButton = () => {
    return (
      <TouchableOpacity onPress={() => {dispatch(setManualScan(!isManualScanEnabled))}}>
        <View style={styles.leftButton}>
          <MaterialCommunityIcon name={'barcode-scan'} size={20} color={COLOR.WHITE} />
        </View>
      </TouchableOpacity>
    );
  }

  // TODO add "badge" to show signs currently in queue
  const renderPrintQueueButton = () => (
    <TouchableOpacity onPress={() => console.log('Print queue button pressed')}>
      <View style={styles.rightButton}>
        <MaterialCommunityIcon
          name={'printer'}
          size={20}
          color={COLOR.WHITE}
          onPress={() => navigation.navigate('PrintPriceSign', {screen: 'PrintQueue'})}
        />
      </View>
    </TouchableOpacity>
  );

  const navigateBack = () =>{
    dispatch(setManualScan(false));
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
        name="ReviewItemDetails"
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
              onPress={navigateBack}
            />
          ),
          headerRight: () => (
            <View style={styles.headerContainer}>
              {renderScanButton()}
              {renderPrintQueueButton()}
            </View>)
        }}
      />
    </Stack.Navigator>
  )

}

export default ReviewItemDetailsNavigator;
