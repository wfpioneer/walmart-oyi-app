import React from 'react';
import { Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { strings } from '../../locales';
import { PickListItem } from '../../models/Picking.d';
import COLOR from '../../themes/Color';
import Button from '../buttons/Button';
import styles from './PickItemInfoCard.style';

interface PickItemInfoProps {
  pickListItem: PickListItem;
  canDelete: boolean;
  onDeletePressed: () => void;
}

export const deleteView = (onDeletePressed: () => void) => (
  <View>
    <Button
      style={styles.deleteButton}
      title={strings('GENERICS.DELETE')}
      backgroundColor={COLOR.RED}
      type={1}
      onPress={onDeletePressed}
    />
  </View>
);

const PickItemInfo = (props: PickItemInfoProps) => {
  const { pickListItem, canDelete, onDeletePressed } = props;
  const {
    itemDesc,
    category,
    itemNbr,
    upcNbr,
    salesFloorLocationName,
    createdBy,
    createTS,
    assignedAssociate,
    moveToFront
  } = pickListItem;

  return (
    <Swipeable renderRightActions={() => deleteView(onDeletePressed)} enabled={canDelete}>
      <View style={styles.container}>
        <View style={styles.itemDescContainer}>
          <Text style={styles.itemDescText}>{itemDesc}</Text>
          <Text style={styles.contentText}>
            {`${strings('ITEM.CATEGORY')}: ${category}`}
          </Text>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.salesFloorContainer}>
            <Text style={styles.contentText}>
              {`${strings('ITEM.SALES_FLOOR_QTY')}: ${
                moveToFront ? strings('PICKING.FRONT') : salesFloorLocationName
              }`}
            </Text>
            <Text style={styles.contentText}>
              {`${strings('PICKING.ASSIGNED')}: ${assignedAssociate || strings('GENERICS.UNASSIGNED')}`}
            </Text>
            <Text style={styles.contentText}>
              {`${strings('PICKING.CREATED_BY')}: ${createdBy}`}
            </Text>
          </View>
          <View style={styles.salesFloorContainer}>
            <Text style={styles.contentText}>
              {`${strings('GENERICS.ITEM')}: ${itemNbr}`}
            </Text>
            <Text style={styles.contentText}>
              {`${strings('ITEM.UPC')}: ${upcNbr}`}
            </Text>
            <Text style={styles.contentText}>
              {`${strings('PICKING.CREATED')}: ${createTS}`}
            </Text>
          </View>
        </View>
      </View>
    </Swipeable>
  );
};

export default PickItemInfo;
