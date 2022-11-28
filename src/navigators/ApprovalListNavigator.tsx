import React, { Dispatch, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  Animated,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useDispatch } from 'react-redux';
import SideMenu from 'react-native-side-menu-updated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ApprovalList from '../screens/ApprovalList/ApprovalList';
import COLOR from '../themes/Color';
import { strings } from '../locales';
import styles from './ApprovalListNavigator.style';
import { toggleAllItems } from '../state/actions/Approvals';
import { useTypedSelector } from '../state/reducers/RootReducer';
import { ApprovalSummary } from '../screens/ApprovalSummary/ApprovalSummary';
import ApprovalFilter from '../screens/ApprovalList/ApprovalFilterMenu/ApprovalFilter';
import { UseStateType } from '../models/Generics.d';

const Stack = createStackNavigator();

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

export const renderHeaderRight = (
  dispatch: Dispatch<any>, selectAll: boolean, toggleMenu: UseStateType<boolean>[1]
) => (
  <View style={styles.headerRightView}>
    <TouchableOpacity onPress={() => toggleMenu(isOpen => !isOpen)}>
      <MaterialIcons name="filter-list" size={25} color={COLOR.WHITE} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => dispatch(toggleAllItems(!selectAll))}>
      <View style={styles.selectAllButton}>
        {selectAll ? <Text style={styles.selectAllText}>{strings('APPROVAL.DESELECT_ALL')}</Text>
          : <Text style={styles.selectAllText}>{strings('APPROVAL.SELECT_ALL')}</Text>}
      </View>
    </TouchableOpacity>
  </View>
);

interface ApprovalNavigatorProps {
  result: any;
  dispatch: Dispatch<any>;
  selectAll: boolean;
  selectedItemQty: number;
  filterMenuState: UseStateType<boolean>;
}
export const ApprovalListNavigatorStack = (props: ApprovalNavigatorProps): JSX.Element => {
  const {
    result, dispatch, selectAll, selectedItemQty, filterMenuState
  } = props;
  const [menuOpen, toggleMenu] = filterMenuState;

  const approvalAmount: number = (result && result.data.length) || 0;

  const menu = <ApprovalFilter />;
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
          toggleMenu(false);
        } else if (isOpen && !menuOpen) {
          toggleMenu(true);
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
          name="Approval"
          component={ApprovalList}
          options={{
            headerTitle: selectedItemQty === 0 ? () => renderApprovalTitle(approvalAmount)
              : () => renderSelectedItemQty(selectedItemQty),
            headerRight: () => renderHeaderRight(dispatch, selectAll, toggleMenu),
            headerRightContainerStyle: styles.headerRightView,
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
    </SideMenu>
  );
};

export const ApprovalListNavigator = (): JSX.Element => {
  const { result } = useTypedSelector(state => state.async.getApprovalList);
  const { isAllSelected, selectedItemQty } = useTypedSelector(state => state.Approvals);
  const dispatch = useDispatch();
  const filterMenuState = useState(false);
  return (
    <ApprovalListNavigatorStack
      result={result}
      dispatch={dispatch}
      selectAll={isAllSelected}
      selectedItemQty={selectedItemQty}
      filterMenuState={filterMenuState}
    />
  );
};
