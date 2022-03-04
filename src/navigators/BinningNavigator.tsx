import React, { Dispatch } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';
import Binning from '../screens/Binning/Binning';
import COLOR from '../themes/Color';
import { strings } from '../locales';
import { setManualScan } from '../state/actions/Global';
import { useTypedSelector } from '../state/reducers/RootReducer';
import styles from './BinningNavigator.style';
import ManagePallet from "../screens/ManagePallet/ManagePallet";
import CombinePallets from "../screens/CombinePallets/CombinePallets";
import { renderManagePalletKebabButton } from './PalletManagementNavigator';

const Stack = createStackNavigator();

interface BinningNavigatorProps {
  isManualScanEnabled: boolean;
  dispatch: Dispatch<any>;
  managePalletMenu: boolean;
}

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

export const BinningNavigatorStack = (props: BinningNavigatorProps): JSX.Element => {
  const {
    isManualScanEnabled, dispatch, managePalletMenu
  } = props;
  return (
    <Stack.Navigator
      headerMode="float"
      screenOptions={{
        headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
        headerTintColor: COLOR.WHITE
      }}
    >
      <Stack.Screen
        name="Binning"
        component={Binning}
        options={{
          headerTitle: strings('BINNING.BINNING'),
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
              {renderManagePalletKebabButton(managePalletMenu, dispatch)}
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

const BinningNavigator = (): JSX.Element => {
  const isManualScanEnabled = useTypedSelector(state => state.Global.isManualScanEnabled);
  const managePalletMenu = useTypedSelector(state => state.PalletManagement.managePalletMenu);
  const dispatch = useDispatch();
  return (
    <BinningNavigatorStack
      isManualScanEnabled={isManualScanEnabled}
      dispatch={dispatch}
      managePalletMenu={managePalletMenu}
    />
  );
};

export default BinningNavigator;
