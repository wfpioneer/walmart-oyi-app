import React, {
  EffectCallback, useEffect, useMemo, useRef, useState
} from 'react';
import {
  ActivityIndicator,
  FlatList, Platform, Pressable, SafeAreaView, Text, TouchableOpacity, View
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import BottomSheetPrintCard from '../../components/BottomSheetPrintCard/BottomSheetPrintCard';
import Button from '../../components/buttons/Button';
import PickPalletInfoCard from '../../components/PickPalletInfoCard/PickPalletInfoCard';
import SalesFloorItemCard, { MAX } from '../../components/SalesFloorItemCard/SalesFloorItemCard';
import { PickingState } from '../../state/reducers/Picking';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { showPickingMenu, updatePicks } from '../../state/actions/Picking';
import { PickAction, PickListItem, PickStatus } from '../../models/Picking.d';
import { strings } from '../../locales';
import styles from './SalesFloorWorkflow.style';
import { Pallet, PalletItem, PalletItemDetails } from '../../models/PalletManagementTypes';
import { UseStateType } from '../../models/Generics.d';
import { AsyncState } from '../../models/AsyncState';
import {
  deleteUpcs, getPalletConfig, getPalletDetails, updatePalletItemQty, updatePicklistStatus
} from '../../state/actions/saga';
import COLOR from '../../themes/Color';
import {
  DELETE_UPCS,
  GET_PALLET_CONFIG,
  GET_PALLET_DETAILS,
  UPDATE_PALLET_ITEM_QTY,
  UPDATE_PICKLIST_STATUS
} from '../../state/actions/asyncAPI';
import { CustomModalComponent } from '../Modal/Modal';
import { setPerishableCategories, setupPallet } from '../../state/actions/PalletManagement';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { SNACKBAR_TIMEOUT } from '../../utils/global';
import { setPrintingPalletLabel } from '../../state/actions/Print';

// eslint-disable-next-line no-shadow
export enum ExpiryPromptShow {
  HIDDEN,
  DIALOGUE_SHOW,
  CALENDAR_SHOW
}

interface SFWorklfowProps {
  pickingState: PickingState;
  dispatch: Dispatch<any>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  navigation: NavigationProp<any>;
  updatePicklistStatusApi: AsyncState;
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
  completePalletState: UseStateType<boolean>;
  updateItemsState: UseStateType<boolean>;
  deleteItemsState: UseStateType<boolean>;
}

export const activityIndicatorEffect = (
  updatePalletItemsApi: AsyncState,
  deletePalletItemsApi: AsyncState,
  updatePicklistStatusApi: AsyncState,
  showActivity: boolean,
  navigation: NavigationProp<any>,
  dispatch: Dispatch<any>
) => {
  if (navigation.isFocused()) {
    if (!showActivity) {
      if (
        updatePalletItemsApi.isWaiting
        || deletePalletItemsApi.isWaiting
        || updatePicklistStatusApi.isWaiting
      ) {
        dispatch(showActivityModal());
      }
    } else if (
      !updatePalletItemsApi.isWaiting
      && !deletePalletItemsApi.isWaiting
      && !updatePicklistStatusApi.isWaiting
    ) {
      dispatch(hideActivityModal());
    }
  }
};

const resetApis = (dispatch: Dispatch<any>) => {
  dispatch({ type: UPDATE_PICKLIST_STATUS.RESET });
};

export const updatePicklistStatusApiEffect = (
  updatePicklistStatusApi: AsyncState,
  items: PickListItem[],
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
) => {
  // on api success
  if (!updatePicklistStatusApi.isWaiting && updatePicklistStatusApi.result) {
    if (updatePicklistStatusApi.result.status === 200) {
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
      resetApis(dispatch);
      navigation.goBack();
    }
    dispatch(hideActivityModal());
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

export const palletDetailsApiEffect = (
  navigation: NavigationProp<any>,
  palletDetailsApi: AsyncState,
  selectedPicks: PickListItem[],
  dispatch: Dispatch<any>,
  setExpiration: UseStateType<string>[1],
  setPerishableItems: UseStateType<Array<number>>[1],
  setIsReadyToComplete: UseStateType<boolean>[1],
  perishableCategories: number[],
) => {
  if (navigation.isFocused()) {
    if (!palletDetailsApi.isWaiting && palletDetailsApi.result) {
      // success
      if (palletDetailsApi.result.status === 200) {
        const { pallets }: { pallets: PalletItemDetails[] } = palletDetailsApi.result.data;
        const pallet = pallets[0];
        // validate that there are no other items besides the selectedPicks on the pallet
        const quantifiedPicks: PickListItem[] = [];

        // Check if all pallet items are in selectedPicks
        if (pallet.items.length === selectedPicks.length) {
          setIsReadyToComplete(true);
        }

        selectedPicks.forEach(pick => {
          const itemWithQty = pallet.items.find(palletItem => pick.itemNbr === palletItem.itemNbr);
          const initialQty = itemWithQty?.quantity || 0;
          quantifiedPicks.push({ ...pick, quantityLeft: initialQty });
        });

        const palletPerishableItems = pallet.items.reduce(
          (perishableItems: number[], palletItem) => (perishableCategories.includes(palletItem.categoryNbr || 0)
            ? [...perishableItems, Number(palletItem.itemNbr)]
            : perishableItems),
          []
        );

        setPerishableItems(palletPerishableItems);
        setExpiration(pallet.expirationDate || '');
        dispatch(updatePicks(quantifiedPicks));
        dispatch({ type: GET_PALLET_DETAILS.RESET });
      } else if (palletDetailsApi.result.status === 204) {
        Toast.show({
          type: 'error',
          text1: strings('LOCATION.PALLET_NOT_FOUND'),
          visibilityTime: SNACKBAR_TIMEOUT,
          position: 'bottom'
        });
      }
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

export const binApisEffect = (
  updateQuantitiesApi: AsyncState,
  deleteItemsApi: AsyncState,
  isUpdateItemsState: UseStateType<boolean>,
  isDeleteItemsState: UseStateType<boolean>,
  navigation: NavigationProp<any>,
  dispatch: Dispatch<any>,
  selectedPicks: PickListItem[]
) => {
  if (
    navigation.isFocused()
    && !updateQuantitiesApi.isWaiting
    && !deleteItemsApi.isWaiting
    && (updateQuantitiesApi.value || deleteItemsApi.value)
  ) {
    const [isUpdateItems, setIsUpdateItems] = isUpdateItemsState;
    const [isDeleteItems, setIsDeleteItems] = isDeleteItemsState;
    if ((updateQuantitiesApi.result || !isUpdateItems) && (deleteItemsApi.result || !isDeleteItems)) {
      const selectedPickItems = selectedPicks.map(pick => ({
        picklistId: pick.id,
        locationId: pick.palletLocationId,
        locationName: pick.palletLocationName
      }));
      dispatch(updatePicklistStatus({
        headers: { action: PickAction.READY_TO_BIN },
        palletId: selectedPicks[0].palletId,
        picklistItems: selectedPickItems
      }));
      dispatch({ type: UPDATE_PALLET_ITEM_QTY.RESET });
      dispatch({ type: DELETE_UPCS.RESET });
      setIsUpdateItems(false);
      setIsDeleteItems(false);
    }

    if (updateQuantitiesApi.error || deleteItemsApi.error) {
      if (updateQuantitiesApi.error && deleteItemsApi.error) {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: strings('PALLET.SAVE_PALLET_FAILURE'),
          visibilityTime: SNACKBAR_TIMEOUT
        });
      } else {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: strings('PALLET.SAVE_PALLET_PARTIAL'),
          visibilityTime: SNACKBAR_TIMEOUT
        });
      }
      setIsUpdateItems(false);
      setIsDeleteItems(false);
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
  palletId: string,
  setShowExpiryPrompt: UseStateType<ExpiryPromptShow>[1],
  perishableItems: number[],
  setIsUpdateItems: UseStateType<boolean>[1],
  setIsDeleteItems: UseStateType<boolean>[1],
  newExpirationDate?: string
) => {
  if (toUpdateItems.length) {
    const reqUpdateItems = toUpdateItems.reduce((items: Pick<PalletItem, 'quantity' | 'upcNbr'>[], pick) => (
      [...items, { upcNbr: pick.upcNbr, quantity: pick.newQuantityLeft || 1 }]
    ), []);
    setIsUpdateItems(true);
    dispatch(updatePalletItemQty({ palletId, palletItem: reqUpdateItems }));
  }

  if (toDeleteItems.length) {
    const reqUpcs = toDeleteItems.reduce((upcs: string[], pick) => [...upcs, pick.upcNbr], []);
    setIsDeleteItems(true);
    if (newExpirationDate) {
      const expirationDate = `${moment(newExpirationDate).format('YYYY-MM-DDT00:00:00.000')}Z`;
      dispatch(deleteUpcs({
        palletId,
        upcs: reqUpcs,
        expirationDate,
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
    pickingState, palletDetailsApi, palletConfigApi, dispatch,
    navigation, useEffectHook, expirationState, perishableItemsState,
    showExpiryPromptState, perishableCategories, backupCategories,
    configCompleteState, showActivity, updatePalletItemsApi,
    deletePalletItemsApi, completePalletState, updatePicklistStatusApi,
    updateItemsState, deleteItemsState
  } = props;

  const [expirationDate, setExpiration] = expirationState;
  const [perishableItems, setPerishableItems] = perishableItemsState;
  const [showExpiryPrompt, setShowExpiryPrompt] = showExpiryPromptState;
  const [configComplete, setConfigComplete] = configCompleteState;
  const [isReadyToComplete, setIsReadyToComplete] = completePalletState;
  const [isUpdateItems, setIsUpdateItems] = updateItemsState;
  const [isDeleteItems, setIsDeleteItems] = deleteItemsState;

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

  // Resets Get palletDetails api state when navigating off-screen
  useEffectHook(() => {
    navigation.addListener('blur', () => {
      if (palletDetailsApi.value) {
        dispatch({ type: GET_PALLET_DETAILS.RESET });
      }
    });
  }, [palletDetailsApi]);

  useEffectHook(() => {
    if (configComplete) {
      dispatch(getPalletDetails({ palletIds: [selectedPicks[0].palletId], isAllItems: true }));
    }
  }, [configComplete]);

  useEffectHook(() => activityIndicatorEffect(
    updatePalletItemsApi,
    deletePalletItemsApi,
    updatePicklistStatusApi,
    showActivity,
    navigation,
    dispatch
  ), [showActivity, updatePalletItemsApi, deletePalletItemsApi, updatePicklistStatusApi]);

  useEffectHook(() => updatePicklistStatusApiEffect(
    updatePicklistStatusApi,
    selectedPicks,
    dispatch,
    navigation,
  ), [updatePicklistStatusApi]);

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
    setIsReadyToComplete,
    perishableCategories
  ), [palletDetailsApi]);

  useEffectHook(() => binApisEffect(
    updatePalletItemsApi,
    deletePalletItemsApi,
    updateItemsState,
    deleteItemsState,
    navigation,
    dispatch,
    selectedPicks
  ), [updatePalletItemsApi, deletePalletItemsApi, isUpdateItems, isDeleteItems]);

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
        setIsUpdateItems,
        setIsDeleteItems,
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

  const isPickQtyZero = ():boolean => selectedPicks.every(pick => pick.quantityLeft === 0);

  const isAnyNewInvalidPickQty = ():boolean => selectedPicks.some(
    pick => !!pick.quantityLeft && Number.isNaN(pick.newQuantityLeft)
  );

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
        palletId: selectedPicks[0].palletId
      })
    );
  };

  const getCurrentQuantity = (item: PickListItem) => (typeof item.newQuantityLeft === 'number'
    ? item.newQuantityLeft
    : item.quantityLeft || 0);

  const handleIncrement = (item: PickListItem) => {
    const currentQuantity = getCurrentQuantity(item);
    if (item.quantityLeft && currentQuantity < MAX) {
      dispatch(updatePicks([{ ...item, newQuantityLeft: currentQuantity + 1 }]));
    } else if (!item.quantityLeft) {
      dispatch(updatePicks([{ ...item, quantityLeft: 1 }]));
    }
  };

  const handleDecrement = (item: PickListItem) => {
    const currentQuantity = getCurrentQuantity(item);
    if (item.quantityLeft && currentQuantity > 0) {
      dispatch(updatePicks([{ ...item, newQuantityLeft: currentQuantity - 1 }]));
    }
  };

  const handleTextChange = (text: string, item: PickListItem) => {
    const newQuantity = Number.parseInt(text, 10);

    if (text === '' || (newQuantity && newQuantity < MAX && newQuantity > 0)) {
      dispatch(updatePicks([{ ...item, newQuantityLeft: newQuantity }]));
    }
  };

  const onEndEditing = (item: PickListItem) => {
    if (typeof (item.newQuantityLeft) !== 'number' || Number.isNaN(item.newQuantityLeft)) {
      dispatch(updatePicks([{ ...item, newQuantityLeft: item.quantityLeft }]));
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
  // Added palletDetails API 204 status check to restrict the user from binning the pick if Pallet not found(Edge case)
  if (palletDetailsApi.error || (palletDetailsApi.result && palletDetailsApi.result.status === 204)) {
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
    const currentQuantity = getCurrentQuantity(item);
    return (
      <SalesFloorItemCard
        assigned={assigned}
        category={item.category}
        createdBy={item.createdBy}
        createdTS={item.createTs}
        decrementQty={() => handleDecrement(item)}
        incrementQty={() => handleIncrement(item)}
        itemDesc={item.itemDesc}
        itemNbr={item.itemNbr}
        onQtyTextChange={(text: string) => handleTextChange(text, item)}
        // will need to get initial quantity from pallet details
        quantity={currentQuantity}
        salesFloorLocation={item.salesFloorLocationName}
        upcNbr={item.upcNbr}
        onEndEditing={() => onEndEditing(item)}
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
            <Text style={styles.expirationDateText}>
              {expirationDate
                ? moment(expirationDate, 'MM/DD/YYYY').format('DD/MM/YYYY')
                : moment().format('DD/MM/YYYY')}
            </Text>
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
          value={expirationDate ? new Date(expirationDate) : new Date(Date.now())}
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
        canDelete={false}
        dispatch={dispatch}
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
          disabled={!isPickQtyZero() || !isReadyToComplete}
        />
        <Button
          title={strings('PICKING.READY_TO_BIN')}
          onPress={() => handleBin()}
          style={styles.actionButton}
          testId="bin"
          disabled={(isPickQtyZero() && isReadyToComplete) || isAnyNewInvalidPickQty()}
        />
      </View>
    </SafeAreaView>
  );
};

const SalesFloorWorkflow = () => {
  const pickingState = useTypedSelector(state => state.Picking);
  const updatePicklistStatusApi = useTypedSelector(state => state.async.updatePicklistStatus);
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
  const completePalletState = useState(false);
  const updateItemsState = useState(false);
  const deleteItemsState = useState(false);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['21%'], []);

  useEffect(() => {
    if (navigation.isFocused() && bottomSheetModalRef.current) {
      if (pickingState.pickingMenu) {
        bottomSheetModalRef.current.present();
      } else {
        bottomSheetModalRef.current.dismiss();
      }
    }
  }, [pickingState.pickingMenu]);

  const handlePrintPallet = () => {
    dispatch(showPickingMenu(false));
    bottomSheetModalRef.current?.dismiss();
    const selectedPicks = pickingState.pickList.filter(pick => pickingState.selectedPicks.includes(pick.id));
    const palletDetails: Pallet = {
      palletInfo: {
        id: selectedPicks[0].palletId
      },
      items: []
    };
    dispatch(setupPallet(palletDetails));
    dispatch(setPrintingPalletLabel());
    navigation.navigate('PrintPriceSign');
  };

  return (
    <BottomSheetModalProvider>
      <TouchableOpacity
        onPress={() => dispatch(showPickingMenu(!pickingState.pickingMenu))}
        activeOpacity={1}
        disabled={!pickingState.pickingMenu}
        style={pickingState.pickingMenu ? styles.disabledContainer : styles.safeAreaView}
      >
        <SalesFloorWorkflowScreen
          pickingState={pickingState}
          dispatch={dispatch}
          navigation={navigation}
          updatePicklistStatusApi={updatePicklistStatusApi}
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
          completePalletState={completePalletState}
          updateItemsState={updateItemsState}
          deleteItemsState={deleteItemsState}
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

export default SalesFloorWorkflow;
