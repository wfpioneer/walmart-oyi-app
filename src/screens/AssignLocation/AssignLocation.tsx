import React, { EffectCallback, useEffect, useState } from 'react';
import {
  FlatList, Pressable, Text, View
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  NavigationProp, RouteProp, useNavigation, useRoute
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
  deletePicks: boolean;
  setDeletePicks: React.Dispatch<React.SetStateAction<boolean>>;
}
const ItemSeparator = () => <View style={styles.separator} />;

export const binningItemCardReadOnly = (
  { item }: { item: BinningPallet },
) => {
  const firstItem = head(item.items);
  return (
    <BinningItemCard
      palletId={item.id}
      itemDesc={firstItem ? firstItem.itemDesc : ''}
      lastLocation={item.lastLocation}
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
  setDeletePicks: React.Dispatch<React.SetStateAction<boolean>>
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
            }, [[], []]
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
              updatePicklistItemsStatus(selectedPicks, PickAction.DELETE, dispatch);
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
    palletsToBin, isManualScanEnabled, useEffectHook, pickingState,
    navigation, dispatch, route, scannedEvent, binPalletsApi, updatePicklistStatusApi, deletePicks, setDeletePicks
  } = props;
  const selectedPicks = pickingState.pickList.filter(pick => pickingState.selectedPicks.includes(pick.id));

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
          trackEvent('bin_location_scanned', {
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
    setDeletePicks
  ), [binPalletsApi]);

  useEffectHook(() => (
    navigation.addListener('beforeRemove', () => {
      if (route.params && route.params.source && route.params.source === 'picking') {
        dispatch(clearPallets());
      }
    })
  ), [navigation]);

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
      {isManualScanEnabled && (
        <ManualScanComponent
          placeholder={strings('LOCATION.MANUAL_ENTRY_BUTTON')}
          keyboardType="default"
        />
      )}
      <FlatList
        data={palletsToBin}
        renderItem={item => binningItemCardReadOnly(item)}
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
  const palletsToBin = useTypedSelector(state => state.Binning.pallets);
  const scannedEvent = useTypedSelector(state => state.Global.scannedEvent);
  const binPalletsApi = useTypedSelector(state => state.async.binPallets);
  const updatePicklistStatusApi = useTypedSelector(state => state.async.updatePicklistStatus);
  const [deletePicks, setDeletePicks] = useState(false);

  return (
    <AssignLocationScreen
      palletsToBin={palletsToBin}
      isManualScanEnabled={isManualScanEnabled}
      useEffectHook={useEffect}
      dispatch={dispatch}
      navigation={navigation}
      route={route}
      scannedEvent={scannedEvent}
      binPalletsApi={binPalletsApi}
      pickingState={pickingState}
      updatePicklistStatusApi={updatePicklistStatusApi}
      deletePicks={deletePicks}
      setDeletePicks={setDeletePicks}
    />
  );
}

export default AssignLocation;
