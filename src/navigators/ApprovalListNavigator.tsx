import React, { Dispatch } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ApprovalList from '../screens/ApprovalList/ApprovalList';
import COLOR from '../themes/Color';
import { strings } from '../locales';
import styles from './ApprovalListNavigator.style';
import { toggleAllItems } from '../state/actions/Approvals';
import { useTypedSelector } from '../state/reducers/RootReducer';
import { ApprovalSummary } from '../screens/ApprovalSummary/ApprovalSummary';

const Stack = createStackNavigator();

export const renderSelectAllButton = (dispatch: Dispatch<any>, selectAll: boolean): JSX.Element => (
  <TouchableOpacity onPress={() => dispatch(toggleAllItems(!selectAll))}>
    <View style={styles.selectAllButton}>
      {selectAll ? <Text style={styles.selectAllText}>{strings('APPROVAL.DESELECT_ALL')}</Text>
        : <Text style={styles.selectAllText}>{strings('APPROVAL.SELECT_ALL')}</Text>}
    </View>
  </TouchableOpacity>
);

export const renderApprovalTitle = (approvalAmount: number): JSX.Element => (
  <View>
    <Text style={styles.headerTitle}>{strings('APPROVAL.APPROVE_ITEMS')}</Text>
    <Text style={styles.headerSubtitle}>
      {`${approvalAmount} ${approvalAmount === 1 ? strings('GENERICS.ITEM') : strings('GENERICS.ITEMS')}`}
    </Text>
  </View>
);

export const renderSelectedItemQty = (itemQty: number): JSX.Element => (
  <Text style={styles.headerTitle}>{`${itemQty} ${strings('APPROVAL.SELECTED')}`}</Text>
);

export const renderCloseButton = (dispatch: Dispatch<any>): JSX.Element => (
  <TouchableOpacity
    onPress={() => dispatch(toggleAllItems(false))}
  >
    <MaterialIcons name="close" size={22} color={COLOR.WHITE} />
  </TouchableOpacity>
);
interface ApprovalNavigatorProps {
  result: any;
  dispatch: Dispatch<any>;
  selectAll: boolean;
  selectedItemQty: number;
}
export const ApprovalListNavigatorStack = (props: ApprovalNavigatorProps): JSX.Element => {
  const {
    result, dispatch, selectAll, selectedItemQty
  } = props;

  const approvalAmount: number = (result && result.data.length) || 0;

  return (
    <Stack.Navigator
      screenOptions={{
        headerMode: 'float',
        headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
        headerTintColor: COLOR.WHITE

      }}
    >
      <Stack.Screen
        name="Approval"
        component={ApprovalList}
        options={{
          headerTitle: selectedItemQty === 0 ? () => renderApprovalTitle(approvalAmount)
            : () => renderSelectedItemQty(selectedItemQty),
          headerRight: () => renderSelectAllButton(dispatch, selectAll),
          headerRightContainerStyle: styles.headerRightPadding,
          headerLeftContainerStyle: styles.headerLeftPadding,
          headerLeft: (selectedItemQty !== 0 && !selectAll) ? () => renderCloseButton(dispatch) : undefined
        }}
      />
      <Stack.Screen
        name="ApproveSummary"
        component={ApprovalSummary}
        options={{
          headerTitle: strings('APPROVAL.REVIEW')
        }}
      />
      <Stack.Screen
        name="RejectSummary"
        component={ApprovalSummary}
        options={{
          headerTitle: strings('APPROVAL.REVIEW')
        }}
      />
    </Stack.Navigator>
  );
};

export const ApprovalListNavigator = (): JSX.Element => {
  const { result } = useTypedSelector(state => state.async.getApprovalList);
  const { isAllSelected, selectedItemQty } = useTypedSelector(state => state.Approvals);
  const dispatch = useDispatch();
  return (
    <ApprovalListNavigatorStack
      result={result}
      dispatch={dispatch}
      selectAll={isAllSelected}
      selectedItemQty={selectedItemQty}
    />
  );
};
