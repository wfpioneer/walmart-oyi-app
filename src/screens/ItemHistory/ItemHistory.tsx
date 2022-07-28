import moment from 'moment';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { ItemHistoryState } from '../../state/reducers/ItemHistory';
import { ItemHistoryI } from '../../models/ItemDetails';
import styles from './ItemHistory.style';

interface ItemHistoryProps {
  data: ItemHistoryI[]
}

export const ItemHistoryScreen = (props: ItemHistoryProps) => {
  const { data } = props;
  const dateBefSixMonth = moment().subtract(180, 'days');
  const sortedData = data.filter(item => moment(item.date) > dateBefSixMonth)
    .sort((a, b) => {
      const date1 = moment(a.date);
      const date2 = moment(b.date);
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

const ItemHistory = () => {
  const { data } = useTypedSelector(state => state.ItemHistory) as ItemHistoryState;
  return (
    <ItemHistoryScreen data={data} />
  );
};

export default ItemHistory;
