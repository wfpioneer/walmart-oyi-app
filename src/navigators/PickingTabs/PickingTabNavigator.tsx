import React, {
  DependencyList,
  EffectCallback,
  useCallback,
  useEffect,
  useMemo,
  useRef
} from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView
} from '@gorhom/bottom-sheet';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Toast from 'react-native-toast-message';
import {
  BackHandler,
  BackHandlerStatic,
  NativeEventEmitter,
  Text,
  TouchableOpacity
} from 'react-native';
import { useDispatch } from 'react-redux';
import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import { Badge } from 'react-native-paper';
import { Dispatch } from 'redux';
// eslint-disable-next-line max-len
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types.d';
import { strings } from '../../locales';
import QuickPickTab from '../../screens/QuickPickTab/QuickPickTab';
import { barcodeEmitter } from '../../utils/scannerUtils';
import PickBinTab from '../../screens/PickBinTab/PickBinTab';
import SalesFloorTab from '../../screens/SalesFloorTab/SalesFloorTabScreen';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { PickListItem, PickStatus, Tabs } from '../../models/Picking.d';
import { validateSession } from '../../utils/sessionTimeout';
import {
  getItemDetailsV4,
  getLocationsForItem,
  getLocationsForItemV1,
  getPicklists
} from '../../state/actions/saga';
import {
  initializePicklist,
  resetMultiPickBinSelection,
  resetPickList,
  setPickCreateItem,
  setSelectedTab,
  showPickingMenu,
  toggleMultiBin,
  toggleMultiPick
} from '../../state/actions/Picking';
import { resetScannedEvent } from '../../state/actions/Global';
import { AsyncState } from '../../models/AsyncState';
import {
  hideActivityModal,
  showActivityModal
} from '../../state/actions/Modal';
import {
  GET_ITEM_DETAILS_V4,
  GET_PICKLISTS,
  UPDATE_PICKLIST_STATUS,
  UPDATE_PICKLIST_STATUS_V1
} from '../../state/actions/asyncAPI';
import ItemDetails from '../../models/ItemDetails';
import styles from './PickingTabNavigator.style';
import COLOR from '../../themes/Color';
import { trackEvent } from '../../utils/AppCenterTool';

const Tab = createMaterialTopTabNavigator();
const TRY_AGAIN_TEXT = strings('GENERICS.TRY_AGAIN');

interface PickingTabNavigatorProps {
  picklist: PickListItem[];
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  getItemDetailsApi: AsyncState;
  getPicklistsApi: AsyncState;
  updatePicklistStatusApi: AsyncState;
  selectedTab: Tabs;
  useFocusEffectHook: (effect: EffectCallback) => void;
  useCallbackHook: <T extends (...args: any[]) => any>(
    callback: T,
    deps: DependencyList
  ) => T;
  multiBinEnabled: boolean;
  multiPickEnabled: boolean;
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  pickingMenu: boolean;
  peteGetLocations: boolean;
}

interface BottomSheetCardProps {
  text: string;
  onPress: () => void;
}

const handleApiSuccess = (
  result: any,
  dispatch: Dispatch<any>,
  peteGetLocations: boolean,
  navigation: NavigationProp<any>
) => {
  if (result.status === 200 || result.status === 207) {
    const itemDetails = result.data;
    dispatch(
      setPickCreateItem({
        itemName: itemDetails.itemName,
        itemNbr: itemDetails.itemNbr,
        upcNbr: itemDetails.upcNbr,
        categoryNbr: itemDetails.categoryNbr,
        categoryDesc: itemDetails.categoryDesc,
        price: itemDetails.price
      })
    );

    if (peteGetLocations) {
      dispatch(getLocationsForItemV1(itemDetails.itemNbr));
    } else {
      dispatch(getLocationsForItem(itemDetails.itemNbr));
    }
    navigation.navigate('CreatePick');
  } else if (result.status === 204) {
    Toast.show({
      type: 'error',
      text1: strings('ITEM.ITEM_NOT_FOUND'),
      visibilityTime: 4000,
      position: 'bottom'
    });
  }
  dispatch(hideActivityModal());
  dispatch({ type: GET_ITEM_DETAILS_V4.RESET });
};

const handleApiError = (dispatch: Dispatch<any>) => {
  dispatch(hideActivityModal());
  dispatch({ type: GET_ITEM_DETAILS_V4.RESET });
  Toast.show({
    type: 'error',
    text1: strings('ITEM.API_ERROR'),
    text2: TRY_AGAIN_TEXT,
    visibilityTime: 4000,
    position: 'bottom'
  });
};

