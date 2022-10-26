import React, { Dispatch } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import PalletManagement from '../screens/PalletManagement/PalletManagement';
import ManagePallet from '../screens/ManagePallet/ManagePallet';
import COLOR from '../themes/Color';
import { showManagePalletMenu } from '../state/actions/PalletManagement';
import { trackEvent } from '../utils/AppCenterTool';
import { strings } from '../locales';
import { setManualScan } from '../state/actions/Global';
import { useTypedSelector } from '../state/reducers/RootReducer';
import styles from './PalletManagementNavigator.style';
import CombinePallets from '../screens/CombinePallets/CombinePallets';

interface PalletManagementNavigatorProps {
  isManualScanEnabled: boolean;
  managePalletMenu: boolean;
  dispatch: Dispatch<any>;
  createPallet: boolean;
}

const Stack = createStackNavigator();

export const renderScanButton = (
  dispatch: Dispatch<any>,
  isManualScanEnabled: boolean
): JSX.Element => (
  <TouchableOpacity
    onPress={() => {
      dispatch(setManualScan(!isManualScanEnabled));
    }}
  >
    <View style={styles.leftButton}>
      <MaterialCommunityIcon
        name="barcode-scan"
        size={20}
        color={COLOR.WHITE}
      />
    </View>
  </TouchableOpacity>
);

export const renderManagePalletKebabButton = (managePalletMenu: boolean, dispatch: Dispatch<any>) => (
  <TouchableOpacity onPress={() => {
    dispatch(showManagePalletMenu(!managePalletMenu));
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
);

export const PalletManagementNavigatorStack = (props: PalletManagementNavigatorProps): JSX.Element => {
  const {
    isManualScanEnabled, managePalletMenu, dispatch, createPallet
  } = props;
  return (
    <Stack.Navigator
      screenOptions={{
        headerMode: 'float',
        headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
        headerTintColor: COLOR.WHITE
      }}
    >
      <Stack.Screen
        name="PalletManagementHome"
        component={PalletManagement}
        options={{
          headerTitle: strings('PALLET.PALLET_MANAGEMENT'),
          headerRight: () => (
            <View style={styles.headerContainer}>
              {renderScanButton(dispatch, isManualScanEnabled)}
            </View>
          )
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
              {!createPallet && renderManagePalletKebabButton(managePalletMenu, dispatch)}
            </View>
          )
        }}
      />
      <Stack.Screen
        name="CombinePallets"
        component={CombinePallets}
        options={{
          headerTitle: strings('PALLET.COMBINE_PALLETS'),
          headerRight: () => (
            <View style={styles.headerContainer}>
              {renderScanButton(dispatch, isManualScanEnabled)}
            </View>
          )
        }}
      />
    </Stack.Navigator>
  );
};

const PalletManagementNavigator = (): JSX.Element => {
  const isManualScanEnabled = useTypedSelector(state => state.Global.isManualScanEnabled);
  const { managePalletMenu, createPallet } = useTypedSelector(state => state.PalletManagement);
  const dispatch = useDispatch();
  return (
    <PalletManagementNavigatorStack
      isManualScanEnabled={isManualScanEnabled}
      managePalletMenu={managePalletMenu}
      dispatch={dispatch}
      createPallet={createPallet}
    />
  );
};

export default PalletManagementNavigator;
