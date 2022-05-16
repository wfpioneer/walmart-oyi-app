import React from 'react';
import {
  FlatList, Pressable, Text, View
} from 'react-native';
import { strings } from '../../locales';
import { PickListItem, PickStatus } from '../../models/Picking.d';
import PickItemInfo from '../PickItemInfoCard/PickItemInfoCard';
import styles from './PickPalletInfoCard.style';

interface PickPalletInfoProps {
  palletId: string;
  pickListItems: PickListItem[];
  onPress: () => void;
  pickStatus: PickStatus;
  palletLocation: string;
  onDeletePress: () => void;
  canDelete: boolean;
}

const PickPalletInfoCard = (props: PickPalletInfoProps) => {
  const {
    onPress, palletId, pickListItems, pickStatus, palletLocation, onDeletePress, canDelete
  } = props;

  const palletsItems = pickListItems.filter(item => item.palletId === palletId);

  const renderItem = ({ item }: { item: PickListItem }) => (
    <PickItemInfo
      pickListItem={item}
      canDelete={canDelete && pickStatus === PickStatus.READY_TO_PICK}
      onDeletePressed={() => onDeletePress()}
    />
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
