import React, {
  DependencyList,
  Dispatch,
  EffectCallback,
  JSX,
  useCallback,
  useEffect,
  useState
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
import { GET_PALLET_DETAILS } from '../../state/actions/asyncAPI';
import COLOR from '../../themes/Color';
import { strings } from '../../locales';
import { TodoPalletWorklist } from '../../screens/Worklist/TodoPalletWorklist';
import { CompletedPalletWorklist } from '../../screens/Worklist/CompletedPalletWorklist';
import { validateSession } from '../../utils/sessionTimeout';
import { getPalletWorklist } from '../../state/actions/saga';
import { Tabs } from '../../models/PalletWorklist';
import { setSelectedTab } from '../../state/actions/PalletWorklist';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { SNACKBAR_TIMEOUT } from '../../utils/global';
import { Pallet, PalletItem } from '../../models/PalletManagementTypes';
import {
  setPerishableCategories,
  setupPallet
} from '../../state/actions/PalletManagement';
import { AsyncState } from '../../models/AsyncState';
import { Configurations } from '../../models/User';
import {
  hideActivityModal,
  showActivityModal
} from '../../state/actions/Modal';

const Tab = createMaterialTopTabNavigator();

interface MissingPalletWorklistTabNavigatorProps {
  useFocusEffectHook: (effect: EffectCallback) => void;
  useCallbackHook: <T extends (...args: any[]) => any>(
    callback: T,
    deps: DependencyList
  ) => T;
  validateSessionCall: (
    navigation: NavigationProp<any>,
    route?: string
  ) => Promise<void>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  perishableCategoriesList: number[];
  selectedTab: Tabs;
  palletConfigComplete: boolean;
  getPalletDetailsApi: AsyncState;
  setPalletConfigComplete: React.Dispatch<React.SetStateAction<boolean>>;
  getPalletDetailsComplete: boolean;
  setGetPalletDetailsComplete: React.Dispatch<React.SetStateAction<boolean>>;
  palletClicked: boolean;
  setPalletClicked: React.Dispatch<React.SetStateAction<boolean>>;
  userConfig: Configurations;
}

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
      const { id, createDate, expirationDate, items } =
        getPalletDetailsApi.result.data.pallets[0];
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

export const resetPalletDetailsHook = (
  navigation: NavigationProp<any>,
  dispatch: Dispatch<any>
) => {
  navigation.addListener('beforeRemove', () => {
    dispatch({ type: GET_PALLET_DETAILS.RESET });
  });
};

export const navigationPalletHook = (
  navigation: NavigationProp<any>,
  palletConfigComplete: boolean,
  getPalletDetailsComplete: boolean,
  setGetPalletDetailsComplete: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (navigation.isFocused()) {
    if (palletConfigComplete && getPalletDetailsComplete) {
      navigation.navigate('PalletManagement', { screen: 'ManagePallet' });
      setGetPalletDetailsComplete(false);
    }
  }
};

export const setPerishableCategoriesHook = (
  perishableCategoriesList: number[],
  perishableCategories: string,
  dispatch: Dispatch<any>,
  setPalletConfigComplete: React.Dispatch<React.SetStateAction<boolean>>,
  navigation: NavigationProp<any>
) => {
  if (navigation.isFocused()) {
    if (perishableCategoriesList.length === 0) {
      const backupPerishableCategories = perishableCategories
        .split('-')
        .map(Number);
      dispatch(setPerishableCategories(backupPerishableCategories));
      setPalletConfigComplete(true);
    } else {
      setPalletConfigComplete(true);
    }
  }
};

export const MissingPalletWorklistTabNavigator = (
  props: MissingPalletWorklistTabNavigatorProps
): JSX.Element => {
  const {
    useCallbackHook,
    useFocusEffectHook,
    useEffectHook,
    getPalletDetailsApi,
    dispatch,
    navigation,
    route,
    perishableCategoriesList,
    validateSessionCall,
    selectedTab,
    setGetPalletDetailsComplete,
    setPalletClicked,
    setPalletConfigComplete,
    palletConfigComplete,
    palletClicked,
    getPalletDetailsComplete,
    userConfig
  } = props;
  const { perishableCategories } = userConfig;

  // Navigation Listener
  useEffectHook(() => {
    resetPalletDetailsHook(navigation, dispatch);
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
    setPerishableCategoriesHook(
      perishableCategoriesList,
      perishableCategories,
      dispatch,
      setPalletConfigComplete,
      navigation
    );
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

  useEffectHook(() => {
    navigationPalletHook(
      navigation,
      palletConfigComplete,
      getPalletDetailsComplete,
      setGetPalletDetailsComplete
    );
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
  const { perishableCategoriesList } = useTypedSelector(state => state.PalletManagement);
  const getPalletDetailsApi = useTypedSelector(state => state.async.getPalletDetails);
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
      perishableCategoriesList={perishableCategoriesList}
      validateSessionCall={validateSession}
      selectedTab={selectedTab}
      getPalletDetailsApi={getPalletDetailsApi}
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
