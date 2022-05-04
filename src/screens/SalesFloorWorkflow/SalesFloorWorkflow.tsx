import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList, Platform, Pressable, SafeAreaView, Text, TouchableOpacity, View
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import Button from '../../components/buttons/Button';
import PickPalletInfoCard from '../../components/PickPalletInfoCard/PickPalletInfoCard';
import SalesFloorItemCard, { MAX } from '../../components/SalesFloorItemCard/SalesFloorItemCard';
import { PickingState } from '../../state/reducers/Picking';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { updatePicks } from '../../state/actions/Picking';
import { PickListItem } from '../../models/Picking.d';
import { strings } from '../../locales';
import styles from './SalesFloorWorkflow.style';
import { PalletItem, PalletItemDetails } from '../../models/PalletManagementTypes';
import { UseEffectType, UseStateType } from '../../models/Generics.d';
import { AsyncState } from '../../models/AsyncState';
import {
  deleteUpcs, getPalletConfig, getPalletDetails, updatePalletItemQty
} from '../../state/actions/saga';
import COLOR from '../../themes/Color';
import { GET_PALLET_CONFIG, GET_PALLET_DETAILS } from '../../state/actions/asyncAPI';
import { CustomModalComponent } from '../Modal/Modal';
import { setPerishableCategories } from '../../state/actions/PalletManagement';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';

// eslint-disable-next-line no-shadow
export enum ExpiryPromptShow {
  HIDDEN,
  DIALOGUE_SHOW,
  CALENDAR_SHOW
}

interface SFWorklfowProps {
  pickingState: PickingState;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  useEffectHook: UseEffectType;
  palletDetailsApi: AsyncState;
  palletConfigApi: AsyncState;
  updatePalletItemsApi: AsyncState;
  deletePalletItemsApi: AsyncState;
  expirationState: UseStateType<string>;
  perishableItemsState: UseStateType<Array<number>>;
  perishableCategories: number[];
  backupCategories: string;
  showExpiryPromptState: UseStateType<ExpiryPromptShow>;
  configCompleteState: UseStateType<boolean>;
  showActivity: boolean;
}

export const activityIndicatorEffect = (
  updatePalletItemsApi: AsyncState,
  deletePalletItemsApi: AsyncState,
  showActivity: boolean,
  navigation: NavigationProp<any>,
  dispatch: Dispatch<any>
) => {
  if (navigation.isFocused()) {
    if (!showActivity) {
      if (updatePalletItemsApi.isWaiting || deletePalletItemsApi.isWaiting) {
        dispatch(showActivityModal());
      }
    } else if (!updatePalletItemsApi.isWaiting && !deletePalletItemsApi.isWaiting) {
      dispatch(hideActivityModal());
    }
  }
};

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

export const palletConfigApiEffect = (
  getPalletConfigApi: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  setConfigComplete: React.Dispatch<React.SetStateAction<boolean>>,
  backupCategories: string
) => {
  if (navigation.isFocused() && !getPalletConfigApi.isWaiting) {
    // on api success
    if (getPalletConfigApi.result) {
      const { perishableCategories } = getPalletConfigApi.result.data;
      dispatch(setPerishableCategories(perishableCategories));
      dispatch({ type: GET_PALLET_CONFIG.RESET });
      setConfigComplete(true);
    }
    // on api error
    if (getPalletConfigApi.error) {
      const backupPerishableCategories = backupCategories.split(',').map(Number);
      dispatch(setPerishableCategories(backupPerishableCategories));
      dispatch({ type: GET_PALLET_CONFIG.RESET });
      setConfigComplete(true);
    }
  }
};

export const shouldUpdateQty = (item: PickListItem): boolean => !!(
  typeof item.quantityLeft === 'number'
    && typeof item.newQuantityLeft === 'number'
    && item.newQuantityLeft && item.newQuantityLeft !== item.quantityLeft
);

export const shouldDelete = (item: PickListItem): boolean => item.newQuantityLeft === 0;

export const shouldRemoveExpiry = (removedItems: PickListItem[], perishableItems: number[]): boolean => {
  const removedPerishableItems = removedItems.reduce((itemNbrs: number[], pick) => (
    perishableItems.includes(pick.itemNbr) ? [...itemNbrs, pick.itemNbr] : itemNbrs), []);
  return removedPerishableItems.length === perishableItems.length;
};

export const shouldPromptNewExpiry = (removedItems: PickListItem[], perishableItems: number[]): boolean => {
  const removedPerishableItems = removedItems.reduce((itemNbrs: number[], pick) => (
    perishableItems.includes(pick.itemNbr) ? [...itemNbrs, pick.itemNbr] : itemNbrs), []);
  return !!(removedPerishableItems.length && removedPerishableItems.length < perishableItems.length);
};

