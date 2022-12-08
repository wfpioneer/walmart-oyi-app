import React, { EffectCallback, useEffect } from 'react';
import {
  ActivityIndicator, BackHandler, FlatList, Text, TouchableOpacity, View
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  NavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute
} from '@react-navigation/native';
import { ApprovalCard } from '../../components/approvalCard/ApprovalCard';
import {
  ApprovalCategory,
  ApprovalListItem,
  approvalRequestSource as approvalSource,
  approvalStatus
} from '../../models/ApprovalListItem';
import styles from './ApprovalList.style';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { getApprovalList } from '../../state/actions/saga';
import COLOR from '../../themes/Color';
import { strings } from '../../locales';
import { trackEvent } from '../../utils/AppCenterTool';
import { ApprovalCategorySeparator } from '../../components/CategorySeparatorCards/ApprovalCategorySeparator';
import { validateSession } from '../../utils/sessionTimeout';
import {
  setApprovalList, toggleAllItems, updateFilterCategories, updateFilterSources
} from '../../state/actions/Approvals';
import { ButtonBottomTab } from '../../components/buttonTabCard/ButtonTabCard';
import Button, { ButtonType } from '../../components/buttons/Button';
import { AsyncState } from '../../models/AsyncState';
import { UPDATE_APPROVAL_LIST } from '../../state/actions/asyncAPI';
import { CustomModalComponent } from '../Modal/Modal';
import { FilterPillButton } from '../../components/filterPillButton/FilterPillButton';
import { FilterType } from '../../models/FilterListItem';

export interface CategoryFilter {
  filteredData: ApprovalCategory[];
  headerIndices: number[];
}
interface ApprovalItemProp {
  item: ApprovalCategory;
  dispatch: Dispatch<any>;
}

interface ApprovalListProps {
  dispatch: Dispatch<any>;
  getApprovalApi: AsyncState;
  updateApprovalApi: AsyncState;
  filteredList: ApprovalCategory[];
  categoryIndices: number[];
  selectedItemQty: number;
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  useEffectHook: (effect: EffectCallback, deps?:ReadonlyArray<any>) => void;
  useFocusEffectHook: (effect: EffectCallback) => void;
  trackEventCall: (eventName: string, params?: any) => void;
  validateSessionCall: (navigation: any, route?: string) => Promise<void>;
  filterCategories: string[];
  filterSources: string[];
}
interface UpdateResponse {
  message: string;
  id: number;
  itemNbr: number;
  statusCode: number;
}
const PARTIAL_SUCCESS_STATUS = 207;

export const convertApprovalListData = (listData: ApprovalListItem[]): CategoryFilter => {
  const sortedData = [...listData];

  // Sorts Items by category number
  sortedData.sort((firstItem, secondItem) => firstItem.categoryNbr - secondItem.categoryNbr);

  // Makes all properties optional to avoid filling out all properties for the categoryHeader obj
  const returnData: Partial<ApprovalCategory>[] = [];
  const headerIndices: number[] = [];

  // Iterates over the array and adds a category object
  let previousItem: ApprovalCategory;
  sortedData.forEach(item => {
    if (!previousItem || (previousItem.categoryNbr !== item.categoryNbr)) {
      previousItem = item;
      returnData.push({
        categoryDescription: item.categoryDescription,
        categoryNbr: item.categoryNbr,
        categoryHeader: true,
        isChecked: false
      });
      headerIndices.push(returnData.length - 1);
      returnData.push({ ...item, isChecked: false });
    } else {
      previousItem = item;
      returnData.push({ ...item, isChecked: false });
    }
  });

  return { filteredData: returnData as ApprovalCategory[], headerIndices };
};

export const RenderApprovalItem = (props: ApprovalItemProp): JSX.Element => {
  const {
    itemNbr, itemName, oldQuantity,
    newQuantity, dollarChange, initiatedUserId, daysLeft,
    categoryHeader, categoryNbr, categoryDescription, isChecked, approvalRequestSource
  } = props.item;
  const { dispatch } = props;

  if (categoryHeader) {
    return (
      <ApprovalCategorySeparator
        categoryNbr={categoryNbr}
        categoryName={categoryDescription}
        isChecked={isChecked}
        dispatch={dispatch}
      />
    );
  }

  return (
    <ApprovalCard
      dollarChange={dollarChange}
      daysLeft={daysLeft}
      itemName={itemName}
      itemNbr={itemNbr}
      oldQuantity={oldQuantity}
      newQuantity={newQuantity}
      userId={initiatedUserId}
      isChecked={isChecked}
      dispatch={dispatch}
      approvalRequestSource={approvalRequestSource}
    />
  );
};

