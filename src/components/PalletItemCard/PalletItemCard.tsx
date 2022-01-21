import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { strings } from '../../locales';
import NumericSelector from '../NumericSelector/NumericSelector';
import styles from './PalletItemCard.style';

interface PalletItemCardProp {
    itemName: string;
    price: number;
    upc: string;
    itemNumber: string;
    decreaseQuantity(): void;
    increaseQuantity(): void;
    onTextChange(text: string): void;
    numberOfItems: number;
    deleteItem(): void;
    markEdited: boolean;
    minValue: number;
    maxValue: number;
    isValid: boolean;
  }
const PalletItemCard = (props: PalletItemCardProp): JSX.Element => {
  const {
    itemName,
    price,
    upc,
    itemNumber,
    decreaseQuantity,
    increaseQuantity,
    onTextChange,
    numberOfItems,
    deleteItem,
    markEdited,
    minValue,
    maxValue,
    isValid
  } = props;
  return (
    <View style={markEdited ? styles.deletedContainer : styles.container}>
      <View style={styles.content}>
        <View style={styles.itemHeader}>
          <Text style={styles.textHeader}>
            {itemName}
          </Text>
          <Text style={styles.itemContainer}>
            {`${strings('GENERICS.CURRENCY_SYMBOL')} ${price}`}
          </Text>
        </View>
        <View style={styles.itemHeaderFirstRow}>
          <Text style={styles.textHeaderRows}>
            {`${strings('ITEM.UPC')}`}
          </Text>
          <View>
            <Text style={styles.textHeaderRows}>
              {`${strings('ITEM.ITEM_NUMBER')}`}
            </Text>
          </View>
        </View>
        <View style={styles.itemHeaderSecondRow}>
          <Text style={styles.textHeaderRows}>
            {upc}
          </Text>
          <View>
            <Text style={styles.textHeaderRows}>
              {itemNumber}
            </Text>
          </View>
        </View>
        <View style={styles.numericSelectorView}>
          <View>
            <NumericSelector
              onDecreaseQty={decreaseQuantity}
              onIncreaseQty={increaseQuantity}
              onTextChange={onTextChange}
              minValue={minValue}
              maxValue={maxValue}
              value={numberOfItems}
              isValid={isValid}
            />
          </View>
          <View style={styles.delete}>
            <TouchableOpacity onPress={() => { deleteItem(); }}>
              <View>
                <Image
                  source={require('../../assets/images/trash_can.png')}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
export default PalletItemCard;
