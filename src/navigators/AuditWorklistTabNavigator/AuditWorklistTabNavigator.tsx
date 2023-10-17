import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, {
  DependencyList, EffectCallback, useCallback, useEffect, useRef
} from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import {
  NavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute
} from '@react-navigation/native';
import { EmitterSubscription } from 'react-native';
import Toast from 'react-native-toast-message';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';
import CompletedAuditWorklist from '../../screens/Worklist/AuditWorklist/CompletedAuditWorklist';
import InProgressAuditWorklist from '../../screens/Worklist/AuditWorklist/InProgressAuditWorklist';
import TodoAuditWorklist from '../../screens/Worklist/AuditWorklist/TodoAuditWorklist';
import { getWorklistAuditV1 } from '../../state/actions/saga';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { validateSession } from '../../utils/sessionTimeout';
import { AsyncState } from '../../models/AsyncState';
import { setAuditItemNumber, setWorklistItems } from '../../state/actions/AuditWorklist';
import { WorklistItemI } from '../../models/WorklistItem';
import { WorklistGoal, WorklistSummary } from '../../models/WorklistSummary';
import { trackEvent } from '../../utils/AppCenterTool';
import { GET_WORKLIST_AUDIT_V1 } from '../../state/actions/asyncAPI';
import { barcodeEmitter } from '../../utils/scannerUtils';
import { resetScannedEvent, setScannedEvent } from '../../state/actions/Global';
import { SNACKBAR_TIMEOUT } from '../../utils/global';
import { compareWithMaybeCheckDigit } from '../../utils/barcodeUtils';

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
  isMounted: React.MutableRefObject<boolean>;
  scannedEvent: { type: string | null; value: string | null };
  auditWorklistItems: WorklistItemI[];
}

export const AUDITS = 'audits';

const Tab = createMaterialTopTabNavigator();

export const scannedEventHook = (
  isMounted: React.MutableRefObject<boolean>,
  navigation: NavigationProp<any>,
  route: RouteProp<any>,
  scannedEvent: { value: any; type: string | null },
  trackEventCall: typeof trackEvent,
  dispatch: Dispatch<any>,
  auditWorklistItems: WorklistItemI[],
  validateSessionCall: typeof validateSession
) => {
  if (isMounted.current) {
    if (navigation.isFocused() && scannedEvent.type && scannedEvent.type !== 'itemDetails') {
      validateSessionCall(navigation, route.name).then(() => {
        if (scannedEvent.type === 'card_click') {
          dispatch(setAuditItemNumber(scannedEvent.value));
          navigation.navigate('AuditItem', { source: AUDITS });
        } else if (auditWorklistItems.some(
          item => scannedEvent.value === item.itemNbr?.toString()
            || compareWithMaybeCheckDigit(scannedEvent.value, item.upcNbr || '')
        )) {
          trackEventCall('Audit_Worklist', {
            action: 'scanned_item_on_worklist',
            scannedEvent: JSON.stringify(scannedEvent)
          });
          dispatch(setAuditItemNumber(scannedEvent.value));
          navigation.navigate('AuditItem', { source: AUDITS });
        } else {
          trackEventCall('Audit_Worklist', {
            action: 'scanned_item_off_worklist',
            scannedEvent: JSON.stringify(scannedEvent)
          });
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: strings('AUDITS.SCANNED_ITEM_NOT_PRESENT'),
            visibilityTime: SNACKBAR_TIMEOUT
          });
        }
        dispatch(resetScannedEvent());
      });
    }
  } else {
    isMounted.current = true;
  }
};

export const scannerListenerHook = (
  navigation: NavigationProp<any>,
  validateSessionCall: typeof validateSession,
  route: RouteProp<any>,
  trackEventCall: typeof trackEvent,
  scan: any,
  dispatch: Dispatch<any>
) => {
  if (navigation.isFocused()) {
    validateSessionCall(navigation, route.name).then(() => {
      trackEventCall('Audit_Worklist', {
        action: 'item_barcode_scan',
        value: scan.value,
        type: scan.type
      });
      dispatch(setScannedEvent(scan));
    });
  }
};

