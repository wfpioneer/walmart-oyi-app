import React, { Dispatch } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { ColorValue } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { useTypedSelector } from '../state/reducers/RootReducer';
import { HomeNavigator } from './HomeNavigator';
import COLOR from '../themes/Color';
import { strings } from '../locales';
import { ToolsNavigator } from './ToolsNavigator';
import { WorklistNavigator } from './WorklistNavigator';
import { WorklistHomeNavigator } from './WorklistHomeNavigator';
import { ApprovalListNavigator } from './ApprovalListNavigator';
import { resetApprovals } from '../state/actions/Approvals';
import User, { AVAILABLE_TOOLS, Configurations } from '../models/User';

const Tab = createBottomTabNavigator();

interface TabNavigatorProps {
  user: User;
  // eslint-disable-next-line react/no-unused-prop-types
  selectedAmount: number;
  dispatch: Dispatch<any>;
  palletWorklists: boolean;
  auditWorklists: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  isBottomTabEnabled: boolean;
}

const isToolsEnabled = (
  userFeatures: string[],
  configurations: Configurations
) => {
  if (
    configurations.locationManagement
    || configurations.palletManagement
    || configurations.settingsTool
  ) {
    return true;
  }
  const enabledTools = AVAILABLE_TOOLS.filter(feature => userFeatures.includes(feature));
  return enabledTools.length > 0;
};

export const tabBarOptions = (
  props: TabNavigatorProps,
  route: RouteProp<any, string>
) => ({
  tabBarIcon: ({
    color,
    size
  }: {
    color: ColorValue | number;
    size: number;
  }) => {
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
      return (
        <MaterialCommunityIcons
          name="clipboard-check"
          size={size}
          color={color}
        />
      );
    }

    // You can return any component that you like here!
    return <MaterialIcons name="help" size={size} color={color} />;
  },

  tabBarStyle:
    props.selectedAmount <= 0 && props.isBottomTabEnabled
      ? { display: 'flex' as const }
      : { display: 'none' as const },
  tabBarActiveTintColor: COLOR.MAIN_THEME_COLOR,
  tabBarInactiveTintColor: COLOR.GREY,
  headerShown: false
});

export const TabNavigatorStack = (props: TabNavigatorProps): React.JSX.Element => {
  const {
    user, dispatch, palletWorklists, auditWorklists
  } = props;
  return (
    <Tab.Navigator screenOptions={({ route }) => tabBarOptions(props, route)}>
      <Tab.Screen name={strings('HOME.HOME')} component={HomeNavigator} />
      <Tab.Screen
        name={strings('WORKLIST.WORKLIST')}
        component={
          palletWorklists || auditWorklists
            ? WorklistHomeNavigator
            : WorklistNavigator
        }
      />

      {isToolsEnabled(user.features, user.configs) && (
        <Tab.Screen
          name={strings('GENERICS.TOOLS')}
          component={ToolsNavigator}
        />
      )}

      {user.features.includes('manager approval') && (
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

const TabNavigator = (): React.JSX.Element => {
  const user = useTypedSelector(state => state.User);
  const selectedAmount = useTypedSelector(
    state => state.Approvals.selectedItemQty
  );
  const dispatch = useDispatch();
  const { palletWorklists, auditWorklists } = user.configs;
  const { isBottomTabEnabled } = useTypedSelector(state => state.Global);
  return (
    <TabNavigatorStack
      user={user}
      selectedAmount={selectedAmount}
      dispatch={dispatch}
      palletWorklists={palletWorklists}
      auditWorklists={auditWorklists}
      isBottomTabEnabled={isBottomTabEnabled}
    />
  );
};

export default TabNavigator;
