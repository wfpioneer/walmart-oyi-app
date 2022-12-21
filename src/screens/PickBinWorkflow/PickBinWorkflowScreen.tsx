import React, {
  Dispatch, EffectCallback, useEffect, useMemo, useRef, useState
} from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import {
  NavigationProp, useNavigation
} from '@react-navigation/native';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import BottomSheetPrintCard from '../../components/BottomSheetPrintCard/BottomSheetPrintCard';
import { COLOR } from '../../themes/Color';
import Button, { ButtonType } from '../../components/buttons/Button';
import PickPalletInfoCard from '../../components/PickPalletInfoCard/PickPalletInfoCard';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { PickingState } from '../../state/reducers/Picking';
import { PickAction, PickListItem, PickStatus } from '../../models/Picking.d';
import { strings } from '../../locales';
import styles from './PickBinWorkflow.style';
import { AsyncState } from '../../models/AsyncState';
import {
  UPDATE_PALLET_NOT_FOUND,
  UPDATE_PICKLIST_STATUS
} from '../../state/actions/asyncAPI';
import { updatePalletNotFound, updatePicklistStatus } from '../../state/actions/saga';
import { addPallet, clearPallets } from '../../state/actions/Binning';
import { showPickingMenu, updatePicks } from '../../state/actions/Picking';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { CustomModalComponent } from '../Modal/Modal';
import { SNACKBAR_TIMEOUT, SNACKBAR_TIMEOUT_LONG } from '../../utils/global';
import { setPrintingPalletLabel } from '../../state/actions/Print';
import { setupPallet } from '../../state/actions/PalletManagement';
import { Pallet } from '../../models/PalletManagementTypes';
import { trackEvent } from '../../utils/AppCenterTool';

interface PBWorkflowProps {
  userFeatures: string[];
  userId: string;
  pickingState: PickingState;
  updatePicklistStatusApi: AsyncState;
  updatePalletNotFoundApi: AsyncState;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  selectedPicklistAction: PickAction | null;
  setSelectedPicklistAction: React.Dispatch<React.SetStateAction<PickAction|null>>;
  showContinueActionDialog: boolean;
  setShowContinueActionDialog: React.Dispatch<React.SetStateAction<boolean>>;
  trackEventCall: typeof trackEvent;
}

interface ContinueActionDialogProps {
  showContinueActionDialog: boolean,
  setShowContinueActionDialog: React.Dispatch<React.SetStateAction<boolean>>;
  dispatch: Dispatch<any>;
  items: PickListItem[];
  setSelectedPicklistAction: React.Dispatch<React.SetStateAction<PickAction|null>>;
  trackEventCall: typeof trackEvent;
}

const resetApis = (dispatch: Dispatch<any>) => {
  dispatch({ type: UPDATE_PICKLIST_STATUS.RESET });
};

export const updatePicklistStatusApiHook = (
  updatePicklistStatusApi: AsyncState,
  items: PickListItem[],
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  selectedPicklistAction: PickAction|null,
  userId: string
) => {
  // on api success
  if (!updatePicklistStatusApi.isWaiting && updatePicklistStatusApi.result
    && updatePicklistStatusApi.result.status === 200) {
    if (selectedPicklistAction === PickAction.ACCEPT_PICK || selectedPicklistAction === PickAction.ACCEPT_BIN) {
      const updatedStatus = selectedPicklistAction === PickAction.ACCEPT_PICK
        ? PickStatus.ACCEPTED_PICK : PickStatus.ACCEPTED_BIN;
      const updatedItems = items.map(item => ({
        ...item,
        status: updatedStatus,
        assignedAssociate: userId
      }));
      dispatch(updatePicks(updatedItems));
    } else {
      navigation.goBack();
    }
    Toast.show({
      type: 'success',
      text1: strings('PICKING.UPDATE_PICKLIST_STATUS_SUCCESS'),
      visibilityTime: 4000,
      position: 'bottom'
    });
    dispatch(hideActivityModal());
    resetApis(dispatch);
  }
  // on api error
  if (!updatePicklistStatusApi.isWaiting && updatePicklistStatusApi.error) {
    dispatch(hideActivityModal());
    Toast.show({
      type: 'error',
      text1: strings('PICKING.UPDATE_PICKLIST_STATUS_ERROR'),
      text2: strings('GENERICS.TRY_AGAIN'),
      visibilityTime: 4000,
      position: 'bottom'
    });
    resetApis(dispatch);
  }
  // on api request
  if (updatePicklistStatusApi.isWaiting) {
    dispatch(showActivityModal());
  }
};

