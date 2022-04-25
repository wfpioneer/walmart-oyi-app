import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList, SafeAreaView, Text, TouchableOpacity, View
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Button from '../../components/buttons/Button';
import PickPalletInfoCard from '../../components/PickPalletInfoCard/PickPalletInfoCard';
import SalesFloorItemCard, { MAX } from '../../components/SalesFloorItemCard/SalesFloorItemCard';
import { PickingState } from '../../state/reducers/Picking';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { updatePicks } from '../../state/actions/Picking';
import { PickListItem } from '../../models/Picking.d';
import { strings } from '../../locales';
import styles from './SalesFloorWorkflow.style';
import { PalletItemDetails } from '../../models/PalletManagementTypes';
import { UseEffectType, UseStateType } from '../../models/Generics.d';
import { AsyncState } from '../../models/AsyncState';
import { getPalletDetails } from '../../state/actions/saga';
import COLOR from '../../themes/Color';
import { GET_PALLET_DETAILS } from '../../state/actions/asyncAPI';

interface SFWorklfowProps {
  pickingState: PickingState;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  useEffectHook: UseEffectType;
  palletDetailsApi: AsyncState;
  expirationState: UseStateType<string>;
  perishableItemsState: UseStateType<Array<number>>;
  perishableCategories: number[];
  backupCategories: string;
}

export const palletDetailsApiEffect = (
  navigation: NavigationProp<any>,
  palletDetailsApi: AsyncState,
  selectedPicks: PickListItem[],
  dispatch: Dispatch<any>,
  setExpiration: UseStateType<string>[1],
  setPerishableItems: UseStateType<Array<number>>[1],
  perishableCategories: number[]
) => {
  if (navigation.isFocused() && !palletDetailsApi.isWaiting) {
    // success
    if (palletDetailsApi.result) {
      const { pallets }: { pallets: PalletItemDetails[] } = palletDetailsApi.result.data;
      const pallet = pallets[0];

      const quantifiedPicks: PickListItem[] = [];

      selectedPicks.forEach(pick => {
        const itemWithQty = pallet.items.find(palletItem => pick.itemNbr === palletItem.itemNbr);
        const initialQty = itemWithQty?.quantity || 0;
        quantifiedPicks.push({ ...pick, quantityLeft: initialQty });
      });

      const palletPerishableItems = pallet.items.reduce((perishableItems: number[], palletItem) => (perishableCategories
        .includes(palletItem.categoryNbr || 0)
        ? [...perishableItems, Number(palletItem.itemNbr)]
        : perishableItems),
      []);

      setPerishableItems(palletPerishableItems);
      setExpiration(pallet.expirationDate || '');
      dispatch(updatePicks(quantifiedPicks));
      dispatch({ type: GET_PALLET_DETAILS.RESET });
    }
  }
};

export const SalesFloorWorkflowScreen = (props: SFWorklfowProps) => {
  const {
    pickingState, palletDetailsApi,
    dispatch, navigation, useEffectHook,
    expirationState, perishableItemsState,
    perishableCategories, backupCategories
  } = props;

  const perishableCats = perishableCategories.length
    ? perishableCategories
    : backupCategories.split(',').map(Number);

  const [expirationDate, setExpiration] = expirationState;
  const [perishableItems, setPerishableItems] = perishableItemsState;

  const selectedPicks = pickingState.pickList.filter(pick => pickingState.selectedPicks.includes(pick.id));
  const assigned = selectedPicks[0].assignedAssociate;

  useEffectHook(() => {
    const navListener = navigation.addListener('focus', () => {
      dispatch(getPalletDetails({ palletIds: [selectedPicks[0].palletId] }));
    });

    return navListener;
  });

  useEffectHook(() => palletDetailsApiEffect(
    navigation,
    palletDetailsApi,
    selectedPicks,
    dispatch,
    setExpiration,
    setPerishableItems,
    perishableCats
  ), [palletDetailsApi]);

  const handleComplete = () => {};

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

  if (palletDetailsApi.isWaiting) {
    return (
      <ActivityIndicator
        animating={palletDetailsApi.isWaiting}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    );
  }

  if (palletDetailsApi.error) {
    return (
      <View style={styles.errorView}>
        <MaterialIcons name="error" size={60} color={COLOR.RED_300} />
        <Text style={styles.errorText}>{strings('PALLET.PALLET_DETAILS_ERROR')}</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => dispatch(getPalletDetails({ palletIds: [selectedPicks[0].palletId] }))}
        >
          <Text>{strings('GENERICS.RETRY')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
        <Text style={styles.updateQuantityText}>{strings('PICKING.UPDATE_REMAINING_QTY')}</Text>
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
  const palletDetailsApi = useTypedSelector(state => state.async.getPalletDetails);
  const { perishableCategories } = useTypedSelector(state => state.PalletManagement);
  const { backupCategories } = useTypedSelector(state => state.User.configs);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const expirationState = useState('');
  const perishableItemsState = useState<Array<number>>([]);

  return (
    <SalesFloorWorkflowScreen
      pickingState={pickingState}
      dispatch={dispatch}
      navigation={navigation}
      useEffectHook={useEffect}
      palletDetailsApi={palletDetailsApi}
      expirationState={expirationState}
      perishableItemsState={perishableItemsState}
      perishableCategories={perishableCategories}
      backupCategories={backupCategories}
    />
  );
};

export default SalesFloorWorkflow;
