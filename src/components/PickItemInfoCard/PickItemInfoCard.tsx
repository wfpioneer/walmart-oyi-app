import React from 'react';
import { Text, View } from 'react-native';
import { strings } from '../../locales';
import { PickListItem } from '../../models/Picking.d';
import styles from './PickItemInfoCard.style';

interface PickItemInfoProps {
  pickListItem: PickListItem;
  canDelete: boolean;
  onDeletePressed: () => void;
}

const PickItemInfo = (props: PickItemInfoProps) => {
  const { pickListItem, canDelete, onDeletePressed } = props;
  const {
    itemDesc,
    category,
    itemNbr,
    upcNbr,
    salesFloorLocation,
    createdBy,
    createTS,
    assignedAssociate,
    id,
    moveToFront,
    palletId,
    palletLocation,
    quickPick,
    status
  } = pickListItem;

  return (
    <View style={styles.container}>
      <View style={styles.itemDescContainer}>
        <Text style={styles.itemDescText}>{itemDesc}</Text>
        <Text style={styles.contentText}>{`Cat: ${category}`}</Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.salesFloorContainer}>
          <Text style={styles.contentText}>{`${strings('ITEM.SALES_FLOOR_QTY')}: ${palletLocation}` }</Text>
          <Text style={styles.contentText}>{`${strings('PICKING.ASSIGNED')}: ${assignedAssociate}`}</Text>
          <Text style={styles.contentText}>{`${strings('PICKING.CREATED_BY')}: ${createdBy}` }</Text>
        </View>
        <View style={styles.salesFloorContainer}>
          <Text style={styles.contentText}>{`${strings('GENERICS.ITEM')}: ${itemNbr}`}</Text>
          <Text style={styles.contentText}>{`${strings('ITEM.UPC')}: ${upcNbr}`}</Text>
          <Text style={styles.contentText}>{`${strings('PICKING.CREATED')}: ${createTS}`}</Text>
        </View>
      </View>
    </View>
  );
};

export default PickItemInfo;
