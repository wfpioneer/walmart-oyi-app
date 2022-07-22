import moment from 'moment';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { ItemHistoryState } from '../../state/reducers/ItemHistory';
import styles from './ItemHistory.style';

const ItemHistory = () => {
  const { data } = useTypedSelector(state => state.ItemHistory) as ItemHistoryState;
  const today = new Date();
  const dateBefSixMonth = new Date(today.getTime() - (180 * 24 * 60 * 60 * 1000));
  const sortedData = data.filter(item => new Date(item.date) > dateBefSixMonth)
    .sort((a, b) => {
      const date1 = new Date(a.date);
      const date2 = new Date(b.date);
      return date2 > date1 ? 1 : -1;
    });
  return (
    <View>
      <FlatList
        data={sortedData}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.historyCard}>
            <Text>{moment(item.date).format('YYYY-MM-DD')}</Text>
            <Text>{item.qty}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default ItemHistory;
