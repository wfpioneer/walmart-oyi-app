import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import PalletManagement from '../screens/PalletManagement/PalletManagement';
import COLOR from '../themes/Color';
import { togglePalletPopup } from '../state/actions/PalletManagement';
import styles from './PalletManagementNavigator.style';
import { trackEvent } from '../utils/AppCenterTool';
import ManagePallet from '../screens/ManagePallet/ManagePallet';
import { strings } from '../locales';

const Stack = createStackNavigator();

export const PalletManagementNavigatorStack = (): JSX.Element => {
  const dispatch = useDispatch();

  const renderPalletKebabButton = (isVisible: boolean) => (isVisible && (
    <TouchableOpacity onPress={() => {
      dispatch(togglePalletPopup());
      trackEvent('pallet_menu_button_click');
    }}
    >
      <View style={styles.rightButton}>
        <Image
          style={styles.image}
          source={require('../assets/images/menu.png')}
        />
      </View>
    </TouchableOpacity>
  ));

  return (
    <Stack.Navigator
      headerMode="float"
      screenOptions={{
        headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
        headerTintColor: COLOR.WHITE
      }}
    >
      <Stack.Screen
        name="PalletManagement"
        component={PalletManagement}
        options={{
          headerTitle: 'Pallet Management',
          headerRight: () => renderPalletKebabButton(true)
        }}
      />
      <Stack.Screen
        name="ManagePallet"
        component={ManagePallet}
        options={{
          headerTitle: strings('PALLET.MANAGE_PALLET'),
          headerRight: () => (
            <View style={styles.headerContainer}>
              {renderScanButton(dispatch, isManualScanEnabled)}
              {renderManagePalletKebabButton(managePalletMenu, dispatch)}
            </View>
          )
        }}
      />
    </Stack.Navigator>
  );
};

const PalletManagementNavigator = (): JSX.Element => (
  <PalletManagementNavigatorStack />
);

export default PalletManagementNavigator;
