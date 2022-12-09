import React from 'react';
import {
  ActivityIndicator, Image, Platform, Text, TouchableOpacity, View
} from 'react-native';
import styles from './ItemCard.style';
import COLOR from '../../themes/Color';
import { strings } from '../../locales';
import ImageWrapper from '../ImageWrapper/ImageWrapper';

interface ItemCardProps {
  imageUrl: { uri: string } | undefined,
  itemNumber: number,
  onHandQty: number | undefined,
  description: string,
  onClick: (itemNumber: number) => void;
  loading: boolean;
  countryCode: string;
  showItemImage: boolean;
}

const ItemCard = ({
  imageUrl, itemNumber, description, onClick, loading, onHandQty,
  countryCode, showItemImage
}: ItemCardProps) => (
  <View style={{ width: '100%' }}>
    <TouchableOpacity
      style={!loading ? styles.container : styles.loaderContainer}
      onPress={() => {
        if (!loading) {
          onClick(itemNumber);
        }
      }}
      testID="itemCard"
    >
      {showItemImage && (
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
        <View>
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
