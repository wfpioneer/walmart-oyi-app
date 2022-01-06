import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../state/reducers/RootReducer';
import { HomeNavigator } from './HomeNavigator';
import COLOR from '../themes/Color';
import { strings } from '../locales';
import { ToolsNavigator } from './ToolsNavigator';
import { WorklistNavigator } from './WorklistNavigator';
import { ApprovalListNavigator } from './ApprovalListNavigator';
import { resetApprovals } from '../state/actions/Approvals';
import { AVAILABLE_TOOLS } from "../models/User";

const Tab = createBottomTabNavigator();

const isToolsEnabled = (userFeatures: string[]) => {
  const enabledTools =  AVAILABLE_TOOLS.filter(feature => userFeatures.includes(feature));
  console.log(enabledTools);
  return enabledTools.length > 0;
};

const TabNavigator = (): JSX.Element => {
  // TODO combine userFeatures from both fluffy and config service once it is implemented
  const userFeatures = useTypedSelector(state => state.User.features);
  const selectedAmount = useTypedSelector(state => state.Approvals.selectedItemQty);
  const dispatch = useDispatch();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === strings('HOME.HOME')) {
            return <MaterialIcons name="home" size={size} color={color} />;
          }
          if (route.name === strings('WORKLIST.WORKLIST')) {
            return <AntDesign name="profile" size={size} color={color} />;
          }
          if (route.name === strings('GENERICS.TOOLS')) {
            return <MaterialIcons name="apps" size={size} color={color} />;
          }
          if (route.name === strings('APPROVAL.APPROVALS')) {
            return <MaterialCommunityIcons name="clipboard-check" size={size} color={color} />;
          }

          // You can return any component that you like here!
          return <MaterialIcons name="help" size={size} color={color} />;
        },
        tabBarVisible: selectedAmount <= 0
      })}
      tabBarOptions={{
        activeTintColor: COLOR.MAIN_THEME_COLOR,
        inactiveTintColor: COLOR.GREY
      }}
    >
      <Tab.Screen name={strings('HOME.HOME')} component={HomeNavigator} />

      <Tab.Screen
        name={strings('WORKLIST.WORKLIST')}
        component={WorklistNavigator}
      />

      {isToolsEnabled(userFeatures)
        && (
        <Tab.Screen
          name={strings('GENERICS.TOOLS')}
          component={ToolsNavigator}
        />
        )}

      {userFeatures.includes('manager approval')
        && (
          <Tab.Screen
            name={strings('APPROVAL.APPROVALS')}
            component={ApprovalListNavigator}
            listeners={{
              blur: () => {
                dispatch(resetApprovals());
              }
            }}
          />
        )}
    </Tab.Navigator>
  );
};

export default TabNavigator;
