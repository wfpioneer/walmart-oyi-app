import React from 'react';
import { FlatList, Text, View } from 'react-native';
import moment from 'moment';
import { ApprovalCard } from '../../components/approvalCard/ApprovalCard';
import { ApprovalListItem } from '../../models/ApprovalListItem';
import styles from './ApprovalList.style';
import { mockApprovals } from '../../mockData/mockApprovalItem';
import { ApprovalCategorySeparator } from '../../components/CategorySeparatorCards/ApprovalCategorySeparator';

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
const ApprovalList = () => (
  // Hooks and State will be added once the redux-saga & api is running in the BE
  <ApprovalListScreen
    approvalItems={mockApprovals}
  />
);
interface ApprovalListProps {
  approvalItems: ApprovalListItem[];
}
export const ApprovalListScreen = (props: ApprovalListProps) => {
  const { approvalItems } = props;
  const { filteredData, headerIndices } = convertApprovalListData(approvalItems);

  // TODO use FlatListEmptyComponent prop for rendering empty data in latest version of RN
  return ((filteredData.length === 0)
    ? (
      <View style={styles.emptyContainer}>
        {/* Placeholder for empty approval list subject to change */}
        <Text>Approval List is Empty </Text>
      </View>
    )
    : (
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
    )
  );
};

export default ApprovalList;
