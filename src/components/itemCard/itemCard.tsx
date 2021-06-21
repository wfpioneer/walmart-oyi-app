import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './itemCard.style';
import { strings } from '../../locales';
import { COLOR } from '../../themes/Color';

const ItemCard: React.FunctionComponent<any> = (props: any) => {
  const { zoneName, aisleCount } = props;
  return (
    <TouchableOpacity style={styles.item}>
      <View style={styles.itemContainer}>
        <View style={styles.categoryText}>
          <Text>{zoneName}</Text>
          <View>
            <Text style={styles.aisleText}>
              {' '}
              {aisleCount}
              {' '}
              {strings('LOCATION.AISLES')}
            </Text>
          </View>
        </View>
        <View style={styles.arrowIcon}>
          <MaterialCommunityIcon name="chevron-right" size={20} color={COLOR.TIP_BLUE} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ItemCard;