export const getItemDetailsApiHook = (
  getItemDetailsApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  peteGetLocations: boolean
) => {
  if (navigation.isFocused()) {
    // on api success
    if (!getItemDetailsApi.isWaiting && getItemDetailsApi.result) {
      handleApiSuccess(
        getItemDetailsApi.result,
        dispatch,
        peteGetLocations,
        navigation
      );
    }
    // on api error
    if (!getItemDetailsApi.isWaiting && getItemDetailsApi.error) {
      handleApiError(dispatch);
    }
    // on api request
    if (getItemDetailsApi.isWaiting) {
      dispatch(showActivityModal());
    }
  }
};

export const getPicklistApiHook = (
  getPicklistApi: AsyncState,
  dispatch: Dispatch<any>,
  isFocused: boolean
): void => {
  if (isFocused && !getPicklistApi.isWaiting) {
    // Get Picklist api success
    if (getPicklistApi.result) {
      if (getPicklistApi.result.status === 200) {
        dispatch(initializePicklist(getPicklistApi.result.data));
      } else if (getPicklistApi.result.status === 204) {
        // Resetting the picking redux if no more picks available
        dispatch(resetPickList());
        Toast.show({
          type: 'info',
          text1: strings('PICKING.PICKLIST_NOT_FOUND'),
          visibilityTime: 4000,
          position: 'bottom'
        });
      }
      dispatch({ type: GET_PICKLISTS.RESET });
      dispatch(hideActivityModal());
    }
    // Get Picklist api error
    if (getPicklistApi.error) {
      Toast.show({
        type: 'error',
        text1: strings('PICKING.PICKLIST_ERROR'),
        text2: TRY_AGAIN_TEXT,
        visibilityTime: 4000,
        position: 'bottom'
      });
      dispatch({ type: GET_PICKLISTS.RESET });
      dispatch(hideActivityModal());
    }
  }
};

export const updatePicklistStatusApiHook = (
  updatePicklistStatusApi: AsyncState,
  dispatch: Dispatch<any>,
  screenIsFocused: boolean,
  multiBinEnabled: boolean,
  multiPickEnabled: boolean
) => {
  if (screenIsFocused) {
    // on api success
    if (
      !updatePicklistStatusApi.isWaiting
      && updatePicklistStatusApi.result
      && (updatePicklistStatusApi.result.status === 200
        || updatePicklistStatusApi.result.status === 204)
    ) {
      dispatch(hideActivityModal());
      Toast.show({
        type: 'success',
        text1: strings('PICKING.UPDATE_PICKLIST_STATUS_SUCCESS'),
        visibilityTime: 4000,
        position: 'bottom'
      });
      if (multiBinEnabled || multiPickEnabled) {
        dispatch(resetMultiPickBinSelection());
      }
      dispatch({ type: UPDATE_PICKLIST_STATUS.RESET });
      dispatch({ type: UPDATE_PICKLIST_STATUS_V1.RESET });
      dispatch(getPicklists());
    }
    // on api error
    if (!updatePicklistStatusApi.isWaiting && updatePicklistStatusApi.error) {
      dispatch(hideActivityModal());
      Toast.show({
        type: 'error',
        text1: strings('PICKING.UPDATE_PICKLIST_STATUS_ERROR'),
        text2: TRY_AGAIN_TEXT,
        visibilityTime: 4000,
        position: 'bottom'
      });
      dispatch({ type: UPDATE_PICKLIST_STATUS.RESET });
    }
    // on api request
    if (updatePicklistStatusApi.isWaiting) {
      dispatch(showActivityModal());
    }
  }
};

export const barcodeEmitterHook = (
  barcodeEventEmitter: NativeEventEmitter,
  navigation: NavigationProp<any>,
  route: RouteProp<any, string>,
  dispatch: Dispatch<any>,
  selectedTab: Tabs
) => {
  const scannedSubscription = barcodeEventEmitter.addListener(
    'scanned',
    scan => {
      if (
        navigation.isFocused()
        && (selectedTab === Tabs.PICK || selectedTab === Tabs.QUICKPICK)
        && scan.value
      ) {
        validateSession(navigation, route.name).then(() => {
          trackEvent('Items_Details_scanned', {
            barcode: scan.value,
            type: scan.type
          });
          dispatch(getItemDetailsV4({ id: scan.value, getSummary: false }));
          dispatch(resetScannedEvent());
        });
      }
    }
  );
  return () => {
    scannedSubscription.remove();
  };
};