export const renderPopUp = (updateApprovalApi: AsyncState, dispatch:Dispatch<any>): JSX.Element => {
  const { data, metadata: { total } } = updateApprovalApi.result.data;
  const items: UpdateResponse[] = data || [];
  const failedItems = items.filter((item: UpdateResponse) => item.message === 'failure');

  return (
  // Used to overlay the pop-up in the screen view
    <CustomModalComponent
      isVisible={true}
      modalType="Popup"
      onClose={() => { dispatch({ type: UPDATE_APPROVAL_LIST.RESET }); }}
    >
      <Text style={styles.errorText}>{strings('APPROVAL.FAILED_APPROVE')}</Text>
      {failedItems.length <= 5
        ? (
          <FlatList
            data={failedItems.slice(0, 5)}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <Text style={styles.listText}>
                {`${strings('GENERICS.ITEM')}: ${item.itemNbr}`}
              </Text>
            )}
            style={styles.listContainer}
          />
        )
        : (
          <Text style={styles.failedItemText}>
            {`${failedItems.length} / ${total} ${strings('APPROVAL.FAILED_ITEMS')}`}
          </Text>
        )}
      <Button
        title={strings('APPROVAL.CONFIRM')}
        type={ButtonType.PRIMARY}
        style={{ width: '50%' }}
        onPress={() => {
          dispatch({ type: UPDATE_APPROVAL_LIST.RESET });
        }}
      />
    </CustomModalComponent>
  );
};

export const renderFilterPills = (
  listFilter: { type: FilterType; value: string },
  dispatch: Dispatch<any>,
  filterCategories: string[],
  filterSources: string[],
): JSX.Element => {
  if (!listFilter.value) {
    // TODO Remove when no approval items lack a source
    return (<></>);
  }
  if (listFilter.type === FilterType.CATEGORY) {
    const removeFilter = () => {
      const replacementFilter = filterCategories;
      replacementFilter.splice(filterCategories.indexOf(listFilter.value), 1);
      dispatch(updateFilterCategories(replacementFilter));
    };
    return <FilterPillButton filterText={listFilter.value} onClosePress={removeFilter} />;
  }

  if (listFilter.type === FilterType.SOURCE) {
    const removeSourceFilter = () => {
      const removeSource = filterSources;
      removeSource.splice(filterSources.indexOf(listFilter.value), 1);
      // Ditto with the todo
      if (listFilter.value === approvalSource.ItemDetails) {
        removeSource.splice(removeSource.indexOf(''), 1);
      }
      dispatch(updateFilterSources(removeSource));
    };
    return <FilterPillButton filterText={listFilter.value} onClosePress={removeSourceFilter} />;
  }
  return <View />;
};

const getUpdateApprovalApiResult = (props: ApprovalListProps, updateApprovalApi: AsyncState) => {
  const {
    dispatch
  } = props;
  return updateApprovalApi.result?.status === PARTIAL_SUCCESS_STATUS && renderPopUp(updateApprovalApi, dispatch);
};

const getApprovalApiResult = (props: ApprovalListProps, getApprovalApi: AsyncState) => {
  const {
    dispatch
  } = props;
  const approvalItems: ApprovalListItem[] = (getApprovalApi.result && getApprovalApi.result.data) || [];
  if (approvalItems.length !== 0) {
    const { filteredData, headerIndices } = convertApprovalListData(approvalItems);
    dispatch(setApprovalList(filteredData, headerIndices));
  }
};

