import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { ApprovalCard } from '../../components/approvalCard/ApprovalCard';
import { ApprovalListItem } from '../../models/ApprovalListItem';
import styles from './ApprovalList.style';
import { mockApprovals } from '../../mockData/mockApprovalItem';

export const renderApprovalItem = (approvalItem: ApprovalListItem) => {
  const {
    imageUrl, itemNbr, itemName, oldQuantity,
    newQuantity, dollarChange, userId, daysLeft
  } = approvalItem;

  return (
    <ApprovalCard
      dollarChange={dollarChange}
      daysLeft={daysLeft}
      image={imageUrl}
      itemName={itemName}
      itemNbr={itemNbr}
      oldQuantity={oldQuantity}
      newQuantity={newQuantity}
      userId={userId}
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

  return ((approvalItems.length === 0)
    ? (
      <View style={styles.emptyContainer}>
        {/* Placeholder for empty approval list subject to change */}
        <Text>Approval List is Empty </Text>
      </View>
    )
    : (
      <View>
        <FlatList
          data={approvalItems}
          keyExtractor={(item: any) => item.itemNbr.toString()}
          renderItem={(item: any) => renderApprovalItem({ ...item.item })}
        />
      </View>
    )
  );
};

export default ApprovalList;
