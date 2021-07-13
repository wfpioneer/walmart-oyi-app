import React from 'react';
import {
  FlatList, Text, TouchableOpacity, View
} from 'react-native';
import { useDispatch } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Dispatch } from 'redux';
import styles from './FilterMenu.style';
import COLOR from '../../../themes/Color';
import { useTypedSelector } from '../../../state/reducers/RootReducer';
import {
  clearFilter,
  toggleCategories,
  toggleExceptions,
  updateFilterCategories,
  updateFilterExceptions
} from '../../../state/actions/Worklist';
import { strings } from '../../../locales';
import { FullExceptionList } from '../FullExceptionList';
import { trackEvent } from '../../../utils/AppCenterTool';
import FilterListItem from '../../../models/FilterListItem';

interface MenuCardProps {
  title: string;
  subtext: string;
  opened: boolean;
}

export const MenuCard = (props: MenuCardProps): JSX.Element => {
  const iconName = props.opened ? 'keyboard-arrow-up' : 'keyboard-arrow-down';
  return (
    <>
      <View style={styles.menuCardText}>
        <Text>
          { props.title }
        </Text>
        <Text style={styles.subtitleText}>
          { props.subtext }
        </Text>
      </View>
      <View style={styles.arrowView}>
        <MaterialIcons name={iconName} size={25} color={COLOR.GREY_700} />
      </View>
    </>
  );
};

export const renderCategoryFilterCard = (listItem: { item: { catgNbr: number; catgName: string; selected: boolean } },
  dispatch: Dispatch<any>, filterCategories: string[]): JSX.Element => {
  const { item } = listItem;
  const onItemPress = () => {
    if (item.selected) {
      // @ts-ignore
      filterCategories.splice(filterCategories.indexOf(`${item.catgNbr} - ${item.catgName}`), 1);
      trackEvent('worklist_update_filter_categories', { categories: JSON.stringify(filterCategories) });
      return dispatch(updateFilterCategories(filterCategories));
    }

    const replacementFilter = filterCategories;
    replacementFilter.push(`${item.catgNbr} - ${item.catgName}`);
    return dispatch(updateFilterCategories(replacementFilter));
  };
  return (
    <TouchableOpacity style={styles.categoryFilterCard} onPress={onItemPress}>
      <View style={styles.selectionView}>
        { item.selected ? (
          <MaterialCommunityIcons name="checkbox-marked-outline" size={15} color={COLOR.MAIN_THEME_COLOR} />
        ) : (
          <MaterialCommunityIcons name="checkbox-blank-outline" size={15} color={COLOR.MAIN_THEME_COLOR} />
        )}
      </View>
      <Text style={styles.categoryFilterText} numberOfLines={2}>
        { `${item.catgNbr} - ${item.catgName} `}
      </Text>
    </TouchableOpacity>
  );
};

export const renderExceptionFilterCard = (listItem: { item: FilterListItem }, dispatch: Dispatch<any>): JSX.Element => {
  const { item } = listItem;
  const onItemPress = () => {
    trackEvent('worklist_update_filter_exceptions', { exception: item.value });
    return dispatch(updateFilterExceptions([item.value]));
  };
  return (
    <TouchableOpacity style={styles.categoryFilterCard} onPress={onItemPress}>
      <View style={styles.selectionView}>
        { item.selected ? (
          <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={15} color={COLOR.MAIN_THEME_COLOR} />
        ) : (
          <MaterialCommunityIcons name="checkbox-blank-circle-outline" size={15} color={COLOR.MAIN_THEME_COLOR} />
        )}
      </View>
      <Text style={styles.categoryFilterText} numberOfLines={2}>
        { item.display }
      </Text>
    </TouchableOpacity>
  );
};

export const renderCategoryCollapsibleCard = (): JSX.Element => {
  const { result } = useTypedSelector(state => state.async.getWorklist);
  const { categoryOpen, filterCategories } = useTypedSelector(state => state.Worklist);
  const dispatch = useDispatch();

  const data = result && result.data && Array.isArray(result.data) ? result.data : [];
  const categoryMap = data.map((item: any) => {
    const isSelected = filterCategories.indexOf(`${item.catgNbr} - ${item.catgName}`) !== -1;
    return { catgNbr: item.catgNbr, catgName: item.catgName, selected: isSelected };
  });

  categoryMap.sort((firstItem: any, secondItem: any) => firstItem.catgNbr - secondItem.catgNbr);

  const categoryNumberMap = categoryMap.map((item: any) => item.catgNbr);
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
    filterCategories.forEach((category: string) => {
      if (categorySubtext !== '') {
        categorySubtext = `${categorySubtext}\n${category}`;
      } else if (category) {
        categorySubtext = category;
      }
    });
  }

  return (
    <>
      <TouchableOpacity style={styles.menuCard} onPress={() => { dispatch(toggleCategories(!categoryOpen)); }}>
        <MenuCard title={strings('WORKLIST.CATEGORY')} subtext={categorySubtext} opened={categoryOpen} />
      </TouchableOpacity>
      { categoryOpen && (
        <FlatList
          data={filteredCategories}
          renderItem={(item: any) => renderCategoryFilterCard(item, dispatch, filterCategories)}
          style={styles.categoryList}
          keyExtractor={(item: any) => item.catgNbr.toString()}
        />
      )}
    </>
  );
};

export const renderExceptionTypeCard = (): JSX.Element => {
  const { exceptionOpen, filterExceptions } = useTypedSelector(state => state.Worklist);
  const dispatch = useDispatch();

  const exceptionMap: { value: string; display: string; selected: boolean;}[] = [];
  FullExceptionList().forEach((value, key) => {
    const isSelected = filterExceptions.indexOf(key) !== -1;
    exceptionMap.push({ value: key, display: value, selected: isSelected });
  });

  let subtext = '';
  if (filterExceptions.length === 0) {
    subtext = strings('WORKLIST.ALL');
  } else {
    filterExceptions.forEach((exception: string) => {
      const exceptionObj = FullExceptionList().get(exception);
      if (exceptionObj && subtext !== '') {
        subtext = `${subtext}\n${exceptionObj}`;
      } else if (exceptionObj) {
        subtext = exceptionObj;
      }
    });
  }

  return (
    <>
      <TouchableOpacity style={styles.menuCard} onPress={() => { dispatch(toggleExceptions(!exceptionOpen)); }}>
        <MenuCard title={strings('WORKLIST.EXCEPTION_TYPE')} subtext={subtext} opened={exceptionOpen} />
      </TouchableOpacity>
      { exceptionOpen && (
        <FlatList
          data={exceptionMap}
          renderItem={(item: any) => renderExceptionFilterCard(item, dispatch)}
          style={styles.categoryList}
          keyExtractor={(item: any) => item.value}
        />
      )}
    </>
  );
};

export const onClearPress = (dispatch: Dispatch<any>): void => {
  trackEvent('worklist_clear_filter');
  dispatch(clearFilter());
};

export const FilterMenu = (): JSX.Element => {
  const dispatch = useDispatch();
  return (
    <View style={styles.menuContainer}>
      <View style={styles.headerBar}>
        <Text style={styles.refineText}>{strings('WORKLIST.REFINE')}</Text>
        <TouchableOpacity style={styles.clearButton} onPress={() => onClearPress(dispatch)}>
          <Text style={styles.clearText}>{strings('WORKLIST.CLEAR')}</Text>
        </TouchableOpacity>
      </View>
      { renderCategoryCollapsibleCard() }
      { renderExceptionTypeCard() }
    </View>
  );
};