const getWorklistAuditApiHook = (
  getWorklistAuditApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>
) => {
  if (navigation.isFocused()) {
    if (!getWorklistAuditApi.isWaiting && getWorklistAuditApi.result && getWorklistAuditApi.result.data) {
      dispatch(setWorklistItems(getWorklistAuditApi.result.data as WorklistItemI[]));
      dispatch({ type: GET_WORKLIST_AUDIT_V1.RESET });
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
    useEffectHook, trackEventCall, enableAuditsInProgress, isMounted, scannedEvent, auditWorklistItems
  } = props;
  const getWorklistAuditV1Api = useTypedSelector(state => state.async.getWorklistAuditV1);

  const { showRollOverAudit } = useTypedSelector(state => state.User.configs);
  const wlSummary: WorklistSummary[] = useTypedSelector(state => state.async.getWorklistSummaryV2.result?.data
    || state.async.getWorklistSummary.result?.data);
  const selectedWorklistGoal = WorklistGoal.AUDITS;
  const worklistIndex = wlSummary.findIndex(item => item.worklistGoal === selectedWorklistGoal);
  const disableAuditWL = showRollOverAudit && !isRollOverComplete(wlSummary[worklistIndex]);
  let scannedSubscription: EmitterSubscription;

  useEffectHook(() => scannedEventHook(
    isMounted,
    navigation,
    route,
    scannedEvent,
    trackEventCall,
    dispatch,
    auditWorklistItems,
    validateSessionCall
  ), [scannedEvent, auditWorklistItems]);

  // Scanner listener
  useEffectHook(() => {
    scannedSubscription = barcodeEmitter.addListener('scanned', scan => scannerListenerHook(
      navigation,
      validateSessionCall,
      route,
      trackEventCall,
      scan,
      dispatch
    ));
    return () => scannedSubscription.remove();
  }, []);

  const getAuditWlItems = () => {
    validateSessionCall(navigation, route.name).then(() => {
      const auditWlType = ['RA'];
      if (!disableAuditWL) {
        auditWlType.push('AU');
      }
      trackEventCall('Audit_Worklist', { action: 'get_worklist_api_retry' });
      dispatch(getWorklistAuditV1({ worklistType: auditWlType }));
    });
  };
  // Get Audit worklist items call
  useFocusEffectHook(
    useCallbackHook(() => {
      getAuditWlItems();
    }, [navigation])
  );

  useEffectHook(() => getWorklistAuditApiHook(getWorklistAuditV1Api, dispatch, navigation), [getWorklistAuditV1Api]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLOR.WHITE,
        tabBarIndicatorStyle: { backgroundColor: COLOR.WHITE },
        tabBarStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR }
      }}
    >
      <Tab.Screen name={strings('WORKLIST.TODO')}>
        {() => <TodoAuditWorklist onRefresh={getAuditWlItems} auditWorklistItems={auditWorklistItems} />}
      </Tab.Screen>
      {enableAuditsInProgress ? (
        <Tab.Screen name={strings('AUDITS.IN_PROGRESS')}>
          {() => <InProgressAuditWorklist onRefresh={getAuditWlItems} auditWorklistItems={auditWorklistItems} />}
        </Tab.Screen>
      ) : null}
      <Tab.Screen name={strings('WORKLIST.COMPLETED')}>
        {() => <CompletedAuditWorklist onRefresh={getAuditWlItems} auditWorklistItems={auditWorklistItems} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};
const AuditWorklistTabs = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { enableAuditsInProgress } = useTypedSelector(state => state.User.configs);
  const { scannedEvent } = useTypedSelector(state => state.Global);
  const auditWorklistItems = useTypedSelector(state => state.AuditWorklist.items);
  const isMounted = useRef(false);
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
      isMounted={isMounted}
      scannedEvent={scannedEvent}
      auditWorklistItems={auditWorklistItems}
    />
  );
};

export default AuditWorklistTabs;
