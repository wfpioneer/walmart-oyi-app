import React, {
  Dispatch, EffectCallback, useEffect, useState
} from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import {
  NavigationProp, useNavigation
} from '@react-navigation/native';
import Button from '../../components/buttons/Button';
import PickPalletInfoCard from '../../components/PickPalletInfoCard/PickPalletInfoCard';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { PickingState } from '../../state/reducers/Picking';
import { PickAction, PickListItem, PickStatus } from '../../models/Picking.d';
import { strings } from '../../locales';
import styles from './PickBinWorkflow.style';
import { AsyncState } from '../../models/AsyncState';
import {
  UPDATE_PICKLIST_STATUS
} from '../../state/actions/asyncAPI';
import { updatePicklistStatus } from '../../state/actions/saga';
import { updatePicks } from '../../state/actions/Picking';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';

interface PBWorkflowProps {
  userFeatures: string[];
  userId: string;
  pickingState: PickingState;
  updatePicklistStatusApi: AsyncState;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  selectedPicklistAction: PickAction | null;
  setSelectedPicklistAction: React.Dispatch<React.SetStateAction<PickAction|null>>;
}

const resetApis = (dispatch: Dispatch<any>) => {
  dispatch({ type: UPDATE_PICKLIST_STATUS.RESET });
};

export const updatePicklistStatusApiHook = (
  updatePicklistStatusApi: AsyncState,
  items: PickListItem[],
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  selectedPicklistAction: PickAction|null
) => {
  // on api success
  if (!updatePicklistStatusApi.isWaiting && updatePicklistStatusApi.result
    && updatePicklistStatusApi.result.status === 200) {
    if (selectedPicklistAction === PickAction.ACCEPT_PICK || selectedPicklistAction === PickAction.ACCEPT_BIN) {
      const updatedStatus = PickAction.ACCEPT_PICK ? PickStatus.ACCEPTED_PICK : PickStatus.ACCEPTED_BIN;
      const updatedItems = items.map(item => ({
        ...item,
        status: updatedStatus
      }));
      dispatch(updatePicks(updatedItems));
    } else if (selectedPicklistAction === PickAction.RELEASE) {
      const { status } = items[0];
      const updatedStatus = status === PickStatus.ACCEPTED_BIN ? PickStatus.READY_TO_BIN : PickStatus.READY_TO_PICK;
      const updatedItems = items.map(item => ({
        ...item,
        status: updatedStatus
      }));
      dispatch(updatePicks(updatedItems));
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

export const PickBinWorkflowScreen = (props: PBWorkflowProps) => {
  const {
    userFeatures, userId, pickingState, updatePicklistStatusApi, useEffectHook, dispatch, navigation,
    selectedPicklistAction, setSelectedPicklistAction
  } = props;

  const selectedPicks = pickingState.pickList.filter(pick => pickingState.selectedPicks.includes(pick.id));

  useEffectHook(() => updatePicklistStatusApiHook(
    updatePicklistStatusApi,
    selectedPicks,
    dispatch,
    navigation,
    selectedPicklistAction
  ), [updatePicklistStatusApi]);

  const handleAccept = (items: PickListItem[]) => {
    const { status, palletId } = items[0];
    const action = status === PickStatus.READY_TO_PICK ? PickAction.ACCEPT_PICK : PickAction.ACCEPT_BIN;
    setSelectedPicklistAction(action);
    const picklistItems = items.map(item => ({
      id: item.id,
      locationId: item.palletLocationId,
      locationName: item.palletLocationName
    }));
    dispatch(updatePicklistStatus({
      headers: {
        action
      },
      picklistItems,
      palletId
    }));
  };

  const handleRelease = (items: PickListItem[]) => {
    const { palletId } = items[0];
    const action = PickAction.RELEASE;
    setSelectedPicklistAction(action);
    const picklistItems = items.map(item => ({
      id: item.id,
      locationId: item.palletLocationId,
      locationName: item.palletLocationName
    }));
    dispatch(updatePicklistStatus({
      headers: {
        action
      },
      picklistItems,
      palletId
    }));
  };

  const handleContinue = () => {};

  const handleBin = () => {};

  const actionButtonsView = () => {
    const { status } = selectedPicks[0];
    const isMine = selectedPicks[0].assignedAssociate === userId;

    const amManager = !userFeatures.includes('manager approval');
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

    const continueButton = isMine && status === PickStatus.ACCEPTED_PICK ? (
      <Button
        title={strings('GENERICS.CONTINUE')}
        onPress={handleContinue}
        style={styles.actionButton}
        key="continue"
      />
    ) : null;

    const binButton = isMine && status === PickStatus.ACCEPTED_BIN ? (
      <Button
        title={strings('PICKING.BIN')}
        onPress={handleBin}
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
      <PickPalletInfoCard
        onPress={() => {}}
        palletId={selectedPicks[0].palletId}
        palletLocation={selectedPicks[0].palletLocationName}
        pickListItems={selectedPicks}
        pickStatus={selectedPicks[0].status}
      />
      <View style={styles.actionButtonsView}>
        {actionButtonsView()}
      </View>
    </SafeAreaView>
  );
};

const PickBinWorkflow = () => {
  const userFeatures = useTypedSelector(state => state.User.features);
  const userId = useTypedSelector(state => state.User.userId);
  const picking = useTypedSelector(state => state.Picking);
  const updatePicklistStatusApi = useTypedSelector(state => state.async.updatePicklistStatus);
  const [selectedPicklistAction, setSelectedPicklistAction] = useState<PickAction|null>(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  return (
    <PickBinWorkflowScreen
      userFeatures={userFeatures}
      userId={userId}
      pickingState={picking}
      updatePicklistStatusApi={updatePicklistStatusApi}
      useEffectHook={useEffect}
      dispatch={dispatch}
      navigation={navigation}
      selectedPicklistAction={selectedPicklistAction}
      setSelectedPicklistAction={setSelectedPicklistAction}
    />
  );
};

export default PickBinWorkflow;
