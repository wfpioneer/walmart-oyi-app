import React, { useState } from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { groupBy } from 'lodash';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { PickListItem } from '../../models/Picking.d';
import styles from './ListGroup.style';
import COLOR from '../../themes/Color';

interface ListGroupProps {
  title: string;
  pickListItems: PickListItem[];
  groupItems: boolean;
}

interface CollapsibleCardProps {
  title: string;
  isOpened: boolean;
  toggleIsOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export const CollapsibleCard = (props: CollapsibleCardProps): JSX.Element => {
  const { title, isOpened, toggleIsOpened } = props;
  const iconName = isOpened ? 'keyboard-arrow-up' : 'keyboard-arrow-down';

  return (
    <>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{ title }</Text>
      </View>
      <TouchableOpacity style={styles.arrowView} onPress={() => toggleIsOpened(!isOpened)}>
        <MaterialIcons name={iconName} size={25} color={COLOR.BLACK} />
      </TouchableOpacity>
    </>
  );
};

const sortPickListByPalletLocation = (items: PickListItem[]) => (items.sort(
  (a, b) => (a.palletLocation > b.palletLocation ? -1 : 1)
));

const sortPickListByCreatedDate = (items: PickListItem[]) => (items.sort(
  (a, b) => new Date(a.createTS).valueOf() - new Date(b.createTS).valueOf()
));

const getGroupItemsBasedOnPallet = (items: PickListItem[]) => {
  const sortedItems = sortPickListByPalletLocation(items);
  return groupBy(sortedItems, item => item.palletId);
};

// TODO: Need to replace it with pickPalletInfoCard Component
const pickPalletInfoCard = (items: PickListItem[]) => (
  <FlatList
    data={items}
    horizontal
    renderItem={({ item }) => (
      <View>
        <Text>{item.itemDesc}</Text>
        <Text>{item.itemNbr}</Text>
      </View>
    )}
    keyExtractor={item => item.palletLocation.toString()}
  />
);

const renderGroupItems = (items: PickListItem[]) => {
  const pickListItems = getGroupItemsBasedOnPallet(items);
  return Object.values(pickListItems).map(key => pickPalletInfoCard(pickListItems[key]));
};

const renderItems = (items: PickListItem[]) => {
  const pickListItems = sortPickListByCreatedDate(items);
  return (
    pickListItems.map((item: PickListItem) => pickPalletInfoCard([item]))
  );
};

const ListGroup = (props: ListGroupProps) => {
  const {
    title,
    pickListItems,
    groupItems
  } = props;

  const [listGroupOpen, toggleListGroup] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.menuContainer}>
        <CollapsibleCard title={title} isOpened={listGroupOpen} toggleIsOpened={toggleListGroup} />
      </View>
      {listGroupOpen
        && (
        <View>
          {groupItems ? renderGroupItems(pickListItems) : renderItems(pickListItems)}
        </View>
        )}
    </View>
  );
};

export default ListGroup;
