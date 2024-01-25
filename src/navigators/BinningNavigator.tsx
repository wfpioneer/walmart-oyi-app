import React, { Dispatch } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';
import Binning from '../screens/Binning/Binning';
import AssignLocation from '../screens/AssignLocation/AssignLocation';
import COLOR from '../themes/Color';
import { strings } from '../locales';
import { resetScannedEvent, setManualScan } from '../state/actions/Global';
import { useTypedSelector } from '../state/reducers/RootReducer';
import styles from './BinningNavigator.style';
import ManagePallet from '../screens/ManagePallet/ManagePallet';
import CombinePallets from '../screens/CombinePallets/CombinePallets';
import { renderManagePalletKebabButton } from './PalletManagementNavigator';

const Stack = createStackNavigator();

interface BinningNavigatorProps {
  isManualScanEnabled: boolean;
  dispatch: Dispatch<any>;
  managePalletMenu: boolean;
}

export const renderScanButton = (
  dispatch: Dispatch<any>,
  isManualScanEnabled: boolean,
  isRightMost: boolean
): React.JSX.Element => (
  <TouchableOpacity
    onPress={() => dispatch(setManualScan(!isManualScanEnabled))}
    testID="scanButton"
  >
    <View style={isRightMost ? styles.rightButton : styles.leftButton}>
      <MaterialCommunityIcon
        name="barcode-scan"
        size={20}
        color={COLOR.WHITE}
      />
    </View>
  </TouchableOpacity>
);

export const resetManualScan = (
  isManualScanEnabled: boolean,
  dispatch: Dispatch<any>
): void => {
  if (isManualScanEnabled) {
    dispatch(setManualScan(false));
    dispatch(resetScannedEvent());
  }
};

export const getScreenOptions = (
  screenName: string,
  title: string,
  dispatch: Dispatch<any>,
  isManualScanEnabled: boolean,
  managePalletMenu: boolean,
  isRightMost = true
) => ({
  headerTitle: title,
  headerRight: () => (
    <View style={styles.headerContainer}>
      {renderScanButton(dispatch, isManualScanEnabled, isRightMost)}
      {screenName === 'ManagePallet'
        && renderManagePalletKebabButton(managePalletMenu, dispatch)}
    </View>
  )
});

export const BinningNavigatorStack = (
  props: BinningNavigatorProps
): React.JSX.Element => {
  const { isManualScanEnabled, dispatch, managePalletMenu } = props;
  return (
    <Stack.Navigator
      screenOptions={{
        headerMode: 'float',
        headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
        headerTintColor: COLOR.WHITE
      }}
    >
      <Stack.Screen
        name="BinningHome"
        component={Binning}
        options={getScreenOptions(
          'BinningHome',
          strings('BINNING.BINNING'),
          dispatch,
          isManualScanEnabled,
          managePalletMenu
        )}
        listeners={{
          blur: () => {
            resetManualScan(isManualScanEnabled, dispatch);
          },
          beforeRemove: () => {
            resetManualScan(isManualScanEnabled, dispatch);
          }
        }}
      />
      <Stack.Screen
        name="AssignLocation"
        component={AssignLocation}
        options={getScreenOptions(
          'AssignLocation',
          strings('BINNING.ASSIGN_LOCATION'),
          dispatch,
          isManualScanEnabled,
          managePalletMenu
        )}
      />
      <Stack.Screen
        name="ManagePallet"
        component={ManagePallet}
        options={getScreenOptions(
          'ManagePallet',
          strings('PALLET.MANAGE_PALLET'),
          dispatch,
          isManualScanEnabled,
          managePalletMenu
        )}
      />
      <Stack.Screen
        name="CombinePallets"
        component={CombinePallets}
        options={getScreenOptions(
          'CombinePallets',
          strings('PALLET.COMBINE_PALLETS'),
          dispatch,
          isManualScanEnabled,
          managePalletMenu
        )}
      />
    </Stack.Navigator>
  );
};

const BinningNavigator = (): React.JSX.Element => {
  const isManualScanEnabled = useTypedSelector(
    state => state.Global.isManualScanEnabled
  );
  const managePalletMenu = useTypedSelector(
    state => state.PalletManagement.managePalletMenu
  );
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
