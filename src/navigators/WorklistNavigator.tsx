import React, { Dispatch, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderBackButton } from '@react-navigation/elements';
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
import { getWorklist } from '../state/actions/saga';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const WorklistTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: COLOR.WHITE,
      tabBarIndicatorStyle: { backgroundColor: COLOR.WHITE },
      tabBarStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR }
    }}
  >
    <Tab.Screen name={strings('WORKLIST.TODO')} component={TodoWorklist} />
    <Tab.Screen
      name={strings('WORKLIST.COMPLETED')}
      component={CompletedWorklist}
    />
  </Tab.Navigator>
);

const onFilterMenuPress = (dispatch: Dispatch<any>, menuOpen: boolean) => {
  if (menuOpen) {
    dispatch(toggleMenu(false));
  } else {
    dispatch(toggleMenu(true));
  }
};

const renderHeaderRight = (dispatch: Dispatch<any>, menuOpen: boolean) => (
  <View style={styles.headerRightView}>
    <TouchableOpacity onPress={() => onFilterMenuPress(dispatch, menuOpen)}>
      <MaterialIcons name="filter-list" size={25} color={COLOR.WHITE} />
    </TouchableOpacity>
  </View>
);

export const WorklistNavigator = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigation: NavigationProp<any> = useNavigation();
  const { menuOpen } = useTypedSelector(state => state.Worklist);
  const user = useTypedSelector(state => state.User);
  const { palletWorklists } = user.configs;

  useEffect(
    () => navigation.addListener('focus', () => {
      dispatch(getWorklist());
    }),
    [navigation]
  );

  const navigateBack = () => {
    if (palletWorklists) {
      navigation.navigate(strings('WORKLIST.WORKLIST'));
    } else {
      navigation.goBack();
    }
  };

  const menu = <FilterMenu />;
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
            headerTitle: strings('WORKLIST.WORKLIST'),
            headerLeft: props => props.canGoBack && (
            <HeaderBackButton
                  // eslint-disable-next-line react/jsx-props-no-spreading
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
