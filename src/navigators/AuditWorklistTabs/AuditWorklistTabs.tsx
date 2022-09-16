import {
  NavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute
} from '@react-navigation/native';
import React, { DependencyList, EffectCallback, useCallback } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { getWorklist } from '../../state/actions/saga';
import { validateSession } from '../../utils/sessionTimeout';

interface AuditWorklistTabNavigatorProps {
    dispatch: Dispatch<any>;
    navigation: NavigationProp<any>;
    route: RouteProp<any, string>;
    useFocusEffectHook: (effect: EffectCallback) => void;
    useCallbackHook: <T extends (...args: any[]) => any>(callback: T, deps: DependencyList) => T;
    validateSessionCall: (navigation: NavigationProp<any>, routeName: any) => any,
}

export const AuditWorklistTabNavigator = (props: AuditWorklistTabNavigatorProps) => {
  const {
    dispatch, navigation, route, useCallbackHook, useFocusEffectHook, validateSessionCall
  } = props;

  // Get Audit worklist items call
  useFocusEffectHook(
    useCallbackHook(() => {
      validateSessionCall(navigation, route.name).then(() => {
        dispatch(getWorklist({ worklistType: ['AU', 'RA'] }));
      });
    }, [navigation])
  );
  return <View />;
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
    />
  );
};

export default AuditWorklistTabs;
