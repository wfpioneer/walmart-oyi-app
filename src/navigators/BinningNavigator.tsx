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

const Stack = createStackNavigator();

interface BinningNavigatorProps {
  isManualScanEnabled: boolean;
  dispatch: Dispatch<any>;
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

export const resetManualScan = (
  isManualScanEnabled: boolean,
  dispatch: Dispatch<any>
): void => {
  if (isManualScanEnabled) {
    dispatch(setManualScan(false));
    dispatch(resetScannedEvent());
  }
};

export const BinningNavigatorStack = (props: BinningNavigatorProps): JSX.Element => {
  const {
    isManualScanEnabled, dispatch
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
        options={{
          headerTitle: strings('BINNING.ASSIGN_LOCATION'),
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
  const dispatch = useDispatch();
  return (
    <BinningNavigatorStack
      isManualScanEnabled={isManualScanEnabled}
      dispatch={dispatch}
    />
  );
};

export default BinningNavigator;
