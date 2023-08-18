import React, {
  EffectCallback,
  useCallback,
  useEffect,
  useState
} from 'react';
import {
  BackHandler,
  FlatList, Pressable, Text, View
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  NavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute
} from '@react-navigation/native';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import { head } from 'lodash';
import Config from 'react-native-config';
import ManualScanComponent from '../../components/manualscan/ManualScan';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { resetScannedEvent, setScannedEvent } from '../../state/actions/Global';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { clearPallets, deletePallet } from '../../state/actions/Binning';
import { binPallets } from '../../state/actions/saga';
import { POST_BIN_PALLETS, UPDATE_PICKLIST_STATUS } from '../../state/actions/asyncAPI';
import { BinningPallet } from '../../models/Binning';
import { AsyncState } from '../../models/AsyncState';
import {
  BinPalletResponse, BinPicklistInfo, PickAction, PickListItem, picklistActionType
} from '../../models/Picking.d';
import { PostBinPalletsMultistatusResponse } from '../../services/PalletManagement.service';
import { trackEvent } from '../../utils/AppCenterTool';
import { barcodeEmitter, openCamera } from '../../utils/scannerUtils';
import { SNACKBAR_TIMEOUT, SNACKBAR_TIMEOUT_LONG } from '../../utils/global';
import { validateSession } from '../../utils/sessionTimeout';
import { strings } from '../../locales';
import styles from './AssignLocation.style';
import COLOR from '../../themes/Color';
import BinningItemCard from '../../components/BinningItemCard/BinningItemCard';
import { cleanScanIfUpcOrEanBarcode } from '../../utils/barcodeUtils';
import { PickingState } from '../../state/reducers/Picking';
import { updatePicklistItemsStatus } from '../PickBinWorkflow/PickBinWorkflowScreen';
import { Configurations } from '../../models/User';
import { UseStateType } from '../../models/Generics.d';
import {
  backConfirmed,
  backConfirmedHook,
  navigationRemoveListenerHook,
  onBinningItemPress
} from '../Binning/Binning';
import { renderUnsavedWarningModal } from '../../components/UnsavedWarningModal/UnsavedWarningModal';

interface AssignLocationProps {
  palletsToBin: BinningPallet[];
  isManualScanEnabled: boolean;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  dispatch: Dispatch<any>;
  scannedEvent: { value: string | null; type: string | null };
  binPalletsApi: AsyncState;
  pickingState: PickingState;
  updatePicklistStatusApi: AsyncState;
  trackEventCall: typeof trackEvent;
  userConfigs: Configurations;
  deletePicksState: UseStateType<boolean>;
  displayWarningModalState: UseStateType<boolean>;
  useFocusEffectHook: typeof useFocusEffect;
  useCallbackHook: typeof useCallback;
  enableMultiPalletBin: boolean;
}
const ItemSeparator = () => <View style={styles.separator} />;

export const onValidateHardwareBackPress = (
  setDisplayWarningModal: UseStateType<boolean>[1],
  scannedPallets: BinningPallet[],
  enableMultiPalletBin: boolean
) => {
  if (!enableMultiPalletBin && scannedPallets.length > 0) {
    setDisplayWarningModal(true);
    return true;
  }
  return false;
};

export const binningItemCard = (
  { item }: { item: BinningPallet },
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  trackEventCall: typeof trackEvent,
  enableMultiPalletBin: boolean
) => {
  const firstItem = head(item.items);
  return (
    <BinningItemCard
      palletId={item.id}
      itemDesc={firstItem ? firstItem.itemDesc : ''}
      lastLocation={item.lastLocation}
      onClick={() => !enableMultiPalletBin && onBinningItemPress(item, dispatch, navigation, trackEventCall)}
    />
  );
};

