import { HeaderBackButton } from '@react-navigation/elements';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { Dispatch } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import SideMenu from 'react-native-side-menu-updated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { strings } from '../locales';
import { FilterMenu } from '../screens/Worklist/FilterMenu/FilterMenu';
import { setManualScan } from '../state/actions/Global';
import { toggleMenu } from '../state/actions/Worklist';
import { useTypedSelector } from '../state/reducers/RootReducer';
import COLOR from '../themes/Color';
import styles from './AuditWorklistNavigator.style';
import AuditWorklistTabs from './AuditWorklistTabNavigator/AuditWorklistTabNavigator';
import AuditItem from '../screens/Worklist/AuditItem/AuditItem';

const Stack = createStackNavigator();

interface AuditWorklistNavProps {
  auditWorklists: boolean;
  dispatch: Dispatch<any>;
  isManualScanEnabled: boolean;
  navigation: NavigationProp<any>;
  menuOpen: boolean;
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
    <View style={styles.leftButton}>
      <MaterialCommunityIcons
        name="barcode-scan"
        size={20}
        color={COLOR.WHITE}
      />
    </View>
  </TouchableOpacity>
);

const renderPrintButton = () => (
  <TouchableOpacity onPress={() => {}}>
    <View>
      <MaterialCommunityIcons name="printer" size={20} color={COLOR.WHITE} />
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
    menuOpen
  } = props;

  const navigateBack = () => {
    if (auditWorklists) {
      navigation.navigate(strings('WORKLIST.WORKLIST'));
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
                {renderPrintButton()}
                {renderScanButton(dispatch, isManualScanEnabled)}
              </View>
            )
          }}
        />
      </Stack.Navigator>
    </SideMenu>
  );
};

const AuditWorklistNavigator = (): JSX.Element => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isManualScanEnabled } = useTypedSelector(state => state.Global);
  const { auditWorklists } = useTypedSelector(state => state.User.configs);
  const { menuOpen } = useTypedSelector(state => state.Worklist);

  return (
    <AuditWorklistNavigatorStack
      auditWorklists={auditWorklists}
      dispatch={dispatch}
      navigation={navigation}
      isManualScanEnabled={isManualScanEnabled}
      menuOpen={menuOpen}
    />
  );
};

export default AuditWorklistNavigator;
