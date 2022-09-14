import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';
import CompletedAuditWorklist from '../../screens/Worklist/AuditWorklist/CompletedAuditWorklist';
import TodoAuditWorklist from '../../screens/Worklist/AuditWorklist/TodoAuditWorklist';

const Tab = createMaterialTopTabNavigator();
export const AuditWorklistTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: COLOR.WHITE,
      tabBarIndicatorStyle: { backgroundColor: COLOR.WHITE },
      tabBarStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR }
    }}
  >
    <Tab.Screen name={strings('WORKLIST.TODO')} component={TodoAuditWorklist} />
    <Tab.Screen name={strings('WORKLIST.COMPLETED')} component={CompletedAuditWorklist} />
  </Tab.Navigator>
);
const AuditWorklistTabs = () => <AuditWorklistTabNavigator />;

export default AuditWorklistTabs;
