import React, { useEffect } from 'react';
import { HeaderBackButton, createStackNavigator } from '@react-navigation/stack';
import { Animated, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SideMenu from 'react-native-side-menu-updated';
import { useNavigation } from '@react-navigation/native';
import COLOR from '../themes/Color';
import { TodoWorklist } from '../screens/Worklist/TodoWorklist';
import { CompletedWorklist } from '../screens/Worklist/CompletedWorklist';
import styles from './WorklistNavigator.style';
import { toggleMenu } from '../state/actions/Worklist';
import { useTypedSelector } from '../state/reducers/RootReducer';
import { FilterMenu } from '../screens/Worklist/FilterMenu/FilterMenu';
import { strings } from '../locales';
import { getWorklist } from '../state/actions/saga';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const worklistTabs = () => (
  <Tab.Navigator
    tabBarOptions={{
      activeTintColor: COLOR.WHITE,
      style: { backgroundColor: COLOR.MAIN_THEME_COLOR },
      indicatorStyle: { backgroundColor: COLOR.WHITE }
    }}
  >
    <Tab.Screen
      name={strings('WORKLIST.TODO')}
      component={TodoWorklist}
    />
    <Tab.Screen
      name={strings('WORKLIST.COMPLETED')}
      component={CompletedWorklist}
    />
  </Tab.Navigator>
);

const onFilterMenuPress = (dispatch: any, menuOpen: boolean) => {
  if (menuOpen) {
    dispatch(toggleMenu(false));
  } else {
    dispatch(toggleMenu(true));
  }
};

const renderHeaderRight = (dispatch: any, menuOpen: boolean) => (
  <View style={styles.headerRightView}>
    <TouchableOpacity onPress={() => onFilterMenuPress(dispatch, menuOpen)}>
      <MaterialIcons name="filter-list" size={25} color={COLOR.WHITE} />
    </TouchableOpacity>
  </View>
);

export const WorklistNavigator = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { menuOpen } = useTypedSelector(state => state.Worklist);

  useEffect(() => navigation.addListener('focus', () => {
    dispatch(getWorklist());
  }), [navigation]);

  const navigateBack = () => {
    navigation.navigate(strings('WORKLIST.WORKLIST'));
  };

  const menu = (
    <FilterMenu />
  );
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
    >
      <Stack.Navigator
        headerMode="float"
        screenOptions={{
          headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
          headerTintColor: COLOR.WHITE
        }}
      >
        <Stack.Screen
          name="ITEMWORKLIST"
          component={worklistTabs}
          options={() => ({
            headerRight: () => renderHeaderRight(dispatch, menuOpen),
            headerTitle: strings('WORKLIST.WORKLIST'),
            headerLeft: props => (
              // Shouldn't need to do this, but not showing on its own for some reason
              <HeaderBackButton
                {...props}
                onPress={navigateBack}
              />
            )
          })}
        />
      </Stack.Navigator>
    </SideMenu>
  );
};