export const updatePicklistStatusApiHook = (
  updatePicklistStatusApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  deletePicks: boolean,
  setDeletePicks: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (navigation.isFocused()) {
    if (deletePicks) {
      // on api success
      if (!updatePicklistStatusApi.isWaiting && updatePicklistStatusApi.result
  && updatePicklistStatusApi.result.status === 200) {
        dispatch(hideActivityModal());
        Toast.show({
          type: 'error',
          text1: strings('PICKING.NO_PALLETS_AVAILABLE_PICK_DELETED'),
          visibilityTime: SNACKBAR_TIMEOUT_LONG,
          position: 'bottom'
        });
        setDeletePicks(false);
        dispatch({ type: UPDATE_PICKLIST_STATUS.RESET });
        navigation.navigate('PickingTabs');
      }
      // on api error
      if (!updatePicklistStatusApi.isWaiting && updatePicklistStatusApi.error) {
        dispatch(hideActivityModal());
        Toast.show({
          type: 'error',
          text1: strings('PICKING.UPDATE_PICKLIST_STATUS_ERROR'),
          text2: strings('GENERICS.TRY_AGAIN'),
          visibilityTime: SNACKBAR_TIMEOUT_LONG,
          position: 'bottom'
        });
        dispatch({ type: UPDATE_PICKLIST_STATUS.RESET });
      }
      // on api request
      if (updatePicklistStatusApi.isWaiting) {
        dispatch(showActivityModal());
      }
    }
  }
};

export const getFailedPallets = (data: PostBinPalletsMultistatusResponse): string[] => data.binSummary
  .reduce((failIds: string[], currentResponse) => (currentResponse.status === 200
    ? failIds
    : [...failIds, currentResponse.palletId]), []);

export const binPalletsApiEffect = (
  navigation: NavigationProp<any>,
  binPalletsApi: AsyncState,
  dispatch: Dispatch<any>,
  route: RouteProp<any, string>,
  selectedPicks: PickListItem[],
  setDeletePicks: React.Dispatch<React.SetStateAction<boolean>>,
  inProgress: boolean
) => {
  if (navigation.isFocused()) {
    if (!binPalletsApi.isWaiting) {
      // Success
      if (binPalletsApi.result) {
        if (binPalletsApi.result.status === 200) {
          const { data } = binPalletsApi.result;
          const updatedPicklists: BinPicklistInfo[] = data && data.binSummary ? data.binSummary.flatMap(
            (item: BinPalletResponse) => item.picklists.map(picklist => picklist)
          ) : [];
          const [completedPicks, locationUpdatedPicks] = updatedPicklists.reduce(
            (acc: [BinPicklistInfo[], BinPicklistInfo[]], item) => {
              if (item.picklistActionType === picklistActionType.COMPLETE) {
                acc[0].push(item);
              } else if (item.picklistActionType === picklistActionType.UPDATE_LOCATION) {
                acc[1].push(item);
              }
              return acc;
            },
            [[], []]
          );
          if (completedPicks.length > 0 && locationUpdatedPicks.length === 0) {
            if (completedPicks.length === 1) {
              Toast.show({
                type: 'success',
                position: 'bottom',
                text1: strings('PICKING.PICK_COMPLETED'),
                visibilityTime: SNACKBAR_TIMEOUT
              });
            } else {
              Toast.show({
                type: 'success',
                position: 'bottom',
                text1: strings('PICKING.PICK_COMPLETED_PLURAL'),
                visibilityTime: SNACKBAR_TIMEOUT
              });
            }
          } else if (locationUpdatedPicks.length > 0 && completedPicks.length === 0) {
            Toast.show({
              type: 'success',
              position: 'bottom',
              text1: strings('PICKING.PICKLIST_UPDATED'),
              visibilityTime: SNACKBAR_TIMEOUT
            });
          } else if (completedPicks.length > 0 && locationUpdatedPicks.length > 0) {
            if (completedPicks.length === 1) {
              Toast.show({
                type: 'success',
                position: 'bottom',
                text1: strings('PICKING.PICK_COMPLETED_AND_PICKLIST_UPDATED'),
                visibilityTime: SNACKBAR_TIMEOUT_LONG
              });
            } else {
              Toast.show({
                type: 'success',
                position: 'bottom',
                text1: strings('PICKING.PICK_COMPLETED_AND_PICKLIST_UPDATED_PLURAL'),
                visibilityTime: SNACKBAR_TIMEOUT_LONG
              });
            }
          } else {
            Toast.show({
              type: 'success',
              position: 'bottom',
              text1: strings('BINNING.PALLET_BIN_SUCCESS'),
              visibilityTime: SNACKBAR_TIMEOUT
            });
          }

          dispatch(clearPallets());
          dispatch({ type: POST_BIN_PALLETS.RESET });
          if (route.params && route.params.source === 'picking') {
            navigation.navigate('PickingTabs');
          } else {
            navigation.goBack();
          }
          dispatch(hideActivityModal());
        } else if (binPalletsApi.result.status === 207) {
          const failedPallets = getFailedPallets(binPalletsApi.result.data as PostBinPalletsMultistatusResponse);
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: strings('BINNING.PALLET_BIN_PARTIAL', { number: failedPallets.length }),
            visibilityTime: SNACKBAR_TIMEOUT_LONG
          });

          failedPallets.forEach(palletId => dispatch(deletePallet(palletId)));
          dispatch({ type: POST_BIN_PALLETS.RESET });
          dispatch(hideActivityModal());
        }
      }

      // Fail
      if (binPalletsApi.error) {
        const errorResponse = binPalletsApi.error;
        if (errorResponse.status === 409) {
          if (errorResponse.message.includes('not ready to bin, pallet part of an active pick')) {
            Toast.show({
              position: 'bottom',
              type: 'error',
              text1: strings('BINNING.PALLET_NOT_READY'),
              visibilityTime: SNACKBAR_TIMEOUT
            });
          } else if (errorResponse.message.includes('PALLET_NOT_FOUND')) {
            if (route.params?.source === 'picking') {
              setDeletePicks(true);
              updatePicklistItemsStatus(selectedPicks, PickAction.DELETE, dispatch, trackEvent, inProgress);
            } else {
              Toast.show({
                position: 'bottom',
                type: 'error',
                text1: strings('LOCATION.PALLET_NOT_FOUND'),
                visibilityTime: SNACKBAR_TIMEOUT
              });
            }
          } else {
            Toast.show({
              position: 'bottom',
              type: 'error',
              text1: strings('LOCATION.SECTION_NOT_FOUND'),
              visibilityTime: SNACKBAR_TIMEOUT
            });
          }
          dispatch(hideActivityModal());
        } else {
          Toast.show({
            position: 'bottom',
            type: 'error',
            text1: strings('BINNING.PALLET_BIN_FAILURE'),
            visibilityTime: SNACKBAR_TIMEOUT
          });
          dispatch(hideActivityModal());
        }
        dispatch({ type: POST_BIN_PALLETS.RESET });
      }
    } else {
      dispatch(showActivityModal());
    }
  }
};

