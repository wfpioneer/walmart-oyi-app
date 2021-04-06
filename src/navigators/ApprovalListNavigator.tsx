import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ApprovalList from '../screens/ApprovalList/ApprovalList';
import COLOR from '../themes/Color';
import { strings } from '../locales';
import styles from './ApprovalListNavigator.style';
import { mockApprovals } from '../mockData/mockApprovalItem';

const Stack = createStackNavigator();
export const renderSelectAllButton = () => (
  <TouchableOpacity>
    <View style={styles.selectAllButton}>
      <Text style={styles.selectAllText}>{strings('APPROVAL.SELECT_ALL')}</Text>
    </View>
  </TouchableOpacity>
);
export const renderApprovalTitle = (approvalAmount: number) => (
  <View>
    <Text style={styles.headerTitle}>{strings('APPROVAL.APPROVE_ITEMS')}</Text>
    <Text style={styles.headerSubtitle}>
      {` ${approvalAmount} ${approvalAmount === 1 ? strings('WORKLIST.ITEM') : strings('WORKLIST.ITEMS')}`}
    </Text>
  </View>
);
export const ApprovalListNavigator = () => {
  const approvalAmount: number = mockApprovals.length ?? 0;

  return (
    <Stack.Navigator
      headerMode="float"
      screenOptions={{
        headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
        headerTintColor: COLOR.WHITE
      }}
    >
      <Stack.Screen
        name="Approval"
        component={ApprovalList}
        options={{
          headerTitle: () => renderApprovalTitle(approvalAmount),
          headerRight: () => renderSelectAllButton(),
          headerRightContainerStyle: styles.headerRightPadding
        }}
      />
    </Stack.Navigator>
  );
};
