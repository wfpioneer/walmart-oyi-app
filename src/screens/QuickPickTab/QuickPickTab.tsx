import React from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  View
} from 'react-native';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { PickingState } from '../../state/reducers/Picking';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import User from '../../models/User';
import { PickListItem, PickStatus } from '../../models/Picking.d';
import ListGroup from '../../components/ListGroup/ListGroup';
import { strings } from '../../locales';
import styles from './QuickPickTab.style';
import { Tabs } from '../../navigators/PickingNavigator';

interface QuickPickTabScreenProps {
  quickPicks: PickListItem[];
  user: User;
  dispatch: Dispatch<any>;
}

interface GroupItem {
  picks: PickListItem[];
  title: string
}

export const QuickPickTabScreen = (props: QuickPickTabScreenProps) => {
  const { quickPicks, user, dispatch } = props;
  const [assignedToMe, assignedToOthers] = quickPicks.reduce(
    ([mine, others]: [PickListItem[], PickListItem[]], pick) => (
      pick.assignedAssociate === user.userId ? [[...mine, pick], others] : [mine, [...others, pick]]
    ), [[], []]
  );
  const picks = assignedToOthers.filter(
    pick => pick.status === PickStatus.ACCEPTED_PICK || pick.status === PickStatus.READY_TO_PICK
  );
  const bins = assignedToOthers.filter(
    pick => pick.status === PickStatus.ACCEPTED_BIN || pick.status === PickStatus.READY_TO_BIN
  );
  const work = assignedToOthers.filter(pick => pick.status === PickStatus.READY_TO_WORK);

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
      currentTab={Tabs.QUICKPICK}
      dispatch={dispatch}
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

interface QuickPickTabProps {
  quickPickItems: PickListItem[]
}

const QuickPickTab = (props: QuickPickTabProps) => {
  const dispatch = useDispatch();
  const user = useTypedSelector(state => state.User);

  return (
    <QuickPickTabScreen
      quickPicks={props.quickPickItems}
      user={user}
      dispatch={dispatch}
    />
  );
};

export default QuickPickTab;
