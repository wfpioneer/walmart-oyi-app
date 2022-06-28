import React, { Dispatch } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  Pressable,
  TouchableOpacity,
  View
} from 'react-native';
import { useDispatch } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import COLOR from '../themes/Color';
import { strings } from '../locales';
import MissingPalletWorklistTabs from './MissingPalletWorklistTabs/MissingPalletWorklistTabNavigator';
import { useTypedSelector } from '../state/reducers/RootReducer';
import ScanPallet from '../screens/ScanPallet/ScanPallet';
import { setManualScan } from '../state/actions/Global';
import styles from './MissingPalletWorklistNavigator.style';

const Stack = createStackNavigator();

export const renderScanButton = (
  dispatch: Dispatch<any>,
  isManualScanEnabled: boolean
): JSX.Element => (
  <TouchableOpacity
    onPress={() => {
      dispatch(setManualScan(!isManualScanEnabled));
    }}
    testID="manual-scan"
  >
    <View style={styles.leftButton}>
      <MaterialCommunityIcons
        name="barcode-scan"
        size={20}
        color={COLOR.WHITE}
      />
    </View>
  </TouchableOpacity>
);

interface MissingPalletWorklistNavigatorProps {
    isManualScanEnabled: boolean;
    dispatch: Dispatch<any>;
}

export const kebabMenuButton = () => (
  <Pressable onPress={() => {}} style={styles.leftButton}>
    <MaterialCommunityIcons
      name="dots-vertical"
      size={30}
      color={COLOR.WHITE}
    />
  </Pressable>
);

export const MissingPalletWorklistNavigatorStack = (props: MissingPalletWorklistNavigatorProps): JSX.Element => {
  const {
    dispatch,
    isManualScanEnabled
  } = props;
  // TODO: Need to add other screens related to Missing Pallet Navigator
  return (
    <Stack.Navigator
      headerMode="float"
      screenOptions={() => ({
        headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
        headerTintColor: COLOR.WHITE
      })}
    >
      <Stack.Screen
        name="MissingPalletWorklistTabs"
        component={MissingPalletWorklistTabs}
        options={{
          headerTitle: strings('WORKLIST.WORKLIST'),
          headerRight: () => (
            <View style={styles.headerContainer}>
              {renderScanButton(dispatch, isManualScanEnabled)}
            </View>
          )
        }}
      />
      <Stack.Screen
        name="ScanPallet"
        component={ScanPallet}
        options={{
          headerTitle: strings('WORKLIST.WORKLIST'),
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

const MissingPalletWorklistNavigator = (): JSX.Element => {
  const dispatch = useDispatch();
  const { isManualScanEnabled } = useTypedSelector(state => state.Global);
  return (
    <MissingPalletWorklistNavigatorStack
      dispatch={dispatch}
      isManualScanEnabled={isManualScanEnabled}
    />
  );
};

export default MissingPalletWorklistNavigator;
