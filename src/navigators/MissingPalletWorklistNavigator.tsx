import React, { Dispatch } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, View } from 'react-native';
import { HeaderBackButton } from '@react-navigation/elements';
import { useDispatch } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CommonActions, NavigationProp, useNavigation } from '@react-navigation/native';
import COLOR from '../themes/Color';
import { strings } from '../locales';
import MissingPalletWorklistTabs from './MissingPalletWorklistTabs/MissingPalletWorklistTabNavigator';
import { useTypedSelector } from '../state/reducers/RootReducer';
import ScanPallet from '../screens/ScanPallet/ScanPallet';
import { ScanLocation } from '../screens/ScanLocation/ScanLocation';
import { setBottomTab, setManualScan } from '../state/actions/Global';
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
  palletWorklists: boolean;
  navigation: NavigationProp<any>;
  isBottomTabEnabled: boolean;
}

export const MissingPalletWorklistNavigatorStack = (
  props: MissingPalletWorklistNavigatorProps
): JSX.Element => {
  const {
    dispatch, isManualScanEnabled, palletWorklists, navigation, isBottomTabEnabled
  } = props;

  const navState = navigation.getState();
  const navigateBack = () => {
    if (palletWorklists) {
      navigation.navigate('WorklistHome');
    } else {
      navigation.goBack();
    }
  };

  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerMode: 'float',
        headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
        headerTintColor: COLOR.WHITE
      })}
      screenListeners={{
        transitionStart: () => {
          if (navState.routes[0].name !== 'WorklistHome') {
            navigation.dispatch(state => {
              const newRoute = state.routes.map(route => ({ name: route.name }));
              return CommonActions.reset({
                index: 1,
                routes: [{ name: 'WorklistHome' }, ...newRoute]
              });
            });
          }
        },
        focus: screen => {
          if (screen.target && !screen.target.includes('MissingPalletWorklistTabs') && isBottomTabEnabled) {
            dispatch(setBottomTab(false));
          } else if (screen.target && screen.target.includes('MissingPalletWorklistTabs') && !isBottomTabEnabled) {
            dispatch(setBottomTab(true));
          }
        }
      }}
    >
      <Stack.Screen
        name="MissingPalletWorklistTabs"
        component={MissingPalletWorklistTabs}
        options={{
          headerTitle: strings('WORKLIST.PALLET_WORKLIST'),
          headerLeft: hlProps => hlProps.canGoBack && (
            <HeaderBackButton
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...hlProps}
              onPress={navigateBack}
            />
          )
        }}
      />
      <Stack.Screen
        name="ScanPallet"
        component={ScanPallet}
        options={{
          headerTitle: strings('WORKLIST.SCAN_PALLET'),
          headerRight: () => (
            <View style={styles.headerContainer}>
              {renderScanButton(dispatch, isManualScanEnabled)}
            </View>
          )
        }}
      />
      <Stack.Screen
        name="ScanLocation"
        component={ScanLocation}
        options={{
          headerTitle: strings('LOCATION.SCAN_LOCATION_HEADER'),
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
  const { isManualScanEnabled, isBottomTabEnabled } = useTypedSelector(state => state.Global);
  const { palletWorklists } = useTypedSelector(state => state.User.configs);
  const navigation = useNavigation();
  return (
    <MissingPalletWorklistNavigatorStack
      dispatch={dispatch}
      isManualScanEnabled={isManualScanEnabled}
      palletWorklists={palletWorklists}
      navigation={navigation}
      isBottomTabEnabled={isBottomTabEnabled}
    />
  );
};

export default MissingPalletWorklistNavigator;
