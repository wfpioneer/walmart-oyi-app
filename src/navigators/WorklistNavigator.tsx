import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import COLOR from "../themes/Color";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TodoWorklist } from "../screens/Worklist/TodoWorklist";
import { CompletedWorklist } from "../screens/Worklist/CompletedWorklist";
import styles from './WorklistNavigator.style';
import { showMenu, hideMenu } from "../state/actions/WorklistFilter";
import {useTypedSelector} from "../state/reducers/RootReducer";

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const worklistTabs = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: COLOR.WHITE,
        style: { backgroundColor: COLOR.MAIN_THEME_COLOR },
        indicatorStyle: { backgroundColor: COLOR.WHITE }
      }}
    >
      <Tab.Screen
        name="Todo"
        component={TodoWorklist}
      />
      <Tab.Screen
        name="Completed"
        component={CompletedWorklist}
      />
    </Tab.Navigator>
  );
}

const onFilterMenuPress = (dispatch: any, menuOpen: boolean) => {
  if (menuOpen) {
    dispatch(hideMenu());
  } else {
    dispatch(showMenu());
  }
};

const renderHeaderRight = (dispatch: any, menuOpen: boolean) => {
  return (
    <View style={styles.headerRightView}>
      <TouchableOpacity onPress={() => onFilterMenuPress(dispatch, menuOpen)}>
        <MaterialIcons name='filter-list' size={ 25 } color={COLOR.WHITE} />
      </TouchableOpacity>
    </View>
  )
}

export const WorklistNavigator  = () => {
  const dispatch = useDispatch();
  const { menuOpen } = useTypedSelector(state => state.WorklistFilter);
  return (
    <Stack.Navigator
      headerMode="float"
      screenOptions={ {
          headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
          headerTintColor: COLOR.WHITE
      } }
    >
      <Stack.Screen
        name="Work List"
        component={worklistTabs}
        options={() => ({
          headerRight: () => renderHeaderRight(dispatch, menuOpen)
        })}
      />
    </Stack.Navigator>
  )
}