export const binServiceCall = (
  toUpdateItems: PickListItem[],
  toDeleteItems: PickListItem[],
  dispatch: Dispatch<any>,
  palletId: number,
  setShowExpiryPrompt: UseStateType<ExpiryPromptShow>[1],
  perishableItems: number[],
  newExpirationDate?: string
) => {
  if (toUpdateItems.length) {
    const reqUpdateItems = toUpdateItems.reduce((items: Pick<PalletItem, 'quantity' | 'upcNbr'>[], pick) => (
      [...items, { upcNbr: pick.upcNbr, quantity: pick.newQuantityLeft || 1 }]
    ), []);
    dispatch(updatePalletItemQty({ palletId, palletItem: reqUpdateItems }));
  }

  if (toDeleteItems.length) {
    const reqUpcs = toDeleteItems.reduce((upcs: string[], pick) => [...upcs, pick.upcNbr], []);
    if (newExpirationDate) {
      dispatch(deleteUpcs({
        palletId,
        upcs: reqUpcs,
        expirationDate: newExpirationDate,
        removeExpirationDate: false
      }));
      setShowExpiryPrompt(ExpiryPromptShow.HIDDEN);
    } else {
      dispatch(deleteUpcs({
        palletId,
        upcs: reqUpcs,
        removeExpirationDate: shouldRemoveExpiry(toDeleteItems, perishableItems)
      }));
    }
  }
};

