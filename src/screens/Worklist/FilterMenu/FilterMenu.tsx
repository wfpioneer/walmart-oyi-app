import React from 'react';
import {View, Text, TouchableOpacity, FlatList} from "react-native";
import { useDispatch } from "react-redux";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './FilterMenu.style';
import COLOR from "../../../themes/Color";
import { useTypedSelector } from "../../../state/reducers/RootReducer";
import {
  toggleCategories,
  toggleExceptions,
  updateFilterCategories,
  updateFilterExceptions,
  clearFilter
} from "../../../state/actions/Worklist";
import {strings} from "../../../locales";

interface MenuCardProps {
  title: string;
  subtext: string;
  opened: boolean;
}

export const MenuCard = (props: MenuCardProps) => {
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

export const renderCategoryFilterCard = (listItem: { item: { catgNbr: number, catgName: string, selected: boolean } }, dispatch: any, filterCategories: any) => {
  const { item } = listItem;
  const onItemPress = () => {
    if (item.selected) {
      // @ts-ignore
      filterCategories.splice(filterCategories.indexOf(item.value), 1);
      return dispatch(updateFilterCategories(filterCategories));
    }

    const replacementFilter = filterCategories;
    replacementFilter.push(item.catgNbr);
    return dispatch(updateFilterCategories(replacementFilter));
  }
  return (
    <TouchableOpacity style={styles.categoryFilterCard} onPress={onItemPress}>
      <View style={styles.selectionView}>
        { item.selected ? (
          <MaterialCommunityIcons name='checkbox-marked-circle-outline' size={ 15 } color={COLOR.MAIN_THEME_COLOR} />
        ) : (
          <MaterialCommunityIcons name='checkbox-blank-circle-outline' size={ 15 } color={COLOR.MAIN_THEME_COLOR} />
        )}
      </View>
      <Text style={styles.categoryFilterText} numberOfLines={ 2 }>
        { `${item.catgNbr} - ${item.catgName} `}
      </Text>
    </TouchableOpacity>
  )
}

export const renderExceptionFilterCard = (listItem: { item: { value: string, display: string, selected: boolean } }, dispatch: any) => {
  const { item } = listItem;
  const onItemPress = () => {
    return dispatch(updateFilterExceptions([item.value]));
  }
  return (
    <TouchableOpacity style={styles.categoryFilterCard} onPress={onItemPress}>
      <View style={styles.selectionView}>
        { item.selected ? (
          <MaterialCommunityIcons name='checkbox-marked-circle-outline' size={ 15 } color={COLOR.MAIN_THEME_COLOR} />
        ) : (
          <MaterialCommunityIcons name='checkbox-blank-circle-outline' size={ 15 } color={COLOR.MAIN_THEME_COLOR} />
        )}
      </View>
      <Text style={styles.categoryFilterText} numberOfLines={ 2 }>
        { item.display }
      </Text>
    </TouchableOpacity>
  )
}

export const renderCategoryCollapsibleCard = () => {
  const { categoryOpen, data, filterCategories } = useTypedSelector(state => state.Worklist);
  const dispatch = useDispatch();
  const categoryMap = data.map(item => {
    // @ts-ignore
    const isSelected = filterCategories.indexOf(item.catgNbr) !== -1
    return { catgNbr: item.catgNbr, catgName: item.catgName, selected: isSelected };
  })

  categoryMap.sort((firstItem: any, secondItem: any) => {
    return firstItem.catgNbr - secondItem.catgNbr;
  })

  const categoryNumberMap = categoryMap.map(item => item.catgNbr);
  const categoryNumberSet = new Set();
  categoryNumberMap.forEach(item => categoryNumberSet.add(item));
  const filteredCategories = categoryMap.filter(item => {
    if (categoryNumberSet.has(item.catgNbr)) {
      categoryNumberSet.delete(item.catgNbr);
      return true
    }

    return false;
  });

  let categorySubtext = '';
  if (filterCategories.length === 0) {
    categorySubtext = strings('WORKLIST.ALL');
  } else {
    filterCategories.forEach((category: number) => {
      const catObj = filteredCategories.find(categoryListItem => categoryListItem.catgNbr === category);
      if (catObj && categorySubtext !== '') {
        categorySubtext = `${categorySubtext}\n${catObj.catgNbr} - ${catObj.catgName}`;
      } else if (catObj) {
        categorySubtext = `${catObj.catgNbr} - ${catObj.catgName}`;
      }
    });
  }

  return (
    <>
      <TouchableOpacity style={styles.menuCard} onPress={ () => { dispatch(toggleCategories(!categoryOpen))} }>
        <MenuCard title={strings('WORKLIST.CATEGORY')} subtext={categorySubtext} opened={categoryOpen} />
      </TouchableOpacity>
      { categoryOpen && (
        <FlatList
          data={filteredCategories}
          renderItem={(item: any) => renderCategoryFilterCard(item, dispatch, filterCategories)}
          style={styles.categoryList}
          keyExtractor={ (item: any) => item.catgNbr.toString() }
        />
      )}
    </>
  )
}

export const renderExceptionTypeCard = () => {
  const { exceptionOpen, filterExceptions } = useTypedSelector(state => state.Worklist);
  const dispatch = useDispatch();

  const fullExceptionList = [
    {
      value: 'NILPICK',
      display: strings('EXCEPTION.NILPICK')
    },
    {
      value: 'PRICE_OVERRIDE',
      display: strings('EXCEPTION.PRICE_OVERRIDE')
    },
    {
      value: 'NO_SALES',
      display: strings('EXCEPTION.NO_SALES')
    },
    {
      value: 'NEGATIVE_ON_HANDS',
      display: strings('EXCEPTION.NEGATIVE_ON_HANDS')
    },
    {
      value: 'CANCELLED',
      display: strings('EXCEPTION.CANCELLED')
    },
    {
      value: 'NO_SALES_FLOOR',
      display: strings('EXCEPTION.NO_SALES_FLOOR_LOCATION')
    }
  ];

  const exceptionMap = fullExceptionList.map(item => {
    // @ts-ignore
    const isSelected = filterExceptions.indexOf(item.value) !== -1
    return { value: item.value, display: item.display, selected: isSelected };
  })

  let subtext = '';
  if (filterExceptions.length === 0) {
    subtext = strings('WORKLIST.ALL');
  } else {
    filterExceptions.forEach((exception: string) => {
      const exceptionObj = fullExceptionList.find(exceptionListItem => exceptionListItem.value === exception);
      if (exceptionObj && subtext !== '') {
        subtext = `${subtext}\n${exceptionObj.display}`;
      } else if (exceptionObj) {
        subtext = exceptionObj.display;
      }
    })
  }

  return (
    <>
      <TouchableOpacity style={styles.menuCard} onPress={ () => { dispatch(toggleExceptions(!exceptionOpen))} }>
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
  )
}

export const onClearPress = (dispatch: any) => {
  return dispatch(clearFilter());
}

export const FilterMenu = () => {
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
