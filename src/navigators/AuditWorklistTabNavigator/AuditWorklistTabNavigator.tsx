import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, {
  DependencyList, EffectCallback, useCallback, useEffect
} from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import {
  NavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute
} from '@react-navigation/native';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';
import CompletedAuditWorklist from '../../screens/Worklist/AuditWorklist/CompletedAuditWorklist';
import TodoAuditWorklist from '../../screens/Worklist/AuditWorklist/TodoAuditWorklist';
import { getWorklist } from '../../state/actions/saga';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { validateSession } from '../../utils/sessionTimeout';
import { AsyncState } from '../../models/AsyncState';
import { setWorklistItems } from '../../state/actions/AuditWorklist';
import { WorklistItemI } from '../../models/WorklistItem';
import { WorklistGoal, WorklistSummary } from '../../models/WorklistSummary';

interface AuditWorklistTabNavigatorProps {
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  useFocusEffectHook: (effect: EffectCallback) => void;
  useCallbackHook: <T extends (...args: any[]) => any>(callback: T, deps: DependencyList) => T;
  validateSessionCall: (navigation: NavigationProp<any>, routeName: any) => any;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
}

const Tab = createMaterialTopTabNavigator();

const getWorklistApiHook = (
  getWorklistApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>
) => {
  if (navigation.isFocused()) {
    if (!getWorklistApi.isWaiting && getWorklistApi.result && getWorklistApi.result.data) {
      dispatch(setWorklistItems(getWorklistApi.result.data as WorklistItemI[]));
    }
  }
};

const isRollOverComplete = (wlSummary: WorklistSummary) => {
  const rollOverSummary = wlSummary.worklistTypes.find(wlType => wlType.worklistType === 'RA');
  if (rollOverSummary) {
    return rollOverSummary.totalItems === 0 || rollOverSummary.completedItems === rollOverSummary.totalItems;
  }
  return true;
};

export const AuditWorklistTabNavigator = (props: AuditWorklistTabNavigatorProps) => {
  const {
    dispatch, navigation, route, useCallbackHook, useFocusEffectHook, validateSessionCall,
    useEffectHook
  } = props;
  const getWorklistApi: AsyncState = useTypedSelector(state => state.async.getWorklist);
  const { showRollOverAudit } = useTypedSelector(state => state.User.configs);
  const wlSummary: WorklistSummary[] = useTypedSelector(state => state.async.getWorklistSummary.result?.data);
  const selectedWorklistGoal = WorklistGoal.AUDITS;
  const worklistIndex = wlSummary.findIndex(item => item.worklistGoal === selectedWorklistGoal);
  const disableAuditWL = showRollOverAudit && !isRollOverComplete(wlSummary[worklistIndex]);

  const getAuditWlItems = () => {
    validateSessionCall(navigation, route.name).then(() => {
      const auditWlType = ['RA'];
      if (!disableAuditWL) {
        auditWlType.push('AU');
      }
      dispatch(getWorklist({ worklistType: auditWlType }));
    });
  };
  // Get Audit worklist items call
  useFocusEffectHook(
    useCallbackHook(() => {
      getAuditWlItems();
    }, [navigation])
  );

  useEffectHook(() => getWorklistApiHook(getWorklistApi, dispatch, navigation), [getWorklistApi]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLOR.WHITE,
        tabBarIndicatorStyle: { backgroundColor: COLOR.WHITE },
        tabBarStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR }
      }}
    >
      <Tab.Screen name={strings('WORKLIST.TODO')}>
        {() => <TodoAuditWorklist onRefresh={getAuditWlItems} />}
      </Tab.Screen>
      <Tab.Screen name={strings('WORKLIST.COMPLETED')}>
        {() => <CompletedAuditWorklist onRefresh={getAuditWlItems} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};
const AuditWorklistTabs = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  return (
    <AuditWorklistTabNavigator
      dispatch={dispatch}
      navigation={navigation}
      route={route}
      validateSessionCall={validateSession}
      useCallbackHook={useCallback}
      useFocusEffectHook={useFocusEffect}
      useEffectHook={useEffect}
    />
  );
};

export default AuditWorklistTabs;
