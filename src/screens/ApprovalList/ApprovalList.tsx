import React, { useEffect } from 'react';
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

interface ApprovalCategory extends ApprovalListItem {
  categoryHeader?: boolean;
}
export interface CategoryFilter {
  filteredData: ApprovalCategory[];
  headerIndices: number[];
}

export const convertApprovalListData = (listData: ApprovalListItem[]): CategoryFilter => {
  const sortedData = listData;

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
        categoryHeader: true
      });
      headerIndices.push(returnData.length - 1);
      returnData.push(item);
    } else {
      previousItem = item;
      returnData.push(item);
    }
  });

  return { filteredData: returnData as ApprovalCategory[], headerIndices };
};

export const renderApprovalItem = (approvalItem: ApprovalCategory) => {
  const {
    imageUrl, itemNbr, itemName, oldQuantity,
    newQuantity, dollarChange, initiatedUserId, initiatedTimestamp,
    categoryHeader, categoryNbr, categoryDescription
  } = approvalItem;

  const daysLeft = moment(initiatedTimestamp).diff(moment().format(), 'days');

  if (categoryHeader) {
    return <ApprovalCategorySeparator categoryNbr={categoryNbr} categoryName={categoryDescription} />;
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
    />
  );
};
const ApprovalList = () => {
  const { result, isWaiting, error } = useTypedSelector(state => state.async.getApprovalList);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  return (
    <ApprovalListScreen
      dispatch={dispatch}
      result={result}
      error={error}
      isWaiting={isWaiting}
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
  navigation: NavigationProp<any>;
  route: Route<any>;
  useEffectHook: Function;
  trackEventCall: (eventName: string, params?: any) => void;
}
export const ApprovalListScreen = (props: ApprovalListProps) => {
  const {
    dispatch, error, isWaiting, result, trackEventCall,
    useEffectHook, navigation, route
  } = props;

  // Get Approval List Items
  useEffectHook(() => navigation.addListener('focus', () => {
    validateSession(navigation, route.name).then(() => {
      trackEvent('approval_list_api_call');
      dispatch(getApprovalList({}));
    }).catch(() => {});
  }), [navigation]);

  // Get Approval List API
  useEffectHook(() => {
    // on api success
    if (!isWaiting && result) {
      trackEvent('get_approval_list_api_success');
    }

    // on api failure
    if (!isWaiting && error) {
      trackEvent('get_approval_list_api_failure');
    }

    // on api submission
    if (isWaiting) {
      trackEvent('get_approval_list_api_start');
    }
  }, [error, isWaiting, result]);

  if (result?.status === 204) {
    return (
      <View style={styles.emptyContainer}>
        {/* Placeholder for empty approval list subject to change */}
        <MaterialCommunityIcon name="information" size={40} color={COLOR.DISABLED_BLUE} />
        <Text> The Approval List is Empty </Text>
      </View>
    );
  }

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
  const approvalItems: ApprovalListItem[] = (result && result.data) || [];
  const { filteredData, headerIndices } = convertApprovalListData(approvalItems);
  // TODO use FlatListEmptyComponent prop for rendering empty data in latest version of RN
  return (
    <View>
      <FlatList
        data={filteredData}
        keyExtractor={(item: ApprovalCategory) => {
          if (item.categoryHeader) {
            return item.categoryDescription.toString();
          }
          return item.itemNbr.toString();
        }}
        renderItem={({ item }) => renderApprovalItem(item)}
        stickyHeaderIndices={headerIndices}
      />
    </View>
  );
};

export default ApprovalList;
