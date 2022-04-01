import React, { useState } from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { groupBy, head, uniq } from 'lodash';
import {
  NavigationProp, useNavigation
} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PickPalletInfoCard from '../PickPalletInfoCard/PickPalletInfoCard';
import { PickListItem } from '../../models/Picking.d';
import styles from './ListGroup.style';
import COLOR from '../../themes/Color';

interface ListGroupProps {
  title: string;
  pickListItems: PickListItem[];
  groupItems?: boolean;
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
      <TouchableOpacity testID="collapsible-card" style={styles.arrowView} onPress={() => toggleIsOpened(!isOpened)}>
        <MaterialIcons name={iconName} size={25} color={COLOR.BLACK} />
      </TouchableOpacity>
    </>
  );
};

const sortPickListByPalletLocation = (items: PickListItem[]) => (items.sort(
  (a, b) => (a.palletLocationName > b.palletLocationName ? 1 : -1)
));

const sortPickListByCreatedDate = (items: PickListItem[]) => (items.sort(
  (a, b) => new Date(a.createTS).valueOf() - new Date(b.createTS).valueOf()
));

const getGroupItemsBasedOnPallet = (items: PickListItem[]) => {
  const sortedItems = sortPickListByPalletLocation(items);
  return groupBy(sortedItems, item => item.palletId);
};

const renderPickPalletInfoList = (items: PickListItem[], navigation: NavigationProp<any>) => {
  const item = head(items);
  return item ? (
    <PickPalletInfoCard
      onPress={() => navigation.navigate('PickBinWorkflow')}
      palletId={item.palletId}
      palletLocation={item.palletLocationName}
      pickListItems={items}
      pickStatus={item.status}
    />
  ) : null;
};

const renderGroupItems = (items: PickListItem[], navigation: NavigationProp<any>) => {
  const groupedItemList = getGroupItemsBasedOnPallet(items);
  const sortedPalletIdsBasedonLocation = uniq(
    sortPickListByPalletLocation(items).map(item => item.palletId.toString())
  );
  return (
    <FlatList
      data={sortedPalletIdsBasedonLocation}
      renderItem={({ item }) => renderPickPalletInfoList(groupedItemList[item], navigation)}
      scrollEnabled={false}
      keyExtractor={(item, index) => `ListGroup-${item}-${index}`}
    />
  );
};

const renderItems = (items: PickListItem[], navigation: NavigationProp<any>) => {
  const pickListItems = sortPickListByCreatedDate(items);
  return (
    <FlatList
      data={pickListItems}
      renderItem={({ item }) => renderPickPalletInfoList([item], navigation)}
      scrollEnabled={false}
      keyExtractor={(item, index) => `ListGroup-${item}-${index}`}
    />
  );
};

const ListGroup = (props: ListGroupProps): JSX.Element => {
  const {
    title,
    pickListItems,
    groupItems
  } = props;

  const [listGroupOpen, toggleListGroup] = useState(true);
  const navigation = useNavigation();

  return (
    <View>
      <View style={styles.menuContainer}>
        <CollapsibleCard title={title} isOpened={listGroupOpen} toggleIsOpened={toggleListGroup} />
      </View>
      {listGroupOpen
        && (
        <View>
          {groupItems ? renderGroupItems(pickListItems, navigation) : renderItems(pickListItems, navigation)}
        </View>
        )}
    </View>
  );
};

ListGroup.defaultProps = {
  groupItems: false
};

export default ListGroup;