export const updatePalletNotFoundApiHook = (
  updatePalletNotFoundApi: AsyncState,
  items: PickListItem[],
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
) => {
  // on api success
  if (navigation.isFocused()) {
    if (!updatePalletNotFoundApi.isWaiting && updatePalletNotFoundApi.result
      && updatePalletNotFoundApi.result.status === 200) {
      dispatch(hideActivityModal());
      const { message } = updatePalletNotFoundApi.result.data;
      if (message === 'AT_LEAST_ONE_PICK_CREATED' && items.length > 1) {
        Toast.show({
          type: 'success',
          text1: strings('PICKING.NEW_PICK_ADDED_TO_PICKLIST_PLURAL'),
          visibilityTime: SNACKBAR_TIMEOUT,
          position: 'bottom'
        });
      } else if (message === 'AT_LEAST_ONE_PICK_CREATED') {
        Toast.show({
          type: 'success',
          text1: strings('PICKING.NEW_PICK_ADDED_TO_PICKLIST'),
          visibilityTime: SNACKBAR_TIMEOUT,
          position: 'bottom'
        });
      } else {
        Toast.show({
          type: 'success',
          text1: strings('PICKING.NO_PALLETS_AVAILABLE_PICK_DELETED'),
          visibilityTime: SNACKBAR_TIMEOUT_LONG,
          position: 'bottom'
        });
      }
      dispatch({ type: UPDATE_PALLET_NOT_FOUND.RESET });
      navigation.goBack();
    }
    // on api error
    if (!updatePalletNotFoundApi.isWaiting && updatePalletNotFoundApi.error) {
      dispatch(hideActivityModal());
      if (items.length > 1) {
        Toast.show({
          type: 'error',
          text1: strings('PICKING.UPDATE_PICK_FAILED_TRY_AGAIN_PLURAL'),
          text2: strings('GENERICS.TRY_AGAIN'),
          visibilityTime: SNACKBAR_TIMEOUT,
          position: 'bottom'
        });
      } else {
        Toast.show({
          type: 'error',
          text1: strings('PICKING.UPDATE_PICK_FAILED_TRY_AGAIN'),
          text2: strings('GENERICS.TRY_AGAIN'),
          visibilityTime: SNACKBAR_TIMEOUT,
          position: 'bottom'
        });
      }
      dispatch({ type: UPDATE_PALLET_NOT_FOUND.RESET });
    }
    // on api request
    if (updatePalletNotFoundApi.isWaiting) {
      dispatch(showActivityModal());
    }
  }
};

export const updatePicklistItemsStatus = (
  items: PickListItem[],
  action: PickAction,
  dispatch: Dispatch<any>,
  trackEventCall: typeof trackEvent
) => {
  const picklistItems = items.map(item => ({
    picklistId: item.id,
    locationId: item.palletLocationId,
    locationName: item.palletLocationName,
    palletId: item.palletId
  }));
  trackEventCall('PickBinWorklow_Screen', {
    event: 'update_picklist_status_action',
    action,
    picklistItems
  });
  dispatch(updatePicklistStatus({
    headers: {
      action
    },
    picklistItems
  }));
};

export const ContinueActionDialog = (props: ContinueActionDialogProps) => {
  const {
    showContinueActionDialog, setShowContinueActionDialog, dispatch, items, setSelectedPicklistAction, trackEventCall
  } = props;
  // Continue Action handler
  const handleContinueAction = (action: PickAction) => {
    setShowContinueActionDialog(false);
    setSelectedPicklistAction(action);
    updatePicklistItemsStatus(items, action, dispatch, trackEventCall);
  };

  const handlePalletNotFound = () => {
    const { palletId } = items[0];
    const picklistIds = items.map(item => item.id);
    setShowContinueActionDialog(false);
    trackEventCall('PickBinWorklow_Screen', {
      event: 'update_pallet_not_found_action',
      palletId,
      picklistIds
    });
    dispatch(updatePalletNotFound({ palletId, picklistIds }));
  };

  return (
    <CustomModalComponent
      isVisible={showContinueActionDialog}
      onClose={() => {
        trackEventCall('PickBinWorklow_Screen', {
          action: 'close_continue_dialog_action'
        });
        setShowContinueActionDialog(false);
      }}
      modalType="Popup"
    >
      <>
        <View style={styles.continueActionHeader}>
          <Text>{strings('PICKING.SELECT_CONTINUE_ACTION')}</Text>
        </View>
        <View style={styles.picklistActionView}>
          <Button
            style={styles.picklistActionButton}
            title={strings('PICKING.READY_TO_WORK')}
            type={ButtonType.PRIMARY}
            onPress={() => handleContinueAction(PickAction.READY_TO_WORK)}
          />
          <Button
            style={styles.picklistActionButton}
            title={strings('PICKING.COMPLETE')}
            type={ButtonType.PRIMARY}
            onPress={() => handleContinueAction(PickAction.COMPLETE)}
          />
          <Button
            style={styles.picklistActionButton}
            title={strings('PICKING.PALLET_NOT_FOUND')}
            type={ButtonType.PRIMARY}
            onPress={() => handlePalletNotFound()}
          />
          <Button
            style={styles.picklistActionButton}
            title={strings('GENERICS.CANCEL')}
            titleColor={COLOR.MAIN_THEME_COLOR}
            type={ButtonType.SOLID_WHITE}
            onPress={() => {
              trackEventCall('PickBinWorklow_Screen', {
                action: 'close_continue_dialog_action'
              });
              setShowContinueActionDialog(false);
            }}
          />
        </View>
      </>
    </CustomModalComponent>
  );
};

