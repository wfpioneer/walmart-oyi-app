import React, { useState } from 'react';
import {
  FlatList, Text, TouchableOpacity, View
} from 'react-native';
import { groupBy, uniq } from 'lodash';
import {
  NavigationProp, useNavigation
} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Dispatch } from 'redux';
import PickPalletInfoCard from '../PickPalletInfoCard/PickPalletInfoCard';
import {
  PickAction, PickListItem, PickStatus, Tabs
} from '../../models/Picking.d';
import styles from './ListGroup.style';
import COLOR from '../../themes/Color';
import { selectPicks } from '../../state/actions/Picking';
import { updatePicklistStatus } from '../../state/actions/saga';

interface ListGroupProps {
  title: string;
  pickListItems: PickListItem[];
  groupItems?: boolean;
  currentTab: Tabs;
  dispatch: Dispatch<any>
}

interface CollapsibleCardProps {
  title: string;
  isOpened: boolean;
  toggleIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CollapsibleCard = (props: CollapsibleCardProps): JSX.Element => {
  const { title, isOpened, toggleIsOpened } = props;
  const iconName = isOpened ? 'keyboard-arrow-up' : 'keyboard-arrow-down';

  return (
    <>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{title}</Text>
      </View>
      <TouchableOpacity
        testID="collapsible-card"
        style={styles.arrowView}
        onPress={() => toggleIsOpened(!isOpened)}
      >
        <MaterialIcons name={iconName} size={25} color={COLOR.BLACK} />
      </TouchableOpacity>
    </>
  );
};

const sortPickListByPalletLocation = (items: PickListItem[]) => (items.sort(
  (a, b) => (a.palletLocationName > b.palletLocationName ? 1 : -1)
));

const sortPickListByCreatedDate = (items: PickListItem[]) => (
  items.sort(
    (a, b) => new Date(a.createTS).valueOf() - new Date(b.createTS).valueOf()
  ));

const getGroupItemsBasedOnPallet = (items: PickListItem[]) => {
  const sortedItems = sortPickListByPalletLocation(items);
  return groupBy(sortedItems, item => item.palletId);
};

const pickOrBin = (item: PickListItem) => item.status === PickStatus.ACCEPTED_BIN
  || item.status === PickStatus.ACCEPTED_PICK
  || item.status === PickStatus.READY_TO_BIN
  || item.status === PickStatus.READY_TO_PICK;

const handleWorkflowNav = (
  currentTab: Tabs,
  items: PickListItem[],
  navigation: NavigationProp<any>,
  dispatch: Dispatch<any>
) => {
  dispatch(selectPicks(items.reduce((pickIds: number[], pickItem) => [...pickIds, pickItem.id], [])));
  if (currentTab !== Tabs.SALESFLOOR && pickOrBin(items[0])) {
    navigation.navigate('PickBinWorkflow');
  } else {
    navigation.navigate('SalesFloorWorkflow');
  }
};

const renderPickPalletInfoList = (
  items: PickListItem[],
  navigation: NavigationProp<any>,
  currentTab: Tabs,
  dispatch: Dispatch<any>
) => {
  const item = items[0];
  const picklistItems = [{
    picklistId: item.id,
    locationId: item.palletLocationId,
    locationName: item.palletLocationName
  }];

  return (
    <PickPalletInfoCard
      onPress={() => handleWorkflowNav(currentTab, items, navigation, dispatch)}
      palletId={item.palletId}
      palletLocation={item.palletLocationName}
      pickListItems={items}
      pickStatus={item.status}
      canDelete={true}
      onDeletePress={() => dispatch(updatePicklistStatus({
        headers: { action: PickAction.DELETE },
        picklistItems,
        palletId: item.palletId
      }))}
    />
  );
};

const renderGroupItems = (
  items: PickListItem[],
  navigation: NavigationProp<any>,
  currentTab: Tabs,
  dispatch: Dispatch<any>
) => {
  const groupedItemList = getGroupItemsBasedOnPallet(items);
  const sortedPalletIdsBasedonLocation = uniq(
    sortPickListByPalletLocation(items).map(item => item.palletId.toString())
  );
  return (
    <FlatList
      data={sortedPalletIdsBasedonLocation}
      renderItem={({ item }) => renderPickPalletInfoList(groupedItemList[item], navigation, currentTab, dispatch)}
      scrollEnabled={false}
      keyExtractor={(item, index) => `ListGroup-${item}-${index}`}
    />
  );
};

const renderItems = (
  items: PickListItem[],
  navigation: NavigationProp<any>,
  currentTab: Tabs,
  dispatch: Dispatch<any>
) => {
  const pickListItems = sortPickListByCreatedDate(items);
  return (
    <FlatList
      data={pickListItems}
      renderItem={({ item }) => renderPickPalletInfoList([item], navigation, currentTab, dispatch)}
      scrollEnabled={false}
      keyExtractor={(item, index) => `ListGroup-${item}-${index}`}
    />
  );
};

const ListGroup = (props: ListGroupProps): JSX.Element => {
  const {
    title, pickListItems, groupItems, currentTab, dispatch
  } = props;

  const [listGroupOpen, toggleListGroup] = useState(true);
  const navigation = useNavigation();

  return (
    <View>
      <View style={styles.menuContainer}>
        <CollapsibleCard
          title={title}
          isOpened={listGroupOpen}
          toggleIsOpened={toggleListGroup}
        />
      </View>
      {listGroupOpen && (
        <View>
          {groupItems
            ? renderGroupItems(pickListItems, navigation, currentTab, dispatch)
            : renderItems(pickListItems, navigation, currentTab, dispatch)}
        </View>
      )}
    </View>
  );
};

ListGroup.defaultProps = {
  groupItems: false
};

export default ListGroup;