export function AssignLocationScreen(props: AssignLocationProps): JSX.Element {
  const {
    palletsToBin, isManualScanEnabled, useEffectHook, pickingState, navigation,
    dispatch, route, scannedEvent, binPalletsApi, updatePicklistStatusApi,
    deletePicksState, trackEventCall, userConfigs, displayWarningModalState,
    useCallbackHook, useFocusEffectHook, enableMultiPalletBin
  } = props;
  const selectedPicks = pickingState.pickList.filter(pick => pickingState.selectedPicks.includes(pick.id));
  const [displayWarningModal, setDisplayWarningModal] = displayWarningModalState;
  const [deletePicks, setDeletePicks] = deletePicksState;
  const palletExistForBinnning = !!palletsToBin.length;

  useEffectHook(() => {
    if (navigation.isFocused() && scannedEvent.value) {
      const searchValue = cleanScanIfUpcOrEanBarcode(scannedEvent);
      dispatch(binPallets({
        location: searchValue,
        pallets: palletsToBin.reduce((palletIds: string[], pallet) => [...palletIds, pallet.id], [])
      }));
    }
  }, [scannedEvent]);

  useEffectHook(() => {
    navigation.addListener('blur', () => {
      if (scannedEvent.value) {
        dispatch(resetScannedEvent());
      }
    });
    return () => {
      navigation.removeListener('blur', () => {});
    };
  }, [navigation, scannedEvent]);

  useEffectHook(() => {
    const scannerListener = barcodeEmitter.addListener('scanned', scan => {
      if (navigation.isFocused()) {
        validateSession(navigation, route.name).then(() => {
          trackEventCall('Binning_Screen', {
            action: 'bin_location_scanned',
            barcode: scan.value,
            type: scan.type
          });
          dispatch(setScannedEvent(scan));
        });
      }
    });

    return () => {
      scannerListener.remove();
    };
  }, []);

  // validation on app back press
  useEffectHook(() => {
    const navigationListener = navigation.addListener('beforeRemove', e => {
      navigationRemoveListenerHook(e, setDisplayWarningModal, enableMultiPalletBin, palletsToBin);
    });
    return navigationListener;
  }, [navigation, palletsToBin, enableMultiPalletBin]);

  useEffectHook(() => backConfirmedHook(
    displayWarningModal,
    palletExistForBinnning,
    setDisplayWarningModal,
    navigation
  ), [palletExistForBinnning, displayWarningModal]);

  // validation on Hardware backPress
  useFocusEffectHook(
    useCallbackHook(() => {
      const onHardwareBackPress = () => onValidateHardwareBackPress(
        setDisplayWarningModal,
        palletsToBin,
        enableMultiPalletBin
      );
      BackHandler.addEventListener('hardwareBackPress', onHardwareBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onHardwareBackPress);
    }, [])
  );

  useEffectHook(
    () => updatePicklistStatusApiHook(
      updatePicklistStatusApi,
      dispatch,
      navigation,
      deletePicks,
      setDeletePicks
    ),
    [updatePicklistStatusApi]
  );

  useEffectHook(() => binPalletsApiEffect(
    navigation,
    binPalletsApi,
    dispatch,
    route,
    selectedPicks,
    setDeletePicks,
    userConfigs.inProgress
  ), [binPalletsApi]);

  const scanTextView = () => (
    <View style={styles.scanView}>
      <Pressable onPress={() => {
        if (Config.ENVIRONMENT === 'dev' || Config.ENVIRONMENT === 'stage') {
          return openCamera();
        }
        return null;
      }}
      >
        <MaterialCommunityIcon
          name="barcode-scan"
          size={70}
          color={COLOR.MAIN_THEME_COLOR}
        />
      </Pressable>
      <Text style={styles.scanText}>
        {palletsToBin.length === 1
          ? strings('BINNING.SCAN_LOCATION')
          : strings('BINNING.SCAN_LOCATION_PLURAL')}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderUnsavedWarningModal(
        displayWarningModal,
        setDisplayWarningModal,
        strings('BINNING.WARNING_LABEL'),
        strings('BINNING.WARNING_DESCRIPTION'),
        () => backConfirmed(setDisplayWarningModal, dispatch, navigation)
      )}
      {isManualScanEnabled && (
        <ManualScanComponent
          placeholder={strings('LOCATION.MANUAL_ENTRY_BUTTON')}
          keyboardType="default"
        />
      )}
      <FlatList
        data={palletsToBin}
        renderItem={item => binningItemCard(item, dispatch, navigation, trackEventCall, enableMultiPalletBin)}
        removeClippedSubviews={false}
        ItemSeparatorComponent={ItemSeparator}
        keyExtractor={(item, index) => `${item.id}-${index}`}
      />
      {scanTextView()}
    </View>
  );
}

