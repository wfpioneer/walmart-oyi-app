import React, { EffectCallback, useEffect } from 'react';
import {
  FlatList, SafeAreaView, Text, View
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import Toast from 'react-native-toast-message';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Button from '../../components/buttons/Button';
import PickPalletInfoCard from '../../components/PickPalletInfoCard/PickPalletInfoCard';
import SalesFloorItemCard, { MAX } from '../../components/SalesFloorItemCard/SalesFloorItemCard';
import { PickingState } from '../../state/reducers/Picking';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { updatePicks } from '../../state/actions/Picking';
import { PickAction, PickListItem, PickStatus } from '../../models/Picking.d';
import { strings } from '../../locales';
import styles from './SalesFloorWorkflow.style';
import { Pallet } from '../../models/PalletManagementTypes';
import { updatePicklistStatus } from '../../state/actions/saga';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { AsyncState } from '../../models/AsyncState';
import { UPDATE_PICKLIST_STATUS } from '../../state/actions/asyncAPI';

interface SFWorklfowProps {
  pickingState: PickingState;
  palletToWork: Pallet;
  dispatch: Dispatch<any>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  navigation: NavigationProp<any>;
  updatePicklistStatusApi: AsyncState;
}

const resetApis = (dispatch: Dispatch<any>) => {
  dispatch({ type: UPDATE_PICKLIST_STATUS.RESET });
};

export const updatePicklistStatusApiHook = (
  updatePicklistStatusApi: AsyncState,
  items: PickListItem[],
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
) => {
  // on api success
  if (!updatePicklistStatusApi.isWaiting && updatePicklistStatusApi.result
    && updatePicklistStatusApi.result.status === 200) {
    const updatedItems = items.map(item => ({
      ...item,
      status: PickStatus.COMPLETE
    }));
    dispatch(updatePicks(updatedItems));
    Toast.show({
      type: 'success',
      text1: strings('PICKING.UPDATE_PICKLIST_STATUS_SUCCESS'),
      visibilityTime: 4000,
      position: 'bottom'
    });
    dispatch(hideActivityModal());
    resetApis(dispatch);
    navigation.goBack();
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

export const SalesFloorWorkflowScreen = (props: SFWorklfowProps) => {
  const {
    pickingState, palletToWork, dispatch, useEffectHook, navigation, updatePicklistStatusApi
  } = props;

  const selectedPicks = pickingState.pickList.filter(pick => pickingState.selectedPicks.includes(pick.id));
  const assigned = selectedPicks[0].assignedAssociate;

  useEffectHook(() => updatePicklistStatusApiHook(
    updatePicklistStatusApi,
    selectedPicks,
    dispatch,
    navigation,
  ), [updatePicklistStatusApi]);

  const handleComplete = () => {
    const selectedPickItems = selectedPicks.map(pick => ({
      picklistId: pick.id,
      locationId: pick.palletLocationId,
      locationName: pick.palletLocationName
    }));
    // dispatch picks to complete
    dispatch(
      updatePicklistStatus({
        headers: { action: PickAction.COMPLETE },
        picklistItems: selectedPickItems,
        palletId: palletToWork.palletInfo.id
      })
    );
  };

  const handleBin = () => {};

  const handleIncrement = (item: PickListItem) => {
    if (item.quantityLeft && item.quantityLeft < MAX) {
      dispatch(updatePicks([{ ...item, quantityLeft: item.quantityLeft + 1 }]));
    } else {
      dispatch(updatePicks([{ ...item, quantityLeft: 1 }]));
    }
  };

  const handleDecrement = (item: PickListItem) => {
    if (item.quantityLeft && item.quantityLeft > 0) {
      dispatch(updatePicks([{ ...item, quantityLeft: item.quantityLeft - 1 }]));
    }
  };

  const handleTextChange = (text: string, item: PickListItem) => {
    const newQuantity = Number.parseInt(text, 10);

    if (newQuantity && newQuantity < MAX && newQuantity > 0) {
      dispatch(updatePicks([{ ...item, quantityLeft: newQuantity }]));
    }
  };

  const renderItem = ({ item }: { item: PickListItem }) => (
    <SalesFloorItemCard
      assigned={assigned}
      category={item.category}
      createdBy={item.createdBy}
      createdTS={item.createTS}
      decrementQty={() => handleDecrement(item)}
      incrementQty={() => handleIncrement(item)}
      itemDesc={item.itemDesc}
      itemNbr={item.itemNbr}
      onQtyTextChange={(text: string) => handleTextChange(text, item)}
      // will need to get initial quantity from pallet details
      quantity={item.quantityLeft || 0}
      salesFloorLocation={item.salesFloorLocationName}
      upcNbr={item.upcNbr}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <PickPalletInfoCard
        onPress={() => {}}
        palletId={selectedPicks[0].palletId}
        palletLocation={selectedPicks[0].palletLocationName}
        // no items here because we need the sf item card
        pickListItems={[]}
        pickStatus={selectedPicks[0].status}
      />
      <View style={styles.updateQuantityTextView}>
        <Text style={styles.updateQuantityText}>
          {strings('PICKING.UPDATE_REMAINING_QTY')}
        </Text>
      </View>
      <FlatList
        data={selectedPicks}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
      />
      <View style={styles.actionButtonsView}>
        <Button
          title={strings('PICKING.COMPLETE')}
          onPress={handleComplete}
          style={styles.actionButton}
          testId="complete"
        />
        <Button
          title={strings('PICKING.READY_TO_BIN')}
          onPress={handleBin}
          style={styles.actionButton}
          testId="bin"
        />
      </View>
    </SafeAreaView>
  );
};

const SalesFloorWorkflow = () => {
  const pickingState = useTypedSelector(state => state.Picking);
  const updatePicklistStatusApi = useTypedSelector(state => state.async.updatePicklistStatus);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const mockPallet: Pallet = {
    items: [],
    palletInfo: {
      id: 1,
      createDate: 'gestern',
      expirationDate: 'morgen'
    }
  };

  return (
    <SalesFloorWorkflowScreen
      pickingState={pickingState}
      palletToWork={mockPallet}
      dispatch={dispatch}
      navigation={navigation}
      updatePicklistStatusApi={updatePicklistStatusApi}
      useEffectHook={useEffect}
    />
  );
};

export default SalesFloorWorkflow;