export const backHandlerEventHook = (
  BackHandlerEmitter: BackHandlerStatic,
  multiBinEnabled: boolean,
  multiPickEnabled: boolean,
  dispatch: Dispatch<any>
) => {
  const onBackPress = () => {
    if (multiBinEnabled || multiPickEnabled) {
      dispatch(resetMultiPickBinSelection());
      return true;
    }
    return false;
  };
  BackHandlerEmitter.addEventListener('hardwareBackPress', onBackPress);

  return () => BackHandlerEmitter.removeEventListener('hardwareBackPress', onBackPress);
};

export const getTabScreenOptions = (
  tabName: string,
  title: string,
  badgeCount: number
) => ({
  title,
  tabBarBadge:
    badgeCount !== 0
      ? () => (
        <Badge
          onPressIn={undefined}
          onPressOut={undefined}
          style={
              tabName === 'QUICKPICK' ? styles.quickPickBadge : styles.badge
            }
          visible={true}
        >
          {badgeCount}
        </Badge>
      )
      : undefined
});

export const PickingTabNavigator = (
  props: PickingTabNavigatorProps
): React.JSX.Element => {
  const {
    picklist,
    dispatch,
    navigation,
    route,
    useEffectHook,
    getItemDetailsApi,
    getPicklistsApi,
    updatePicklistStatusApi,
    selectedTab,
    useCallbackHook,
    useFocusEffectHook,
    multiBinEnabled,
    multiPickEnabled,
    bottomSheetModalRef,
    pickingMenu,
    peteGetLocations
  } = props;

  const quickPickList = picklist.filter(item => item.quickPick);
  const pickBinList = picklist.filter(
    item => !item.quickPick
      && (item.status === PickStatus.ACCEPTED_BIN
        || item.status === PickStatus.ACCEPTED_PICK
        || item.status === PickStatus.READY_TO_BIN
        || item.status === PickStatus.READY_TO_PICK)
  );
  const salesFloorList = picklist.filter(
    item => !item.quickPick && item.status === PickStatus.READY_TO_WORK
  );

  // Scanner listener
  useEffectHook(() => {
    barcodeEmitterHook(
      barcodeEmitter,
      navigation,
      route,
      dispatch,
      selectedTab
    );
  }, []);

  // Get Picklist Api call
  useFocusEffectHook(
    useCallbackHook(() => {
      validateSession(navigation, route.name).then(() => {
        dispatch(getPicklists());
      });
    }, [navigation])
  );

  // Get Item Details UPC api
  useEffectHook(
    () => getItemDetailsApiHook(
      getItemDetailsApi,
      dispatch,
      navigation,
      peteGetLocations
    ),
    [getItemDetailsApi]
  );

  // Get Picklist Api Hook
  useEffectHook(
    () => getPicklistApiHook(getPicklistsApi, dispatch, navigation.isFocused()),
    [getPicklistsApi]
  );

  useEffectHook(
    () => updatePicklistStatusApiHook(
      updatePicklistStatusApi,
      dispatch,
      navigation.isFocused(),
      multiBinEnabled,
      multiPickEnabled
    ),
    [updatePicklistStatusApi]
  );

  // Cancel multi Pick/Bin when pressing back from the device hardware
  useFocusEffectHook(() => {
    backHandlerEventHook(
      BackHandler,
      multiBinEnabled,
      multiPickEnabled,
      dispatch
    );
  });

  useEffectHook(() => {
    if (bottomSheetModalRef.current) {
      if (pickingMenu) {
        bottomSheetModalRef.current.present();
      } else {
        bottomSheetModalRef.current.dismiss();
      }
    }
  }, [pickingMenu]);

  return (
    <Tab.Navigator
      initialRouteName={selectedTab}
      screenOptions={{
        tabBarActiveTintColor: COLOR.MAIN_THEME_COLOR,
        tabBarInactiveTintColor: COLOR.GREY_700,
        tabBarItemStyle: styles.tabBarStyle,
        swipeEnabled: !multiBinEnabled && !multiPickEnabled
      }}
      screenListeners={{
        tabPress: tabEvent => {
          if (multiBinEnabled || multiPickEnabled) {
            tabEvent.preventDefault();
          }
        },
        beforeRemove: () => {
          dispatch(showPickingMenu(false));
        }
      }}
    >
      <Tab.Screen
        name={Tabs.QUICKPICK}
        options={getTabScreenOptions(
          'QUICKPICK',
          strings('PICKING.QUICKPICK'),
          quickPickList.length
        )}
        listeners={{
          focus: () => dispatch(setSelectedTab(Tabs.QUICKPICK))
        }}
      >
        {() => (
          <QuickPickTab
            quickPickItems={quickPickList}
            refreshing={getPicklistsApi.isWaiting}
            onRefresh={() => dispatch(getPicklists())}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name={Tabs.PICK}
        options={getTabScreenOptions(
          'PICK',
          strings('PICKING.PICK'),
          pickBinList.length
        )}
        listeners={{
          focus: () => dispatch(setSelectedTab(Tabs.PICK)),
          beforeRemove: () => {
            // Reset Picking Tabs to PickBinWorkflow when the navigator is removed from the stack history
            dispatch(setSelectedTab(Tabs.PICK));
            dispatch(resetMultiPickBinSelection());
          }
        }}
      >
        {() => (
          <PickBinTab
            pickBinList={pickBinList}
            refreshing={getPicklistsApi.isWaiting}
            onRefresh={() => dispatch(getPicklists())}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name={Tabs.SALESFLOOR}
        options={getTabScreenOptions(
          'SALESFLOOR',
          strings('ITEM.SALES_FLOOR_QTY'),
          salesFloorList.length
        )}
        listeners={{
          focus: () => dispatch(setSelectedTab(Tabs.SALESFLOOR))
        }}
      >
        {() => (
          <SalesFloorTab
            readyToWorklist={salesFloorList}
            refreshing={getPicklistsApi.isWaiting}
            onRefresh={() => dispatch(getPicklists())}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export const BottomSheetCard = (
  props: BottomSheetCardProps
): React.JSX.Element => {
  const { text, onPress } = props;

  return (
    <BottomSheetView style={styles.sheetContainer}>
      <TouchableOpacity style={styles.touchableOpacity} onPress={onPress}>
        <BottomSheetView style={styles.textView}>
          <Text style={styles.text}>{text}</Text>
        </BottomSheetView>
      </TouchableOpacity>
    </BottomSheetView>
  );
};

export const PickingTabs = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { multiBinEnabled, multiPickEnabled, pickList } = useTypedSelector(
    state => state.Picking
  );
  const { multiBin, multiPick, inProgress } = useTypedSelector(
    state => state.User.configs
  );
  const getPicklistApi = useTypedSelector(state => state.async.getPicklists);
  const getItemDetailsApi = useTypedSelector(
    state => state.async.getItemDetailsV4
  );
  const updatePicklistStatusApi = inProgress
    ? useTypedSelector(state => state.async.updatePicklistStatusV1)
    : useTypedSelector(state => state.async.updatePicklistStatus);
  const selectedTab = useTypedSelector(state => state.Picking.selectedTab);
  const pickingMenu = useTypedSelector(state => state.Picking.pickingMenu);
  const { peteGetLocations } = useTypedSelector(state => state.User.configs);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const navigation = useNavigation();
  const route = useRoute();
  const snapPoints = useMemo(
    () => [`${10 + (multiBin ? 8 : 0) + (multiPick ? 8 : 0)}%`],
    []
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );
  return (
    <BottomSheetModalProvider>
      <PickingTabNavigator
        picklist={pickList}
        dispatch={dispatch}
        navigation={navigation}
        route={route}
        useEffectHook={useEffect}
        getItemDetailsApi={getItemDetailsApi}
        getPicklistsApi={getPicklistApi}
        updatePicklistStatusApi={updatePicklistStatusApi}
        selectedTab={selectedTab}
        useCallbackHook={useCallback}
        useFocusEffectHook={useFocusEffect}
        bottomSheetModalRef={bottomSheetModalRef}
        pickingMenu={pickingMenu}
        multiBinEnabled={multiBinEnabled}
        multiPickEnabled={multiPickEnabled}
        peteGetLocations={peteGetLocations}
      />
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        style={styles.bottomSheetModal}
        backdropComponent={renderBackdrop}
        onDismiss={() => dispatch(showPickingMenu(false))}
      >
        {multiBin && (
          <BottomSheetCard
            onPress={() => {
              dispatch(toggleMultiBin(true));
              dispatch(showPickingMenu(false));
            }}
            text={strings('PICKING.ACCEPT_MULTIPLE_BINS')}
          />
        )}
        {multiPick && (
          <BottomSheetCard
            onPress={() => {
              dispatch(toggleMultiPick(true));
              dispatch(showPickingMenu(false));
            }}
            text={strings('PICKING.ACCEPT_MULTIPLE_PICKS')}
          />
        )}
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default PickingTabs;
