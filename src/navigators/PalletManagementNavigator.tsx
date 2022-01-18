import React, { Dispatch } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import PalletManagement from '../screens/PalletManagement/PalletManagement';
import ManagePallet from '../screens/ManagePallet/ManagePallet';
import COLOR from '../themes/Color';
import { togglePalletPopup } from '../state/actions/PalletManagement';
import { trackEvent } from '../utils/AppCenterTool';
import { strings } from '../locales';
import { setManualScan } from '../state/actions/Global';
import { useTypedSelector } from '../state/reducers/RootReducer';
import styles from './PalletManagementNavigator.style';

interface PalletManageMentNavigatorProps {
  isManualScanEnabled: boolean;
  dispatch: Dispatch<any>;
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

const renderManagePalletKebabButton = (dispatch: Dispatch<any>) => (
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
);

export const PalletManagementNavigatorStack = (props: PalletManageMentNavigatorProps): JSX.Element => {
  const {isManualScanEnabled, dispatch } = props;
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
          headerTitle: strings('PALLET.PALLET_MANAGEMENT')
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
              {renderManagePalletKebabButton(dispatch)}
            </View>
          )
        }}
      />
    </Stack.Navigator>
  );
};

const PalletManagementNavigator = (): JSX.Element => {
  const isManualScanEnabled = useTypedSelector(state => state.Global.isManualScanEnabled);
  const dispatch = useDispatch();
  return (
    <PalletManagementNavigatorStack
      isManualScanEnabled={isManualScanEnabled}
      dispatch={dispatch}
    />
  );
};

export default PalletManagementNavigator;
