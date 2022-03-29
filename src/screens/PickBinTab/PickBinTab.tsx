import React from 'react';
import {
  FlatList, Text, View
} from 'react-native';
import { groupBy } from 'lodash';
import { PickingState } from '../../state/reducers/Picking';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import User from '../../models/User';
import { PickListItem } from '../../models/Picking.d';
import PickPalletInfoCard from '../../components/PickPalletInfoCard/PickPalletInfoCard';
import { strings } from '../../locales';
import styles from './PickBinTab.style';

interface PickBinTabProps {
  picking: PickingState;
  user: User;
}

const getZoneFromPalletLocation = (palletLocation: string|undefined) => (palletLocation ? palletLocation.substring(0,
  palletLocation.indexOf('-')).replace(/[^a-zA-Z]+/g, '') : '');

const renderItem = ({ item }: { item: PickListItem }) => (
  <PickPalletInfoCard
    onPress={() => {}}
    palletId={item.palletId}
    palletLocation={item.palletLocationName}
    pickListItems={[item]}
    pickStatus={item.status}
  />
);

// TODO: Needs to be replaced with ListGroup component once it got merged to development
const mockListGroup = (title: string, items: PickListItem[]) => (
  <View>
    <Text>{title}</Text>
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item.id}-${index}`}
    />
  </View>
);

export const PickBinTabScreen = (props: PickBinTabProps) => {
  const { picking, user } = props;
  const assignedToMe = picking.pickList.filter(pick => pick.assignedAssociate === user.userId);
  const groupedPicksByZone = groupBy(picking.pickList,
    (item: PickListItem) => getZoneFromPalletLocation(item.palletLocationName));
  const sortedZones = Object.keys(groupedPicksByZone).sort((a, b) => (a > b ? 1 : -1));

  return (
    <View style={styles.container}>
      <View>
        {mockListGroup(strings('PICKING.ASSIGNED_TO_ME'), assignedToMe)}
        {sortedZones.map((key: string) => (
          mockListGroup(key, groupedPicksByZone[key])
        ))}
      </View>
      <View style={styles.scanItemLabel}>
        <Text>{strings('PICKING.SCAN_ITEM_LABEL')}</Text>
      </View>
    </View>
  );
};

const PickBinTab = () => {
  const picking = useTypedSelector(state => state.Picking);
  const user = useTypedSelector(state => state.User);

  return (
    <PickBinTabScreen
      picking={picking}
      user={user}
    />
  );
};

export default PickBinTab;
