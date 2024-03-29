import React, { Dispatch, useLayoutEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderBackButton, HeaderBackButtonProps } from '@react-navigation/elements';
import { Animated, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SideMenu from 'react-native-side-menu-updated';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import COLOR from '../themes/Color';
import { TodoWorklist } from '../screens/Worklist/TodoWorklist';
import { CompletedWorklist } from '../screens/Worklist/CompletedWorklist';
import styles from './WorklistNavigator.style';
import { toggleMenu } from '../state/actions/Worklist';
import { useTypedSelector } from '../state/reducers/RootReducer';
import { FilterMenu } from '../screens/Worklist/FilterMenu/FilterMenu';
import { strings } from '../locales';
import { getWorklist, getWorklistV1 } from '../state/actions/saga';
import { PendingWorklist } from '../screens/Worklist/PendingWorklist';
import { Configurations } from '../models/User';

interface worklistNavigatorProps{
  dispatch:Dispatch<any>,
  navigation:NavigationProp<any>
  menuOpen:boolean,
  userConfig: Configurations
}
const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

export const WorklistTabs = () => {
  const { configs } = useTypedSelector(state => state.User);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLOR.WHITE,
        tabBarIndicatorStyle: { backgroundColor: COLOR.WHITE },
        tabBarStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR }
      }}
    >
      <Tab.Screen name={strings('WORKLIST.TODO')} component={TodoWorklist} />
      { configs.inProgress && <Tab.Screen name={strings('WORKLIST.PENDING')} component={PendingWorklist} /> }
      <Tab.Screen
        name={strings('WORKLIST.COMPLETED')}
        component={CompletedWorklist}
      />
    </Tab.Navigator>
  );
};

export const onFilterMenuPress = (dispatch: Dispatch<any>, menuOpen: boolean) => {
  if (menuOpen) {
    dispatch(toggleMenu(false));
  } else {
    dispatch(toggleMenu(true));
  }
};

export const renderHeaderRight = (dispatch: Dispatch<any>, menuOpen: boolean):JSX.Element => (
  <View style={styles.headerRightView}>
    <TouchableOpacity testID="header-right" onPress={() => onFilterMenuPress(dispatch, menuOpen)}>
      <MaterialIcons name="filter-list" size={25} color={COLOR.WHITE} />
    </TouchableOpacity>
  </View>

);

export const WorklistNavigatorStack = (props:worklistNavigatorProps): JSX.Element => {
  const {
    dispatch, navigation, menuOpen, userConfig
  } = props;
  useLayoutEffect(
    () => navigation.addListener('focus', () => {
      if (userConfig.inProgress) {
        dispatch(getWorklistV1());
      } else {
        dispatch(getWorklist());
      }
    }),
    [navigation]
  );

  const navigateBack = () => {
    navigation.goBack();
  };

  const menu = <FilterMenu screenName="Item_Worklist" />;
  const worklistNavHeaderLeft = (prop: HeaderBackButtonProps) => (prop.canGoBack && (
  <HeaderBackButton
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...prop}
    onPress={navigateBack}
  />
  ));
  return (
    <SideMenu
      menu={menu}
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
        screenOptions={{
          headerMode: 'float',
          headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
          headerTintColor: COLOR.WHITE
        }}
      >
        <Stack.Screen
          name="ITEMWORKLIST"
          component={WorklistTabs}
          options={() => ({
            headerRight: () => renderHeaderRight(dispatch, menuOpen),
            headerTitle: strings('WORKLIST.ITEM_WORKLIST'),
            headerLeft: worklistNavHeaderLeft
          })}
        />
      </Stack.Navigator>
    </SideMenu>
  );
};
export const WorklistNavigator = ():JSX.Element => {
  const dispatch = useDispatch();
  const navigation: NavigationProp<any> = useNavigation();
  const { menuOpen } = useTypedSelector(state => state.Worklist);
  const { configs } = useTypedSelector(state => state.User);
  return (
    <WorklistNavigatorStack
      dispatch={dispatch}
      navigation={navigation}
      menuOpen={menuOpen}
      userConfig={configs}
    />
  );
};
