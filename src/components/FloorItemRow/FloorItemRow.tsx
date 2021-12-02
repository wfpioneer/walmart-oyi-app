import React, { Dispatch } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import styles from './FloorItemRow.style';
import { currencies, strings } from '../../locales';
import { SectionDetailsItem } from '../../models/LocationItems';
import { setScannedEvent } from '../../state/actions/Global';

export type FloorItemRowProps = {
  item: SectionDetailsItem;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
};

const FloorItemRow = (props: FloorItemRowProps): JSX.Element => {
  const { item, dispatch, navigation } = props;
  const itemOnPress = () => {
    dispatch(
      setScannedEvent({ type: 'Section', value: item.itemNbr.toString() })
    );
    navigation.navigate('ReviewItemDetails');
  };
  return (
    <TouchableOpacity onPress={() => itemOnPress()}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.itemNbr}>
            {`${strings('ITEM.ITEM')} ${item.itemNbr}`}
          </Text>
          <Text style={styles.itemDesc}>{item.itemDesc}</Text>
          <Text style={styles.price}>{currencies(item.price)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FloorItemRow;