export const SalesFloorWorkflowScreen = (props: SFWorklfowProps) => {
  const {
    pickingState, palletDetailsApi, palletConfigApi,
    dispatch, navigation, useEffectHook,
    expirationState, perishableItemsState, showExpiryPromptState,
    perishableCategories, backupCategories, configCompleteState,
    showActivity, updatePalletItemsApi, deletePalletItemsApi
  } = props;

  const [expirationDate, setExpiration] = expirationState;
  const [perishableItems, setPerishableItems] = perishableItemsState;
  const [showExpiryPrompt, setShowExpiryPrompt] = showExpiryPromptState;
  const [configComplete, setConfigComplete] = configCompleteState;

  const selectedPicks = pickingState.pickList.filter(pick => pickingState.selectedPicks.includes(pick.id));
  const assigned = selectedPicks[0].assignedAssociate;
  const { palletId } = selectedPicks[0];

  useEffectHook(() => navigation.addListener('focus', () => {
    if (perishableCategories.length) {
      dispatch(getPalletDetails({ palletIds: [selectedPicks[0].palletId], isAllItems: true }));
    } else {
      dispatch(getPalletConfig());
    }
  }), []);

  useEffectHook(() => {
    if (configComplete) {
      dispatch(getPalletDetails({ palletIds: [selectedPicks[0].palletId], isAllItems: true }));
    }
  }, [configComplete]);

  // GetPalletConfig API
  useEffectHook(() => {
    palletConfigApiEffect(palletConfigApi, dispatch, navigation, setConfigComplete, backupCategories);
  }, [palletConfigApi]);

  useEffectHook(() => palletDetailsApiEffect(
    navigation,
    palletDetailsApi,
    selectedPicks,
    dispatch,
    setExpiration,
    setPerishableItems,
    perishableCategories
  ), [palletDetailsApi]);

  useEffectHook(() => activityIndicatorEffect(
    updatePalletItemsApi,
    deletePalletItemsApi,
    showActivity,
    navigation,
    dispatch
  ), [showActivity, updatePalletItemsApi, deletePalletItemsApi]);

  const handleComplete = () => {};

  const handleBin = (newExpirationDate?: string) => {
    const toUpdateItems: PickListItem[] = [];
    const toDeleteItems: PickListItem[] = [];

    selectedPicks.forEach(pick => {
      if (shouldDelete(pick)) {
        toDeleteItems.push(pick);
      } else if (shouldUpdateQty(pick)) {
        toUpdateItems.push(pick);
      }
    });

    if (shouldPromptNewExpiry(toDeleteItems, perishableItems) && !newExpirationDate) {
      // call prompt before doing service call
      setShowExpiryPrompt(ExpiryPromptShow.DIALOGUE_SHOW);
    } else {
      binServiceCall(
        toUpdateItems,
        toDeleteItems,
        dispatch,
        palletId,
        setShowExpiryPrompt,
        perishableItems,
        newExpirationDate
      );
    }
  };

  const onDatePickerChange = (event: DateTimePickerEvent, value: Date| undefined) => {
    const { type } = event;
    const newDate = value && moment(value).format('MM/DD/YYYY');
    setShowExpiryPrompt(ExpiryPromptShow.DIALOGUE_SHOW);
    if (type === 'set' && newDate && newDate !== expirationDate) {
      setExpiration(newDate);
    }
  };

  const handleIncrement = (item: PickListItem) => {
    const currentQuantity = item.newQuantityLeft || item.quantityLeft;
    if (currentQuantity && currentQuantity < MAX) {
      dispatch(updatePicks([{ ...item, newQuantityLeft: currentQuantity + 1 }]));
    } else {
      dispatch(updatePicks([{ ...item, quantityLeft: 1 }]));
    }
  };

  const handleDecrement = (item: PickListItem) => {
    const currentQuantity = item.newQuantityLeft || item.quantityLeft;
    if (currentQuantity && currentQuantity > 0) {
      dispatch(updatePicks([{ ...item, newQuantityLeft: currentQuantity - 1 }]));
    }
  };

  const handleTextChange = (text: string, item: PickListItem) => {
    const newQuantity = Number.parseInt(text, 10);

    if (newQuantity && newQuantity < MAX && newQuantity > 0) {
      dispatch(updatePicks([{ ...item, newQuantityLeft: newQuantity }]));
    }
  };

  if (palletDetailsApi.isWaiting || palletConfigApi.isWaiting) {
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

  const renderItem = ({ item }: { item: PickListItem }) => {
    const currentQuantity = typeof item.newQuantityLeft === 'number'
      ? item.newQuantityLeft
      : item.quantityLeft || 0;
    return (
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
        quantity={currentQuantity}
        salesFloorLocation={item.salesFloorLocationName}
        upcNbr={item.upcNbr}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomModalComponent
        isVisible={showExpiryPrompt === ExpiryPromptShow.DIALOGUE_SHOW}
        modalType="Form"
        onClose={() => {}}
      >
        <View style={styles.updateExpirationTitleView}>
          <Text>{strings('PICKING.REMOVE_PERISHABLE')}</Text>
        </View>
        <View style={styles.udpateExpirationContentView}>
          <Text>{strings('PICKING.REMOVE_PERISHABLE_NEW_EXPIRY')}</Text>
          <Pressable
            onPress={() => setShowExpiryPrompt(ExpiryPromptShow.CALENDAR_SHOW)}
            style={styles.expirationDateTextView}
          >
            <Text style={styles.expirationDateText}>{expirationDate}</Text>
          </Pressable>
          <View style={styles.updateExpirationButtonsView}>
            <Button
              title={strings('GENERICS.CANCEL')}
              onPress={() => setShowExpiryPrompt(ExpiryPromptShow.HIDDEN)}
              type={Button.Type.SOLID_WHITE}
              titleColor={COLOR.MAIN_THEME_COLOR}
              style={styles.actionButton}
            />
            <Button
              title={strings('GENERICS.CONTINUE')}
              onPress={() => handleBin(expirationDate)}
              style={styles.actionButton}
            />
          </View>
        </View>
      </CustomModalComponent>
      {showExpiryPrompt === ExpiryPromptShow.CALENDAR_SHOW && (
        <DateTimePicker
          value={expirationDate ? new Date(expirationDate) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          is24Hour={true}
          minimumDate={new Date(Date.now())}
          onChange={onDatePickerChange}
        />
      )}
      <PickPalletInfoCard
        onPress={() => {}}
        palletId={palletId}
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
          onPress={() => handleBin()}
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
  const palletConfigApi = useTypedSelector(state => state.async.getPalletConfig);
  const updatePalletItemsApi = useTypedSelector(state => state.async.updatePalletItemQty);
  const deletePalletItemsApi = useTypedSelector(state => state.async.deleteUpcs);
  const { perishableCategories } = useTypedSelector(state => state.PalletManagement);
  const { backupCategories } = useTypedSelector(state => state.User.configs);
  const { showActivity } = useTypedSelector(state => state.modal);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const expirationState = useState('');
  const perishableItemsState = useState<Array<number>>([]);
  const showExpiryPromptState = useState(ExpiryPromptShow.HIDDEN);
  const configCompleteState = useState(false);

  return (
    <SalesFloorWorkflowScreen
      pickingState={pickingState}
      dispatch={dispatch}
      navigation={navigation}
      useEffectHook={useEffect}
      palletDetailsApi={palletDetailsApi}
      palletConfigApi={palletConfigApi}
      expirationState={expirationState}
      perishableItemsState={perishableItemsState}
      perishableCategories={perishableCategories}
      backupCategories={backupCategories}
      showExpiryPromptState={showExpiryPromptState}
      configCompleteState={configCompleteState}
      showActivity={showActivity}
      updatePalletItemsApi={updatePalletItemsApi}
      deletePalletItemsApi={deletePalletItemsApi}
    />
  );
};

export default SalesFloorWorkflow;
