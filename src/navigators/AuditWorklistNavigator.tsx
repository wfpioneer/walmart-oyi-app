import { HeaderBackButton } from '@react-navigation/elements';
import {
  NavigationProp,
  useNavigation
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { Dispatch } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import SideMenu from 'react-native-side-menu-updated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import SelectLocationType from '../screens/SelectLocationType/SelectLocationType';
import { strings } from '../locales';
import { FilterMenu } from '../screens/Worklist/FilterMenu/FilterMenu';
import { setBottomTab, setCalcOpen, setManualScan } from '../state/actions/Global';
import { toggleMenu } from '../state/actions/Worklist';
import { useTypedSelector } from '../state/reducers/RootReducer';
import COLOR from '../themes/Color';
import styles from './AuditWorklistNavigator.style';
import AuditWorklistTabs from './AuditWorklistTabNavigator/AuditWorklistTabNavigator';
import AuditItem from '../screens/Worklist/AuditItem/AuditItem';
import { GET_ITEM_DETAILS } from '../state/actions/asyncAPI';

const Stack = createStackNavigator();

interface AuditWorklistNavProps {
  auditWorklists: boolean;
  dispatch: Dispatch<any>;
  isManualScanEnabled: boolean;
  navigation: NavigationProp<any>;
  menuOpen: boolean;
  isBottomTabEnabled: boolean;
  calcOpen: boolean;
}

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
    <View style={styles.headerRightIcon}>
      <MaterialCommunityIcons
        name="barcode-scan"
        size={20}
        color={COLOR.WHITE}
      />
    </View>
  </TouchableOpacity>
);

const renderPrintButton = (navigation: NavigationProp<any>) => (
  <TouchableOpacity onPress={() => { navigation.navigate('PrintPriceSign', { screen: 'PrintPriceSignScreen' }); }}>
    <View style={styles.headerRightIcon}>
      <MaterialCommunityIcons name="printer" size={20} color={COLOR.WHITE} />
    </View>
  </TouchableOpacity>
);

export const renderCalcButton = (
  dispatch: Dispatch<any>,
  calcOpen: boolean
): JSX.Element => (
  <TouchableOpacity
    onPress={() => {
      dispatch(setCalcOpen(!calcOpen));
    }}
    testID="calc-button"
  >
    <View style={styles.headerRightIcon}>
      <MaterialCommunityIcons name="calculator" size={20} color={COLOR.WHITE} />
    </View>
  </TouchableOpacity>
);

const onFilterMenuPress = (dispatch: Dispatch<any>, menuOpen: boolean) => {
  if (menuOpen) {
    dispatch(toggleMenu(false));
  } else {
    dispatch(toggleMenu(true));
  }
};

const renderFilterButton = (dispatch: Dispatch<any>, menuOpen: boolean) => (
  <TouchableOpacity onPress={() => onFilterMenuPress(dispatch, menuOpen)}>
    <View style={styles.filterButton}>
      <MaterialCommunityIcons
        name="filter-variant"
        size={30}
        color={COLOR.WHITE}
      />
    </View>
  </TouchableOpacity>
);

export const AuditWorklistNavigatorStack = (
  props: AuditWorklistNavProps
): JSX.Element => {
  const {
    auditWorklists,
    dispatch,
    isManualScanEnabled,
    navigation,
    menuOpen,
    isBottomTabEnabled,
    calcOpen
  } = props;

  const navigateBack = () => {
    if (auditWorklists) {
      navigation.navigate('WorklistHome');
    } else {
      navigation.goBack();
    }
  };
  return (
    <SideMenu
      menu={<FilterMenu />}
      menuPosition="right"
      isOpen={menuOpen}
      animationFunction={(prop, value) => Animated.spring(prop, {
        toValue: value,
        friction: 8,
        useNativeDriver: true
      })}
      onChange={isOpen => {
        if (!isOpen && menuOpen) {
          dispatch(toggleMenu(false));
        } else if (isOpen && !menuOpen) {
          dispatch(toggleMenu(true));
        }
      }}
    >
      <Stack.Navigator
        screenOptions={() => ({
          headerMode: 'float',
          headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
          headerTintColor: COLOR.WHITE
        })}
        initialRouteName="AuditWorklistTabs"
        screenListeners={{
          focus: screen => {
            if (screen.target && !screen.target.includes('AuditWorklistTabs') && isBottomTabEnabled) {
              dispatch(setBottomTab(false));
            } else if (screen.target && screen.target.includes('AuditWorklistTabs') && !isBottomTabEnabled) {
              dispatch(setBottomTab(true));
            }
          }
        }}
      >
        <Stack.Screen
          name="AuditWorklistTabs"
          component={AuditWorklistTabs}
          options={{
            headerTitle: strings('WORKLIST.AUDIT_WORKLIST'),
            headerLeft: hlProps => hlProps.canGoBack && (
            <HeaderBackButton
                  // eslint-disable-next-line react/jsx-props-no-spreading
              {...hlProps}
              onPress={navigateBack}
            />
            ),
            headerRight: () => (
              <View style={styles.headerContainer}>
                {renderFilterButton(dispatch, menuOpen)}
              </View>
            )
          }}
        />
        <Stack.Screen
          name="AuditItem"
          component={AuditItem}
          options={{
            headerTitle: strings('AUDITS.AUDIT_ITEM'),
            headerRight: () => (
              <View style={styles.headerContainer}>
                {renderCalcButton(dispatch, calcOpen)}
                {renderPrintButton(navigation)}
                {renderScanButton(dispatch, isManualScanEnabled)}
              </View>
            )
          }}
          listeners={{
            beforeRemove: () => {
              dispatch({ type: GET_ITEM_DETAILS.RESET });
            }
          }}
        />
        <Stack.Screen
          name="AddLocation"
          component={SelectLocationType}
          options={{
            headerTitle: strings('LOCATION.ADD_NEW_LOCATION'),
            headerTitleAlign: 'left',
            headerBackTitleVisible: false
          }}
        />
      </Stack.Navigator>
    </SideMenu>
  );
};

const AuditWorklistNavigator = (): JSX.Element => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isManualScanEnabled, isBottomTabEnabled, calcOpen } = useTypedSelector(state => state.Global);
  const { auditWorklists } = useTypedSelector(state => state.User.configs);
  const { menuOpen } = useTypedSelector(state => state.Worklist);

  return (
    <AuditWorklistNavigatorStack
      auditWorklists={auditWorklists}
      dispatch={dispatch}
      navigation={navigation}
      isManualScanEnabled={isManualScanEnabled}
      menuOpen={menuOpen}
      isBottomTabEnabled={isBottomTabEnabled}
      calcOpen={calcOpen}
    />
  );
};

export default AuditWorklistNavigator;
