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
import InProgressAuditWorklist from '../../screens/Worklist/AuditWorklist/InProgressAuditWorklist';
import TodoAuditWorklist from '../../screens/Worklist/AuditWorklist/TodoAuditWorklist';
import { getWorklistAudits, getWorklistAuditsV1 } from '../../state/actions/saga';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { validateSession } from '../../utils/sessionTimeout';
import { AsyncState } from '../../models/AsyncState';
import { setWorklistItems } from '../../state/actions/AuditWorklist';
import { WorklistItemI } from '../../models/WorklistItem';
import { WorklistGoal, WorklistSummary } from '../../models/WorklistSummary';
import { trackEvent } from '../../utils/AppCenterTool';

interface AuditWorklistTabNavigatorProps {
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  useFocusEffectHook: (effect: EffectCallback) => void;
  useCallbackHook: <T extends (...args: any[]) => any>(callback: T, deps: DependencyList) => T;
  validateSessionCall: (navigation: NavigationProp<any>, routeName: any) => any;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  trackEventCall: typeof trackEvent;
  enableAuditsInProgress: boolean;
}

const Tab = createMaterialTopTabNavigator();

const getWorklistAuditApiHook = (
  getWorklistAuditApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>
) => {
  if (navigation.isFocused()) {
    if (!getWorklistAuditApi.isWaiting && getWorklistAuditApi.result && getWorklistAuditApi.result.data) {
      dispatch(setWorklistItems(getWorklistAuditApi.result.data as WorklistItemI[]));
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

export const getWorklistAuditApiToUse = (
  enableAuditsInProgress: boolean,
  getWorklistAuditsApi: AsyncState,
  getWorklistAuditsV1Api: AsyncState
): AsyncState => (enableAuditsInProgress
  ? getWorklistAuditsV1Api
  : getWorklistAuditsApi);

export const AuditWorklistTabNavigator = (props: AuditWorklistTabNavigatorProps) => {
  const {
    dispatch, navigation, route, useCallbackHook, useFocusEffectHook, validateSessionCall,
    useEffectHook, trackEventCall, enableAuditsInProgress
  } = props;
  const getWorklistAuditApi = useTypedSelector(state => state.async.getWorklistAudits);
  const getWorklistAuditV1Api = useTypedSelector(state => state.async.getWorklistAuditsV1);
  const getAuditWorklistApi = getWorklistAuditApiToUse(
    enableAuditsInProgress,
    getWorklistAuditApi,
    getWorklistAuditV1Api
  );
  const { showRollOverAudit, inProgress } = useTypedSelector(state => state.User.configs);
  const wlSummary: WorklistSummary[] = inProgress
    ? useTypedSelector(state => state.async.getWorklistSummaryV2.result?.data)
    : useTypedSelector(state => state.async.getWorklistSummary.result?.data);
  const selectedWorklistGoal = WorklistGoal.AUDITS;
  const worklistIndex = wlSummary.findIndex(item => item.worklistGoal === selectedWorklistGoal);
  const disableAuditWL = showRollOverAudit && !isRollOverComplete(wlSummary[worklistIndex]);

  const getAuditWlItems = () => {
    validateSessionCall(navigation, route.name).then(() => {
      const auditWlType = ['RA'];
      if (!disableAuditWL) {
        auditWlType.push('AU');
      }
      trackEventCall('Audit_Worklist', { action: 'get_worklist_api_retry' });
      dispatch(enableAuditsInProgress
        ? getWorklistAuditsV1({ worklistType: auditWlType })
        : getWorklistAudits({ worklistType: auditWlType }));
    });
  };
  // Get Audit worklist items call
  useFocusEffectHook(
    useCallbackHook(() => {
      getAuditWlItems();
    }, [navigation])
  );

  useEffectHook(() => getWorklistAuditApiHook(getAuditWorklistApi, dispatch, navigation), [getAuditWorklistApi]);

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
      {enableAuditsInProgress ? (
        <Tab.Screen name={strings('AUDITS.IN_PROGRESS')}>
          {() => <InProgressAuditWorklist onRefresh={getAuditWlItems} />}
        </Tab.Screen>
      ) : null}
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
  const { enableAuditsInProgress } = useTypedSelector(state => state.User.configs);
  return (
    <AuditWorklistTabNavigator
      dispatch={dispatch}
      navigation={navigation}
      route={route}
      validateSessionCall={validateSession}
      useCallbackHook={useCallback}
      useFocusEffectHook={useFocusEffect}
      useEffectHook={useEffect}
      trackEventCall={trackEvent}
      enableAuditsInProgress={enableAuditsInProgress}
    />
  );
};

export default AuditWorklistTabs;