export const PickBinWorkflowScreen = (props: PBWorkflowProps) => {
  const {
    userFeatures, userId, pickingState, updatePicklistStatusApi, useEffectHook, dispatch, navigation,
    selectedPicklistAction, setSelectedPicklistAction, showContinueActionDialog,
    setShowContinueActionDialog, updatePalletNotFoundApi, trackEventCall
  } = props;

  const selectedPicks = pickingState.pickList.filter(pick => pickingState.selectedPicks.includes(pick.id));

  useEffectHook(() => updatePicklistStatusApiHook(
    updatePicklistStatusApi,
    selectedPicks,
    dispatch,
    navigation,
    selectedPicklistAction,
    userId
  ), [updatePicklistStatusApi]);

  useEffectHook(() => updatePalletNotFoundApiHook(
    updatePalletNotFoundApi,
    selectedPicks,
    dispatch,
    navigation,
  ), [updatePalletNotFoundApi]);

  const handleAccept = (items: PickListItem[]) => {
    const { status } = items[0];
    const action = status === PickStatus.READY_TO_PICK ? PickAction.ACCEPT_PICK : PickAction.ACCEPT_BIN;
    setSelectedPicklistAction(action);
    trackEventCall('PickBinWorkflow_Screen', { action: 'accept_selected_picklist_click' });
    updatePicklistItemsStatus(items, action, dispatch, trackEventCall);
  };

  const handleRelease = (items: PickListItem[]) => {
    const action = PickAction.RELEASE;
    trackEventCall('PickBinWorkflow_Screen', { action: 'release_selected_picks_click' });
    setSelectedPicklistAction(action);
    updatePicklistItemsStatus(items, action, dispatch, trackEventCall);
  };

  const handleBin = (items: PickListItem[]) => {
    const { palletId, palletLocationName } = items[0];

    const palletDetails = {
      id: palletId,
      lastLocation: palletLocationName,
      items: items.map(item => ({
        itemNbr: item.itemNbr,
        itemDesc: item.itemDesc,
        upcNbr: item.upcNbr
      }))
    };
    dispatch(clearPallets());
    trackEventCall('PickBinWorkflow_Screen', { action: 'bin_selected_picklist_click', palletDetails });
    dispatch(addPallet(palletDetails));
    navigation.navigate('Binning', {
      screen: 'AssignLocation',
      params: {
        source: 'picking'
      }
    });
  };

  const actionButtonsView = () => {
    const { status } = selectedPicks[0];
    const isMine = selectedPicks[0].assignedAssociate === userId;

    const amManager = userFeatures.includes('manager approval');
    const releaseButton = (status === PickStatus.ACCEPTED_BIN || status === PickStatus.ACCEPTED_PICK)
      && (isMine || amManager) ? (
        <Button
          title={strings('PICKING.RELEASE')}
          onPress={() => handleRelease(selectedPicks)}
          style={styles.actionButton}
          key="release"
        />
      ) : null;

    const isReady = status === PickStatus.READY_TO_BIN || status === PickStatus.READY_TO_PICK;
    const acceptButton = isReady ? (
      <Button
        title={strings('PICKING.ACCEPT')}
        onPress={() => handleAccept(selectedPicks)}
        style={styles.actionButton}
        key="accept"
      />
    ) : null;

    const continueButton = status === PickStatus.ACCEPTED_PICK && isMine ? (
      <Button
        title={strings('GENERICS.CONTINUE')}
        onPress={() => setShowContinueActionDialog(true)}
        style={styles.actionButton}
        key="continue"
      />
    ) : null;

    const binButton = isMine && status === PickStatus.ACCEPTED_BIN ? (
      <Button
        title={strings('PICKING.BIN')}
        onPress={() => handleBin(selectedPicks)}
        style={styles.actionButton}
        key="continue"
      />
    ) : null;

    const buttonList: Array<JSX.Element | null> = [
      releaseButton,
      acceptButton,
      continueButton,
      binButton
    ];
    return buttonList;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ContinueActionDialog
        showContinueActionDialog={showContinueActionDialog}
        setShowContinueActionDialog={setShowContinueActionDialog}
        dispatch={dispatch}
        items={selectedPicks}
        setSelectedPicklistAction={setSelectedPicklistAction}
        trackEventCall={trackEventCall}
      />
      {selectedPicks.length > 0 ? (
        <>
          <PickPalletInfoCard
            onPress={() => {}}
            palletId={selectedPicks[0].palletId}
            palletLocation={selectedPicks[0].palletLocationName}
            pickListItems={selectedPicks}
            pickStatus={selectedPicks[0].status}
            canDelete={false}
            dispatch={dispatch}
            showCheckbox={false}
          />
          <View style={styles.actionButtonsView}>
            {actionButtonsView()}
          </View>
        </>
      ) : null}
    </SafeAreaView>
  );
};

