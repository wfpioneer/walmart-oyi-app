import React from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  View
} from 'react-native';
import { PickingState } from '../../state/reducers/Picking';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import User from '../../models/User';
import { PickListItem, PickStatus } from '../../models/Picking.d';
import ListGroup from '../../components/ListGroup/ListGroup';
import { strings } from '../../locales';
import styles from './QuickPickTab.style';

interface QuickPickTabProps {
  picking: PickingState;
  user: User;
}

interface GroupItem {
  picks: PickListItem[];
  title: string
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

  const groupItems: GroupItem[] = [
    { picks: assignedToMe, title: strings('PICKING.ASSIGNED_TO_ME') },
    { picks, title: strings('PICKING.PICK') },
    { picks: work, title: strings('PICKING.WORK') },
    { picks: bins, title: strings('PICKING.BIN') }
  ];

  const renderItem = ({ item }: { item: GroupItem }) => (
    <ListGroup
      title={`${item.title} (${item.picks.length})`}
      groupItems={false}
      pickListItems={item.picks}
      key={item.title}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={groupItems}
        renderItem={renderItem}
        keyExtractor={item => item.title}
        extraData={quickPicks}
      />
      <View style={styles.scanTextView}>
        <Text style={styles.scanText}>{strings('PICKING.SCAN_ITEM_LABEL')}</Text>
      </View>
    </SafeAreaView>
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
