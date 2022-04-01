import React, { useState } from 'react';
import {
  FlatList, Text, TouchableOpacity, View
} from 'react-native';
import { groupBy } from 'lodash';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NavigationProp } from '@react-navigation/native';
import PickPalletInfoCard from '../PickPalletInfoCard/PickPalletInfoCard';
import { PickListItem } from '../../models/Picking.d';
import styles from './ListGroup.style';
import COLOR from '../../themes/Color';

interface ListGroupProps {
  title: string;
  pickListItems: PickListItem[];
  groupItems?: boolean;
  navigation: NavigationProp<any>
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

const sortPickListByPalletLocation = (items: PickListItem[]) => (
  items.sort((a, b) => (a.palletLocationName > b.palletLocationName ? -1 : 1)));

const sortPickListByCreatedDate = (items: PickListItem[]) => (
  items.sort(
    (a, b) => new Date(a.createTS).valueOf() - new Date(b.createTS).valueOf()
  ));

const getGroupItemsBasedOnPallet = (items: PickListItem[]) => {
  const sortedItems = sortPickListByPalletLocation(items);
  return groupBy(sortedItems, item => item.palletId);
};

const renderPickPalletInfoList = (
  items: PickListItem[],
  navigation: NavigationProp<any>
) => {
  const item = items[0];
  return (
    <PickPalletInfoCard
      // TODO: Placeholder method for pickBinWorkflow Navigation
      onPress={() => navigation.navigate('PickBinWorkFlow')}
      palletId={item.palletId}
      palletLocation={item.palletLocationName}
      pickListItems={items}
      pickStatus={item.status}
    />
  );
};

const renderGroupItems = (items: PickListItem[], navigation: NavigationProp<any>) => {
  const pickListItems = getGroupItemsBasedOnPallet(items);
  const groupedPickListKeys = Object.keys(pickListItems);
  return (
    <FlatList
      data={groupedPickListKeys}
      renderItem={({ item }) => renderPickPalletInfoList(pickListItems[item], navigation)}
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
      keyExtractor={(item, index) => `ListGroup-${item}-$${index}`}
    />
  );
};

const ListGroup = (props: ListGroupProps): JSX.Element => {
  const {
    title, pickListItems, groupItems, navigation
  } = props;

  const [listGroupOpen, toggleListGroup] = useState(true);
  return (
    <View key={title}>
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
            ? renderGroupItems(pickListItems, navigation)
            : renderItems(pickListItems, navigation)}
        </View>
      )}
    </View>
  );
};

ListGroup.defaultProps = {
  groupItems: false
};

export default ListGroup;
