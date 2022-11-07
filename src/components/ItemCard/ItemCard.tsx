import React from 'react';
import {
  ActivityIndicator, Image, Platform, Text, TouchableOpacity, View
} from 'react-native';
import styles from './ItemCard.style';
import COLOR from '../../themes/Color';
import { strings } from '../../locales';

interface ItemCardProps {
  imageUrl: { uri: string } | undefined,
  itemNumber: number,
  onHandQty?: number,
  description: string,
  onClick: () => void,
  loading: boolean
}

const ItemCard = ({
  imageUrl, itemNumber, description, onClick, loading, onHandQty
}: ItemCardProps) => (
  <View style={{ width: '100%' }}>
    <TouchableOpacity
      style={!loading ? styles.container : styles.loaderContainer}
      onPress={() => {
        if (!loading) {
          onClick();
        }
      }}
      testID="itemCard"
    >
      <Image
        style={styles.image}
        source={(!loading && imageUrl) || require('../../assets/images/placeholder.png')}
      />
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
        {onHandQty === null || onHandQty === undefined ?
          <View>
            <Text style={styles.itemNbr}>{`${strings('ITEM.ON_HANDS')} ${onHandQty}`}</Text>
          </View> : null
        }

      </View>
      )}
    </TouchableOpacity>
  </View>
);

export default ItemCard;
