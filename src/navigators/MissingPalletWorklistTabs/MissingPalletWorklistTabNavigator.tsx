import React, {
  DependencyList, Dispatch, EffectCallback, useCallback, useEffect
} from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import COLOR from '../../themes/Color';
import { strings } from '../../locales';
import { TodoPalletWorklist } from '../../screens/Worklist/TodoPalletWorklist';
import { CompletedPalletWorklist } from '../../screens/Worklist/CompletedPalletWorklist';
import { validateSession } from '../../utils/sessionTimeout';
import { getPalletWorklist } from '../../state/actions/saga';

const Tab = createMaterialTopTabNavigator();

interface MissingPalletWorklistTabNavigatorProps {
  useFocusEffectHook: (effect: EffectCallback) => void;
  useCallbackHook: <T extends (...args: any[]) => any>(callback: T, deps: DependencyList) => T;
  validateSessionCall: (navigation: NavigationProp<any>, route?: string) => Promise<void>;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
}

export const MissingPalletWorklistTabNavigator = (props: MissingPalletWorklistTabNavigatorProps): JSX.Element => {
  const {
    useCallbackHook, useEffectHook, useFocusEffectHook,
    dispatch, navigation, route, validateSessionCall
  } = props;

  // Get Picklist Api call
  useFocusEffectHook(
    useCallbackHook(() => {
      validateSessionCall(navigation, route.name).then(() => {
        dispatch(getPalletWorklist({ worklistType: ['MP'] }));
      });
    }, [navigation])
  );

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: COLOR.WHITE,
        style: { backgroundColor: COLOR.MAIN_THEME_COLOR },
        indicatorStyle: { backgroundColor: COLOR.WHITE }
      }}
    >
      <Tab.Screen
        name={strings('WORKLIST.TODO')}
        component={TodoPalletWorklist}
      />
      <Tab.Screen
        name={strings('WORKLIST.COMPLETED')}
        component={CompletedPalletWorklist}
      />
    </Tab.Navigator>
  );
};

export const MissingPalletWorklistTabs = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  return (
    <MissingPalletWorklistTabNavigator
      useEffectHook={useEffect}
      useCallbackHook={useCallback}
      dispatch={dispatch}
      navigation={navigation}
      useFocusEffectHook={useFocusEffect}
      route={route}
      validateSessionCall={validateSession}
    />
  );
};

export default MissingPalletWorklistTabs;