export const ApprovalListScreen = (props: ApprovalListProps): JSX.Element => {
  const {
    dispatch, getApprovalApi, trackEventCall, useEffectHook,
    useFocusEffectHook, navigation, route, filteredList,
    categoryIndices, selectedItemQty, validateSessionCall, updateApprovalApi,
    filterCategories, filterSources
  } = props;
  let newFilteredList = filteredList;

  // Get Approval List Items
  useEffectHook(() => navigation.addListener('focus', () => {
    validateSession(navigation, route.name).then(() => {
      dispatch(getApprovalList({ status: approvalStatus.Pending }));
    }).catch(() => {});
  }), [navigation]);

  // Device BackPress Listener
  useFocusEffectHook(() => {
    const onBackPress = () => {
      // Clears selected Approval items on system back press to re-enable bottom tab navigator
      if (selectedItemQty > 0) {
        dispatch(toggleAllItems(false));
        // Prevents the default system back action from executing and events from bubbling up
        return true;
      }
      // Allows events to bubble up and defaults to the systems back action (Pops screens in the navigation stack)
      return false;
    };
    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  });

  // Get Approval List API
  useEffectHook(() => {
    // on api success
    if (!getApprovalApi.isWaiting && getApprovalApi.result) {
      getApprovalApiResult(props, getApprovalApi);
    }
  }, [getApprovalApi]);

  // Reset update approval list api if there are no failed items in a mixed response
  useEffectHook(() => {
    if (updateApprovalApi.result?.status === 207 && updateApprovalApi.result?.data.metadata.failure === 0) {
      dispatch({ type: UPDATE_APPROVAL_LIST.RESET });
    }
  }, [updateApprovalApi]);

  const handleApproveSummary = () => {
    validateSessionCall(navigation, route.name).then(() => {
      trackEventCall('handle_approve_summary_click');
      navigation.navigate('ApproveSummary');
    });
  };
  const handleRejectSummary = () => {
    validateSessionCall(navigation, route.name).then(() => {
      trackEventCall('handle_reject_summary_click');
      navigation.navigate('RejectSummary');
    });
  };

  if (getApprovalApi.isWaiting) {
    return (
      <ActivityIndicator
        animating={getApprovalApi.isWaiting}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    );
  }

  if (getApprovalApi.error) {
    return (
      <View style={styles.errorView}>
        <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_300} />
        <Text style={styles.errorText}>{strings('APPROVAL.APPROVAL_API_ERROR')}</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => {
            trackEventCall('approval_list_api_retry',);
            dispatch(getApprovalList({}));
          }}
        >
          <Text>{strings('GENERICS.RETRY')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const typedFilterCategoryList = filterCategories.map(category => ({ type: FilterType.CATEGORY, value: category }));
  const typedFilterSourceList = filterSources.map(source => ({ type: FilterType.SOURCE, value: source }));

  if (filterCategories.length !== 0) {
    newFilteredList = newFilteredList.filter(approvalItem => filterCategories
      .indexOf(`${approvalItem.categoryNbr} - ${approvalItem.categoryDescription}`) !== -1);
  }

  if (filterSources.length !== 0) {
    const approvalMap: Map<number, ApprovalCategory[]> = new Map();

    newFilteredList = newFilteredList.filter(approvalItem => {
      const catgList = approvalMap.get(approvalItem.categoryNbr);
      const getIndex = filterSources.indexOf(approvalItem.approvalRequestSource) !== -1;

      // List is pre-sorted so this will grab the Category Header first
      if (!catgList) {
        approvalMap.set(approvalItem.categoryNbr, [approvalItem]);
      } else if (approvalMap.has(approvalItem.categoryNbr) && getIndex) {
        catgList.push(approvalItem);
        approvalMap.set(approvalItem.categoryNbr, catgList);
      }
      return getIndex || approvalItem.categoryHeader;
    });

    const updatedList: ApprovalCategory[] = [];

    // Creates a new approval list and inserts Categories that have filtered items
    newFilteredList.forEach(item => {
      const catgList = approvalMap.get(item.categoryNbr);
      if (catgList !== undefined && catgList.length > 1) {
        approvalMap.delete(item.categoryNbr);
        updatedList.push(...catgList);
      }
    });
    newFilteredList = updatedList;
  }

  return (
    <View style={styles.mainContainer}>
      { (filterCategories.length > 0 || filterSources.length > 0) && (
      <View style={styles.filterContainer}>
        <FlatList
          data={[...typedFilterCategoryList, ...typedFilterSourceList]}
          horizontal
          renderItem={({ item }) => renderFilterPills(
            item, dispatch, filterCategories, filterSources
          )}
          style={styles.filterList}
          keyExtractor={item => item.value}
        />
      </View>
      ) }
      {getUpdateApprovalApiResult(props, updateApprovalApi)}
      <FlatList
        data={newFilteredList}
        keyExtractor={(item: ApprovalCategory, index: number) => {
          if (item.categoryHeader) {
            return item.categoryDescription.toString();
          }
          return item.itemNbr + index.toString();
        }}
        renderItem={({ item }) => <RenderApprovalItem item={item} dispatch={dispatch} />}
        stickyHeaderIndices={categoryIndices.length !== 0 ? categoryIndices : undefined}
      // Default this is False, Solves flatlist rendering no data because stickyHeader updates at the same time as data
        removeClippedSubviews={false}
        ListEmptyComponent={(
          <View style={styles.emptyContainer}>
            {/* Placeholder for empty approval list subject to change */}
            <MaterialCommunityIcon name="information" size={40} color={COLOR.DISABLED_BLUE} />
            <Text>
              {strings('APPROVAL.LIST_NOT_FOUND')}
            </Text>
          </View>
      )}
        style={styles.mainContainer}
        extraData={newFilteredList}
      />
      {selectedItemQty > 0
        && (
          <ButtonBottomTab
            leftTitle={strings('APPROVAL.REJECT')}
            onLeftPress={() => handleRejectSummary()}
            rightTitle={strings('APPROVAL.APPROVE')}
            onRightPress={() => handleApproveSummary()}
          />
        )}
    </View>
  );
};

const ApprovalList = (): JSX.Element => {
  const getApprovalApi = useTypedSelector(state => state.async.getApprovalList);
  const updateApprovalApi = useTypedSelector(state => state.async.updateApprovalList);
  const {
    approvalList, categoryIndices, selectedItemQty, filterCategories, filterSources
  } = useTypedSelector(state => state.Approvals);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  return (
    <ApprovalListScreen
      filteredList={approvalList}
      categoryIndices={categoryIndices}
      dispatch={dispatch}
      getApprovalApi={getApprovalApi}
      updateApprovalApi={updateApprovalApi}
      navigation={navigation}
      route={route}
      useEffectHook={useEffect}
      useFocusEffectHook={useFocusEffect}
      trackEventCall={trackEvent}
      selectedItemQty={selectedItemQty}
      validateSessionCall={validateSession}
      filterCategories={filterCategories}
      filterSources={filterSources}
    />
  );
};
export default ApprovalList;
