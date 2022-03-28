import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { PickingState } from '../../state/reducers/Picking';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import User from '../../models/User';
import { PickListItem, PickStatus } from '../../models/Picking.d';
import PickPalletInfoCard from '../../components/PickPalletInfoCard/PickPalletInfoCard';
import { strings } from '../../locales';

interface QuickPickTabProps {
  picking: PickingState;
  user: User;
}

export const QuickPickTabScreen = (props: QuickPickTabProps) => {
  const { picking, user } = props;
  const quickPicks = picking.pickList.filter(pick => pick.quickPick);
  const assignedToMe = quickPicks.filter(pick => pick.assignedAssociate === user.userId);
  const picks = quickPicks.filter(
    pick => pick.status === PickStatus.ACCEPTED_PICK || pick.status === PickStatus.READY_TO_PICK
  );
  const bins = quickPicks.filter(
    pick => pick.status === PickStatus.ACCEPTED_BIN || pick.status === PickStatus.READY_TO_BIN
  );
  const work = quickPicks.filter(pick => pick.status === PickStatus.READY_TO_WORK);

  const renderItem = ({ item }: { item: PickListItem }) => (
    <PickPalletInfoCard
      onPress={() => {}}
      palletId={item.palletId}
      palletLocation={item.palletLocation}
      pickListItems={[item]}
      pickStatus={item.status}
    />
  );

  const mockDropDownCard = (title: string, items: PickListItem[]) => (
    <View>
      <Text>{title}</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
      />
    </View>
  );

  return (
    <View>
      {mockDropDownCard(strings('PICKING.ASSIGNED_TO_ME'), assignedToMe)}
      {mockDropDownCard(strings('PICKING.PICK'), picks)}
      {mockDropDownCard(strings('PICKING.WORK'), work)}
      {mockDropDownCard(strings('PICKING.BIN'), bins)}
    </View>
  );
};

const QuickPickTab = () => {
  const picking = useTypedSelector(state => state.Picking);
  const user = useTypedSelector(state => state.User);

  return (
    <QuickPickTabScreen
      picking={picking}
      user={user}
    />
  );
};

export default QuickPickTab;
