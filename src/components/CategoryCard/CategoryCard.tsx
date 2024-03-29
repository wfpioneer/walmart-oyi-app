import React, { useEffect, useState } from 'react';
import {
  FlatList, Text, TouchableOpacity, View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles, { ITEM_CARD_HEIGHT, ITEM_CARD_SEPARATOR_HEIGHT } from './CategoryCard.style';
import { WorklistItemI } from '../../models/WorklistItem';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';
import ItemCard from '../ItemCard/ItemCard';

export type CategoryCardProps = {
  listOfItems: WorklistItemI[];
  category: string;
  collapsed: boolean;
  onItemCardClick: (itemNumber: number, worklistType: string) => void;
  showItemImage: boolean;
  countryCode: string;
  enableAuditsInProgress: boolean;
  imageToken?: string | undefined;
  tokenIsWaiting?: boolean;
};

const CategoryCard = (props: CategoryCardProps): JSX.Element => {
  const {
    listOfItems, category, collapsed, onItemCardClick, showItemImage,
    countryCode, enableAuditsInProgress, tokenIsWaiting, imageToken
  } = props;

  const [open, setOpen] = useState(true);
  const iconName = open ? 'keyboard-arrow-up' : 'keyboard-arrow-down';

  useEffect(() => {
    if (collapsed) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [collapsed]);

  const renderItem = ({ item }: { item: WorklistItemI }) => {
    const {
      itemName, itemNbr, worklistType
    } = item;
    return (
      <TouchableOpacity style={styles.itemContainer}>
        <View style={styles.content}>
          <ItemCard
            itemNumber={itemNbr || 0}
            description={itemName || ''}
            onHandQty={undefined}
            onClick={() => {
              onItemCardClick(itemNbr || 0, worklistType);
            }}
            loading={false}
            showItemImage={showItemImage}
            countryCode={countryCode}
            status={enableAuditsInProgress ? item.worklistStatus : undefined}
            totalQty={undefined}
            imageToken={imageToken}
            tokenIsWaiting={tokenIsWaiting}
          />
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
            {`${listOfItems.length} ${strings('AUDITS.CUSTOM_ITEMS')}`}
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
          getItemLayout={(data, index) => ({
            index,
            length: ITEM_CARD_HEIGHT + ITEM_CARD_SEPARATOR_HEIGHT,
            offset: (ITEM_CARD_HEIGHT + ITEM_CARD_SEPARATOR_HEIGHT) * index
          })}
        />
      )}
    </View>
  );
};

export default CategoryCard;

CategoryCard.defaultProps = {
  imageToken: undefined,
  tokenIsWaiting: false
};
