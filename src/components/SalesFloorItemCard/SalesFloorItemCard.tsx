import moment from 'moment';
import React from 'react';
import { Text, View } from 'react-native';
import { strings } from '../../locales';
import NumericSelector from '../NumericSelector/NumericSelector';
import styles from './SalesFloorItemCard.style';

export const MAX = 999;

interface SFItemCardProps {
  itemDesc: string;
  salesFloorLocation: string;
  createdBy: string;
  createdTS: string;
  assigned: string;
  itemNbr: number;
  upcNbr: string;
  category: number;
  quantity: number;
  incrementQty: () => void;
  decrementQty: () => void;
  onQtyTextChange: (text: string) => void;
  onEndEditing(): void;
  stockedQty: number;
  incrementStckQty: () => void;
  decrementStckQty: () => void;
}

const SalesFloorItemCard = (props: SFItemCardProps) => {
  const {
    itemDesc, salesFloorLocation, createdBy,
    createdTS, assigned, itemNbr, upcNbr,
    category, quantity, incrementQty,
    decrementQty, onQtyTextChange, onEndEditing,
    stockedQty, incrementStckQty, decrementStckQty
  } = props;

  const isValid = () => quantity >= 0 && quantity <= MAX;

  return (
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
            {`${strings('ITEM.SALES_FLOOR_QTY')}: ${salesFloorLocation}`}
          </Text>
          <Text style={styles.contentText}>
            {`${strings('PICKING.ASSIGNED')}: ${assigned}`}
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
            {`${strings('PICKING.CREATED')}: ${moment(createdTS).format('hh:mm A DD/MM/YYYY')}`}
          </Text>
        </View>
      </View>
      <View style={styles.quantityContainer}>
        <Text>{strings('PICKING.REMAINING_QTY')}</Text>
        <NumericSelector
          isValid={isValid()}
          maxValue={MAX}
          minValue={0}
          onDecreaseQty={decrementQty}
          onIncreaseQty={incrementQty}
          onTextChange={(text: string) => onQtyTextChange(text)}
          value={quantity}
          onEndEditing={onEndEditing}
        />
      </View>
      <View style={styles.quantityContainer}>
        <Text>{strings('PICKING.QUANTITY_STOCKED')}</Text>
        <NumericSelector
          isValid={isValid()}
          maxValue={MAX}
          minValue={0}
          onDecreaseQty={decrementStckQty}
          onIncreaseQty={incrementStckQty}
          onTextChange={(text: string) => onQtyTextChange(text)}
          value={0}
          onEndEditing={onEndEditing}
        />
      </View>
    </View>
  );
};

export default SalesFloorItemCard;
