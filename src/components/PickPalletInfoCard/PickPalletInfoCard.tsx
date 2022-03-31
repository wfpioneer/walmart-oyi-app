import React from 'react';
import {
  FlatList,
  Pressable,
  Text,
  View
} from 'react-native';
import { strings } from '../../locales';
import { PickListItem, PickStatus } from '../../models/Picking.d';
import styles from './PickPalletInfoCard.style';

interface PickPalletInfoProps {
  palletId: number;
  pickListItems: PickListItem[];
  onPress: () => void;
  pickStatus: PickStatus;
  palletLocation: string;
}

const PickPalletInfoCard = (props: PickPalletInfoProps) => {
  const {
    onPress,
    palletId,
    pickListItems,
    pickStatus,
    palletLocation
  } = props;

  const palletsItems = pickListItems.filter(item => item.palletId === palletId);

  // TODO replace with pickpalletinfocard
  const renderItem = ({ item }: { item: PickListItem }) => (
    <View style={styles.itemList}>
      <Text>{item.itemDesc}</Text>
      <Text>{item.itemNbr}</Text>
    </View>
  );

  const pickStatusString = () => pickStatus.toUpperCase().replace(/\s/g, '_');

  return (
    <View style={styles.container}>
      <Pressable onPress={onPress} testID="palletPress">
        <View style={styles.header}>
          <Text>{`${strings('PALLET.PALLET_ID')} ${palletId}`}</Text>
          <Text>{strings(`PICKING.${pickStatusString()}`)}</Text>
          <Text>{palletLocation}</Text>
        </View>
        <FlatList
          data={palletsItems}
          renderItem={renderItem}
          scrollEnabled={false}
          keyExtractor={(item, index) => `${item.id}-${index}`}
        />
      </Pressable>
    </View>
  );
};

export default PickPalletInfoCard;
