import React from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Dispatch } from 'redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FilteredCategory } from '../../models/FilterListItem';
import { MenuCard } from '../../screens/Worklist/FilterMenu/FilterMenu';
import { strings } from '../../locales';
import { trackEvent } from '../../utils/AppCenterTool';
import COLOR from '../../themes/Color';
import styles from './CategoryCollapsibleCard.style';

export const renderCategoryFilterCard = (
  item: FilteredCategory,
  dispatch: Dispatch<any>,
  filterCategories: string[],
  source: string,
  updateFilterCategories: (categories: string[]) => void
): JSX.Element => {
  const onItemPress = () => {
    if (item.selected) {
      filterCategories.splice(
        filterCategories.indexOf(`${item.catgNbr} - ${item.catgName}`),
        1
      );
      trackEvent(`${source}_update_filter_categories`, {
        categories: JSON.stringify(filterCategories)
      });
      return dispatch(updateFilterCategories(filterCategories));
    }

    const replacementFilter = filterCategories;
    replacementFilter.push(`${item.catgNbr} - ${item.catgName}`);
    return dispatch(updateFilterCategories(replacementFilter));
  };
  return (
    <TouchableOpacity
      testID="category button"
      style={styles.categoryFilterCard}
      onPress={onItemPress}
    >
      <View style={styles.selectionView}>
        {item.selected ? (
          <MaterialCommunityIcons
            name="checkbox-marked-outline"
            size={15}
            color={COLOR.MAIN_THEME_COLOR}
          />
        ) : (
          <MaterialCommunityIcons
            name="checkbox-blank-outline"
            size={15}
            color={COLOR.MAIN_THEME_COLOR}
          />
        )}
      </View>
      <Text style={styles.categoryFilterText} numberOfLines={2}>
        {`${item.catgNbr} - ${item.catgName} `}
      </Text>
    </TouchableOpacity>
  );
};

export const RenderCategoryCollapsibleCard = (props: {
    categoryMap: FilteredCategory[];
    categoryOpen: boolean;
    filterCategories: string[];
    dispatch: Dispatch<any>;
    source: string;
    toggleCategories: (open: boolean) => void;
    updateFilterCatgories: (categories: string[]) => void
  }): JSX.Element => {
  const {
    categoryMap, categoryOpen, filterCategories,
    dispatch, source,
    toggleCategories, updateFilterCatgories
  } = props;
  const categoryNumberMap = categoryMap.map(
    (item: FilteredCategory) => item.catgNbr
  );
  const categoryNumberSet = new Set();
  categoryNumberMap.forEach((item: any) => categoryNumberSet.add(item));
  const filteredCategories = categoryMap.filter((item: any) => {
    if (categoryNumberSet.has(item.catgNbr)) {
      categoryNumberSet.delete(item.catgNbr);
      return true;
    }
    return false;
  });

  let categorySubtext = '';
  if (filterCategories.length === 0) {
    categorySubtext = strings('WORKLIST.ALL');
  } else {
    categorySubtext = `${filterCategories.length} ${strings(
      'GENERICS.SELECTED'
    )}`;
  }

  return (
    <>
      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => {
          dispatch(toggleCategories(!categoryOpen));
        }}
      >
        <MenuCard
          title={strings('WORKLIST.CATEGORY')}
          subtext={categorySubtext}
          opened={categoryOpen}
        />
      </TouchableOpacity>
      {categoryOpen && (
      <FlatList
        data={filteredCategories}
        renderItem={({ item }) => renderCategoryFilterCard(
          item,
          dispatch,
          filterCategories,
          source,
          updateFilterCatgories
        )}
        style={styles.categoryList}
        keyExtractor={(item: any) => item.catgNbr.toString()}
      />
      )}
    </>
  );
};
