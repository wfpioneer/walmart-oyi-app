import React from 'react';
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { strings } from '../../locales';
import NumericSelector from '../NumericSelector/NumericSelector';
import styles from './PalletItemCard.style';
import COLOR from '../../themes/Color';
import ImageWrapper from '../ImageWrapper/ImageWrapper';

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
    isAdded: boolean;
    onEndEditing(): void;
    showItemImage: boolean;
    countryCode: string;
  }

export const styleSelector = (isAdded: boolean, isEdited: boolean): Record<string, any> => {
  if (isAdded) {
    return styles.addedContainer;
  }
  return isEdited ? styles.editedContainer : styles.container;
};

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
    isValid,
    isAdded,
    onEndEditing,
    showItemImage,
    countryCode
  } = props;
  return (
    <View style={styleSelector(isAdded, markEdited)}>
      {showItemImage
      && (
      <ImageWrapper
        countryCode={countryCode}
        itemNumber={Number(itemNumber)}
      />
      )}
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
              onEndEditing={onEndEditing}
            />
          </View>
          <View>
            <TouchableOpacity onPress={() => { deleteItem(); }}>
              <MaterialCommunityIcons name="trash-can" size={40} color={COLOR.TRACKER_GREY} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
export default PalletItemCard;