function AssignLocation(): JSX.Element {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const pickingState = useTypedSelector(state => state.Picking);
  const isManualScanEnabled = useTypedSelector(state => state.Global.isManualScanEnabled);
  const { pallets: palletsToBin, enableMultiplePalletBin } = useTypedSelector(state => state.Binning);
  const scannedEvent = useTypedSelector(state => state.Global.scannedEvent);
  const userConfigs = useTypedSelector(state => state.User.configs);
  const binPalletsApi = useTypedSelector(state => state.async.binPallets);
  const updatePicklistStatusApi = useTypedSelector(state => state.async.updatePicklistStatus);
  const deletePicksState = useState(false);
  const displayWarningModalState = useState(false);

  return (
    <AssignLocationScreen
      palletsToBin={palletsToBin}
      isManualScanEnabled={isManualScanEnabled}
      dispatch={dispatch}
      navigation={navigation}
      route={route}
      useEffectHook={useEffect}
      useCallbackHook={useCallback}
      useFocusEffectHook={useFocusEffect}
      scannedEvent={scannedEvent}
      binPalletsApi={binPalletsApi}
      pickingState={pickingState}
      updatePicklistStatusApi={updatePicklistStatusApi}
      trackEventCall={trackEvent}
      userConfigs={userConfigs}
      deletePicksState={deletePicksState}
      displayWarningModalState={displayWarningModalState}
      enableMultiPalletBin={enableMultiplePalletBin}
    />
  );
}

export default AssignLocation;
