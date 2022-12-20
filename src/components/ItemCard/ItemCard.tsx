import React from 'react';
import {
  ActivityIndicator, Platform, Text, TouchableOpacity, View
} from 'react-native';
import styles from './ItemCard.style';
import COLOR from '../../themes/Color';
import { strings } from '../../locales';
import ImageWrapper from '../ImageWrapper/ImageWrapper';

interface ItemCardProps {
  itemNumber: number,
  onHandQty: number | undefined,
  description: string,
  onClick: (itemNumber: number) => void;
  loading: boolean;
  countryCode: string;
  showItemImage: boolean;
}

const getContainerStyle = (isLoading: boolean, showItemImage: boolean) => {
  if (isLoading) {
    return showItemImage ? styles.loaderContainer : { ...styles.loaderContainer, height: 60 };
  }
  return showItemImage ? styles.container : { ...styles.container, paddingLeft: 10 };
};

const ItemCard = ({
  itemNumber, description, onClick, loading, onHandQty,
  countryCode, showItemImage
}: ItemCardProps) => (
  <View style={styles.mainContainer}>
    <TouchableOpacity
      style={getContainerStyle(loading, showItemImage)}
      onPress={() => {
        if (!loading) {
          onClick(itemNumber);
        }
      }}
      testID="itemCard"
    >
      {showItemImage && !loading && (
      <ImageWrapper
        countryCode={countryCode}
        itemNumber={itemNumber}
      />
      )}
      {loading && (
      <View style={styles.loader} testID="loader">
        <ActivityIndicator size={30} color={Platform.OS === 'android' ? COLOR.MAIN_THEME_COLOR : undefined} />
      </View>
      )}
      {!loading && (
      <View style={styles.itemDetails} testID="item-details">
        <View style={!showItemImage ? styles.itemNbrView : {}}>
          <Text style={styles.itemNbr}>{`${strings('GENERICS.ITEM')} ${itemNumber}`}</Text>
        </View>
        <View>
          <Text style={styles.itemDesc}>{description}</Text>
        </View>
        {onHandQty !== undefined && (
          <View>
            <Text style={styles.itemNbr}>{`${strings('ITEM.ON_HANDS')} ${onHandQty.toString()}`}</Text>
          </View>
        )}
      </View>
      )}
    </TouchableOpacity>
  </View>
);

export default ItemCard;
