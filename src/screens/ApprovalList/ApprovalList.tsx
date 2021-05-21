import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, FlatList, Text, TouchableOpacity, View
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import {
  NavigationProp, Route, useNavigation, useRoute
} from '@react-navigation/native';
import { ApprovalCard } from '../../components/approvalCard/ApprovalCard';
import { ApprovalListItem } from '../../models/ApprovalListItem';
import styles from './ApprovalList.style';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { getApprovalList } from '../../state/actions/saga';
import COLOR from '../../themes/Color';
import { strings } from '../../locales';
import { trackEvent } from '../../utils/AppCenterTool';
import { ApprovalCategorySeparator } from '../../components/CategorySeparatorCards/ApprovalCategorySeparator';
import { validateSession } from '../../utils/sessionTimeout';
import { setApprovalList } from '../../state/actions/Approvals';

export interface ApprovalCategory extends ApprovalListItem {
  categoryHeader?: boolean;
}
export interface CategoryFilter {
  filteredData: ApprovalCategory[];
  headerIndices: number[];
}
interface ApprovalItemProp {
  item: ApprovalCategory;
  dispatch: Dispatch<any>;
}
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

export const RenderApprovalItem = (props: ApprovalItemProp) => {
  const {
    imageUrl, itemNbr, itemName, oldQuantity,
    newQuantity, dollarChange, initiatedUserId, initiatedTimestamp,
    categoryHeader, categoryNbr, categoryDescription, isChecked
  } = props.item;
  const { dispatch } = props;
  const daysLeft = moment(initiatedTimestamp).diff(moment().format(), 'days');

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
      image={imageUrl}
      itemName={itemName}
      itemNbr={itemNbr}
      oldQuantity={oldQuantity}
      newQuantity={newQuantity}
      userId={initiatedUserId}
      isChecked={isChecked}
      dispatch={dispatch}
    />
  );
};
const ApprovalList = () => {
  const { result, isWaiting, error } = useTypedSelector(state => state.async.getApprovalList);
  const { approvalList, categoryIndices } = useTypedSelector(state => state.Approvals);
  const [apiStart, setApiStart] = useState(0);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  return (
    <ApprovalListScreen
      filteredList={approvalList}
      categoryIndices={categoryIndices}
      dispatch={dispatch}
      result={result}
      error={error}
      isWaiting={isWaiting}
      apiStart={apiStart}
      setApiStart={setApiStart}
      navigation={navigation}
      route={route}
      useEffectHook={useEffect}
      trackEventCall={trackEvent}
    />
  );
};
interface ApprovalListProps {
  dispatch: Dispatch<any>;
  error: any;
  isWaiting: boolean;
  result: any;
  filteredList: ApprovalCategory[];
  categoryIndices: number[];
  apiStart: number;
  setApiStart: Function;
  navigation: NavigationProp<any>;
  route: Route<any>;
  useEffectHook: Function;
  trackEventCall: (eventName: string, params?: any) => void;
}

export const ApprovalListScreen = (props: ApprovalListProps) => {
  const {
    dispatch, error, isWaiting, result, trackEventCall, apiStart, setApiStart,
    useEffectHook, navigation, route, filteredList, categoryIndices
  } = props;

  // Get Approval List Items
  useEffectHook(() => navigation.addListener('focus', () => {
    validateSession(navigation, route.name).then(() => {
      trackEvent('get_approval_list_api_call');
      setApiStart(moment().valueOf());
      dispatch(getApprovalList({}));
    }).catch(() => {});
  }), [navigation]);

  // Get Approval List API
  useEffectHook(() => {
    // on api success
    if (!isWaiting && result) {
      trackEvent('get_approval_list_api_success', { duration: moment().valueOf() - apiStart });
      const approvalItems: ApprovalListItem[] = (result && result.data) || [];
      if (approvalItems.length !== 0) {
        const { filteredData, headerIndices } = convertApprovalListData(approvalItems);
        dispatch(setApprovalList(filteredData, headerIndices));
      }
    }

    // on api failure
    if (!isWaiting && error) {
      trackEvent('get_approval_list_api_failure', {
        errorDetails: error.message || error,
        duration: moment().valueOf() - apiStart
      });
    }
  }, [error, isWaiting, result]);


  if (isWaiting) {
    return (
      <ActivityIndicator
        animating={isWaiting}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    );
  }

  if (error) {
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
  // TODO use FlatListEmptyComponent prop for rendering empty data in latest version of RN!!!
  return (
    <View>
      <FlatList
        data={filteredList}
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
            <Text> The Approval List is Empty </Text>
          </View>
        )}
        
        extraData={filteredList}
      />
    </View>
  );
};

export default ApprovalList;
