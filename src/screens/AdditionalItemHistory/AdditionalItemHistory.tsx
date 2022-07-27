import React from 'react';
import { Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import moment from 'moment';
import { OHChangeHistory } from '../../models/ItemDetails';
import { mockOHChangeHistory } from '../../mockData/getItemDetails';
import styles from './AdditionalItemHistory.style';

interface AdditionalHistoryProps {
  data: OHChangeHistory[];
}
export const AdditionalItemHistoryScreen = (props: AdditionalHistoryProps) => {
  const { data } = props;

  const historyData = [...data].sort((a, b) => {
    const date1 = new Date(a.initiatedTimestamp);
    const date2 = new Date(b.initiatedTimestamp);
    return date2 > date1 ? 1 : -1;
  });
  return (
    <View>
      <FlatList
        data={historyData}
        renderItem={({ item }) => (
          <View style={styles.historyCard}>
            <Text>{moment(item.initiatedTimestamp).format('YYYY-MM-DD')}</Text>
            <Text>{item.oldQuantity}</Text>
          </View>
        )}
      />
    </View>
  );
};

const AdditionalItemHistory = () => (
  <AdditionalItemHistoryScreen data={mockOHChangeHistory} />
);

export default AdditionalItemHistory;
