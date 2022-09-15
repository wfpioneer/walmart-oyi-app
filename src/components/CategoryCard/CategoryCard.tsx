import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './CategoryCard.style';
import { WorklistItemI } from '../../models/WorklistItem';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';

export type CategoryCardProps = {
  listOfItems: WorklistItemI[];
  category: string;
  collapsed: boolean;
};

const CategoryCard = (props: CategoryCardProps): JSX.Element => {
  const {
    listOfItems, category, collapsed
  } = props;

  const [open, setOpen] = useState(true);
  const iconName = open ? 'keyboard-arrow-down' : 'keyboard-arrow-up';

  useEffect(() => {
    if (collapsed) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [collapsed]);

  // placeholder render item
  const renderItem = ({ item }: { item: WorklistItemI }) => {
    const {
      itemName, itemNbr
    } = item;
    return (
      <TouchableOpacity style={styles.itemContainer}>
        <View style={styles.content}>
          <Text style={styles.itemInfo}>
            { itemName }
          </Text>
          <Text style={styles.itemNumber}>
            { itemNbr }
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text>
            {category}
          </Text>
          <Text>
            {`${listOfItems.length} ${strings('GENERICS.ITEMS')}`}
          </Text>
        </View>
        <TouchableOpacity
          hitSlop={{
            top: 10, bottom: 10, left: 15, right: 15
          }}
          onPress={() => setOpen(!open)}
          testID="collapsible-card"
        >
          <MaterialIcons name={iconName} size={25} color={COLOR.MAIN_THEME_COLOR} />
        </TouchableOpacity>
      </View>
      {open && (
        <FlatList
          data={listOfItems}
          renderItem={renderItem}
          keyExtractor={(item: WorklistItemI, index: number) => item.itemNbr + index.toString()}
        />
      )}
    </View>
  );
};

export default CategoryCard;
