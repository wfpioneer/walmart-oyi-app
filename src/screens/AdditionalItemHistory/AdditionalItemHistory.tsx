import React from 'react';
import { Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import moment from 'moment';
import { OHChangeHistory } from '../../models/ItemDetails';
import { mockOHChangeHistory } from '../../mockData/getItemDetails';
import styles from './AdditionalItemHistory.style';

interface AdditionalHistoryProps {
  onHandsData: OHChangeHistory[];
}
export const AdditionalItemHistoryScreen = (props: AdditionalHistoryProps) => {
  const { onHandsData } = props;

  const historyData = [...onHandsData].sort((a, b) => {
    const date1 = new Date(a.initiatedTimestamp);
    const date2 = new Date(b.initiatedTimestamp);
    return date2 > date1 ? 1 : -1;
  });
  return (
    <View style={styles.container}>
      <FlatList
        data={historyData.slice(0, 30)}
        renderItem={({ item }) => (
          <View style={styles.historyCard}>
            <Text>{moment(item.initiatedTimestamp).format('YYYY-MM-DD')}</Text>
            <Text>{item.oldQuantity}</Text>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const AdditionalItemHistory = () => (
  <AdditionalItemHistoryScreen onHandsData={mockOHChangeHistory} />
);

export default AdditionalItemHistory;
