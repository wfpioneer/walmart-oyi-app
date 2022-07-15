import React, {
  DependencyList, Dispatch, EffectCallback, useCallback, useEffect, useState
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
import Toast from 'react-native-toast-message';
import { GET_PALLET_CONFIG, GET_PALLET_DETAILS } from '../../state/actions/asyncAPI';
import COLOR from '../../themes/Color';
import { strings } from '../../locales';
import { TodoPalletWorklist } from '../../screens/Worklist/TodoPalletWorklist';
import { CompletedPalletWorklist } from '../../screens/Worklist/CompletedPalletWorklist';
import { validateSession } from '../../utils/sessionTimeout';
import { getPalletConfig, getPalletWorklist } from '../../state/actions/saga';
import { Tabs } from '../../models/PalletWorklist';
import { setSelectedTab } from '../../state/actions/PalletWorklist';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { SNACKBAR_TIMEOUT } from '../../utils/global';
import { Pallet, PalletItem } from '../../models/PalletManagementTypes';
import { setPerishableCategories, setupPallet } from '../../state/actions/PalletManagement';
import { AsyncState } from '../../models/AsyncState';
import { Configurations } from '../../models/User';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';

const Tab = createMaterialTopTabNavigator();

interface MissingPalletWorklistTabNavigatorProps {
  useFocusEffectHook: (effect: EffectCallback) => void;
  useCallbackHook: <T extends (...args: any[]) => any>(callback: T, deps: DependencyList) => T;
  validateSessionCall: (navigation: NavigationProp<any>, route?: string) => Promise<void>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  selectedTab: Tabs;
  perishableCategories: number[];
  palletConfigComplete: boolean;
  getPalletDetailsApi: AsyncState;
  getPalletConfigApi: AsyncState;
  setPalletConfigComplete: React.Dispatch<React.SetStateAction<boolean>>;
  getPalletDetailsComplete: boolean;
  setGetPalletDetailsComplete: React.Dispatch<React.SetStateAction<boolean>>;
  palletClicked: boolean;
  setPalletClicked: React.Dispatch<React.SetStateAction<boolean>>;
  userConfig: Configurations;
}

export const getPalletConfigHook = (
  getPalletConfigApi: AsyncState,
  dispatch: Dispatch<any>,
  setPalletConfigComplete: React.Dispatch<React.SetStateAction<boolean>>,
  backupCategories: string
) => {
  // on api success
  if (!getPalletConfigApi.isWaiting && getPalletConfigApi.result) {
    const { perishableCategories } = getPalletConfigApi.result.data;
    dispatch(setPerishableCategories(perishableCategories));
    dispatch({ type: GET_PALLET_CONFIG.RESET });
    setPalletConfigComplete(true);
  }
  // on api error
  if (getPalletConfigApi.error) {
    const backupPerishableCategories = backupCategories.split(',').map(Number);
    dispatch(setPerishableCategories(backupPerishableCategories));
    dispatch({ type: GET_PALLET_CONFIG.RESET });
    setPalletConfigComplete(true);
  }
};

export const getPalletDetailsApiHook = (
  getPalletDetailsApi: AsyncState,
  palletClicked: boolean,
  setPalletClicked: React.Dispatch<React.SetStateAction<boolean>>,
  dispatch: Dispatch<any>,
  setGetPalletDetailsComplete: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // on api success
  if (!getPalletDetailsApi.isWaiting && getPalletDetailsApi.result) {
    if (getPalletDetailsApi.result.status === 200 && palletClicked) {
      const {
        id, createDate, expirationDate, items
      } = getPalletDetailsApi.result.data.pallets[0];
      setPalletClicked(false);
      const palletItems = items.map((item: PalletItem) => ({
        ...item,
        quantity: item.quantity || 0,
        newQuantity: item.quantity || 0,
        deleted: false,
        added: false
      }));
      const palletDetails: Pallet = {
        palletInfo: {
          id,
          createDate,
          expirationDate
        },
        items: palletItems
      };
      dispatch(setupPallet(palletDetails));
      setGetPalletDetailsComplete(true);
    } else if (getPalletDetailsApi.result.status === 204) {
      Toast.show({
        type: 'error',
        text1: strings('LOCATION.PALLET_NOT_FOUND'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
    }
    dispatch(hideActivityModal());
  }

  // on api error
  if (!getPalletDetailsApi.isWaiting && getPalletDetailsApi.error) {
    dispatch(hideActivityModal());
    Toast.show({
      type: 'error',
      text1: strings('PALLET.PALLET_DETAILS_ERROR'),
      text2: strings('GENERICS.TRY_AGAIN'),
      visibilityTime: SNACKBAR_TIMEOUT,
      position: 'bottom'
    });
  }

  // api is Loading
  if (getPalletDetailsApi.isWaiting) {
    dispatch(showActivityModal());
  }
};

export const MissingPalletWorklistTabNavigator = (props: MissingPalletWorklistTabNavigatorProps): JSX.Element => {
  const {
    useCallbackHook, useFocusEffectHook, useEffectHook, perishableCategories, getPalletConfigApi, getPalletDetailsApi,
    dispatch, navigation, route, validateSessionCall, selectedTab, setGetPalletDetailsComplete, setPalletClicked,
    setPalletConfigComplete, palletConfigComplete, palletClicked, getPalletDetailsComplete, userConfig
  } = props;

  // Navigation Listener
  useEffectHook(() => {
    // Resets Get PalletDetails api response data when navigating off-screen
    navigation.addListener('beforeRemove', () => {
      dispatch({ type: GET_PALLET_DETAILS.RESET });
    });
  }, []);

  // Get Picklist Api call
  useFocusEffectHook(
    useCallbackHook(() => {
      validateSessionCall(navigation, route.name).then(() => {
        dispatch(getPalletWorklist({ worklistType: ['MP'] }));
      });
    }, [navigation])
  );

  useEffectHook(() => {
    if (navigation.isFocused()) {
      if (perishableCategories.length === 0) {
        dispatch(getPalletConfig());
      } else {
        setPalletConfigComplete(true);
      }
    }
  }, [perishableCategories, navigation]);

  // Get Pallet Details Api
  useEffectHook(() => {
    if (navigation.isFocused()) {
      getPalletDetailsApiHook(
        getPalletDetailsApi,
        palletClicked,
        setPalletClicked,
        dispatch,
        setGetPalletDetailsComplete
      );
    }
  }, [getPalletDetailsApi]);

  // GetPalletConfig API
  useEffectHook(() => {
    if (navigation.isFocused()) {
      getPalletConfigHook(getPalletConfigApi, dispatch, setPalletConfigComplete, userConfig.backupCategories);
    }
  }, [getPalletConfigApi]);

  useEffectHook(() => {
    if (navigation.isFocused()) {
      if (palletConfigComplete && getPalletDetailsComplete) {
        navigation.navigate('PalletManagement', { screen: 'ManagePallet' });
        setGetPalletDetailsComplete(false);
      }
    }
  }, [getPalletDetailsComplete, palletConfigComplete]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLOR.WHITE,
        tabBarStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
        tabBarIndicatorStyle: { backgroundColor: COLOR.WHITE }
      }}
      initialRouteName={selectedTab}
    >
      <Tab.Screen
        name={strings('WORKLIST.TODO')}
        listeners={{
          focus: () => dispatch(setSelectedTab(Tabs.TODO))
        }}
      >
        {() => <TodoPalletWorklist setPalletClicked={setPalletClicked} />}
      </Tab.Screen>
      <Tab.Screen
        name={strings('WORKLIST.COMPLETED')}
        listeners={{
          focus: () => dispatch(setSelectedTab(Tabs.COMPLETED))
        }}
      >
        {() => <CompletedPalletWorklist setPalletClicked={setPalletClicked} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export const MissingPalletWorklistTabs = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const selectedTab = useTypedSelector(state => state.PalletWorklist.selectedTab);
  const { perishableCategories } = useTypedSelector(state => state.PalletManagement);
  const getPalletDetailsApi = useTypedSelector(state => state.async.getPalletDetails);
  const getPalletConfigApi = useTypedSelector(state => state.async.getPalletConfig);
  const [palletConfigComplete, setPalletConfigComplete] = useState(false);
  const [getPalletDetailsComplete, setGetPalletDetailsComplete] = useState(false);
  const [palletClicked, setPalletClicked] = useState(false);
  const userConfig = useTypedSelector(state => state.User.configs);
  return (
    <MissingPalletWorklistTabNavigator
      useCallbackHook={useCallback}
      dispatch={dispatch}
      navigation={navigation}
      useEffectHook={useEffect}
      useFocusEffectHook={useFocusEffect}
      route={route}
      validateSessionCall={validateSession}
      perishableCategories={perishableCategories}
      selectedTab={selectedTab}
      getPalletDetailsApi={getPalletDetailsApi}
      getPalletConfigApi={getPalletConfigApi}
      userConfig={userConfig}
      palletClicked={palletClicked}
      setPalletClicked={setPalletClicked}
      getPalletDetailsComplete={getPalletDetailsComplete}
      setGetPalletDetailsComplete={setGetPalletDetailsComplete}
      palletConfigComplete={palletConfigComplete}
      setPalletConfigComplete={setPalletConfigComplete}
    />
  );
};

export default MissingPalletWorklistTabs;