const PickBinWorkflow = () => {
  const userFeatures = useTypedSelector(state => state.User.features);
  const userId = useTypedSelector(state => state.User.userId);
  const picking = useTypedSelector(state => state.Picking);
  const updatePicklistStatusApi = useTypedSelector(state => state.async.updatePicklistStatus);
  const updatePalletNotFoundApi = useTypedSelector(state => state.async.updatePalletNotFound);
  const [selectedPicklistAction, setSelectedPicklistAction] = useState<PickAction|null>(null);
  const [showContinueActionDialog, setShowContinueActionDialog] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigation: NavigationProp<any> = useNavigation();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['21%'], []);

  useEffect(() => {
    if (navigation.isFocused() && bottomSheetModalRef.current) {
      if (picking.pickingMenu) {
        bottomSheetModalRef.current.present();
      } else {
        bottomSheetModalRef.current.dismiss();
      }
    }
  }, [picking.pickingMenu]);

  const handlePrintPallet = () => {
    dispatch(showPickingMenu(false));
    bottomSheetModalRef.current?.dismiss();
    const selectedPicks = picking.pickList.filter(pick => picking.selectedPicks.includes(pick.id));
    const palletDetails: Pallet = {
      palletInfo: {
        id: selectedPicks[0].palletId
      },
      items: []
    };
    trackEvent('PickBinWorkflow_Screen', {
      action: 'print_pallet_label_action',
      palletDetails
    });
    dispatch(setupPallet(palletDetails));
    dispatch(setPrintingPalletLabel());
    navigation.navigate('PrintPriceSign');
  };

  return (
    <BottomSheetModalProvider>
      <TouchableOpacity
        onPress={() => dispatch(showPickingMenu(!picking.pickingMenu))}
        activeOpacity={1}
        disabled={!picking.pickingMenu}
        style={picking.pickingMenu ? styles.disabledContainer : styles.safeAreaView}
      >
        <PickBinWorkflowScreen
          userFeatures={userFeatures}
          userId={userId}
          pickingState={picking}
          updatePicklistStatusApi={updatePicklistStatusApi}
          updatePalletNotFoundApi={updatePalletNotFoundApi}
          useEffectHook={useEffect}
          dispatch={dispatch}
          navigation={navigation}
          selectedPicklistAction={selectedPicklistAction}
          setSelectedPicklistAction={setSelectedPicklistAction}
          showContinueActionDialog={showContinueActionDialog}
          setShowContinueActionDialog={setShowContinueActionDialog}
          trackEventCall={trackEvent}
        />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          index={0}
          style={styles.bottomSheetModal}
          onDismiss={() => dispatch(showPickingMenu(false))}
        >
          <BottomSheetPrintCard
            isVisible={true}
            onPress={handlePrintPallet}
            text={strings('PALLET.PRINT_PALLET')}
          />
        </BottomSheetModal>
      </TouchableOpacity>
    </BottomSheetModalProvider>
  );
};

export default PickBinWorkflow;
