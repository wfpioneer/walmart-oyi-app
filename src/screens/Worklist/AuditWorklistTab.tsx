import { NavigationProp, useNavigation } from '@react-navigation/native';
import { groupBy, partition } from 'lodash';
import React, { useState } from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import {
  ActivityIndicator, FlatList, Text, TouchableOpacity, View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CollapseAllBar from '../../components/CollapseAllBar/CollapseAllBar';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { WorklistItemI } from '../../models/WorklistItem';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import { getWorklist } from '../../state/actions/saga';
import { setAuditItemNumber } from '../../state/actions/AuditWorklist';
import COLOR from '../../themes/Color';
import styles from './AuditWorklistTab.style';
import { strings } from '../../locales';
import { area } from '../../models/User';
import { ExceptionList } from './FullExceptionList';
import { FilterPillButton } from '../../components/filterPillButton/FilterPillButton';
import { updateFilterCategories, updateFilterExceptions } from '../../state/actions/Worklist';

export interface AuditWorklistTabProps {
    toDo: boolean;
}

export interface AuditWorklistTabScreenProps {
    items: WorklistItemI[];
    navigation: NavigationProp<any>;
    dispatch: Dispatch<any>;
    toDo: boolean;
    collapsed: boolean;
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
    refreshing: boolean;
    error: any;
    areas: area[];
    enableAreaFilter: boolean;
    filterExceptions: string[];
    filterCategories: string[];
}

const onItemClick = (itemNumber: number, navigation: NavigationProp<any>, dispatch: Dispatch<any>) => {
  dispatch(setAuditItemNumber(itemNumber));
  navigation.navigate('AuditItem');
};

const renderCategoryCard = (
  category: string, items: WorklistItemI[], collapsed: boolean, navigation: NavigationProp<any>,
  dispatch: Dispatch<any>
) => (
  <CategoryCard
    category={category}
    listOfItems={items}
    collapsed={collapsed}
    onItemCardClick={(itemNumber: number) => {
      onItemClick(itemNumber, navigation, dispatch);
    }}
  />
);

export const renderFilterPills = (
  listFilter: { type: string; value: string },
  dispatch: Dispatch<any>,
  filterCategories: string[],
  filterExceptions: string[],
  fullExceptionList: Map<string, string>,
  areas: area[]
): JSX.Element => {
  if (listFilter.type === 'EXCEPTION') {
    const exception = fullExceptionList.get(listFilter.value);
    if (exception) {
      const removeFilter = () => {
        const replacementFilter = filterExceptions;
        replacementFilter.splice(filterExceptions.indexOf(listFilter.value), 1);
        dispatch(updateFilterExceptions(replacementFilter));
      };
      return <FilterPillButton filterText={exception} onClosePress={removeFilter} />;
    }

    return <View />;
  }
  if (listFilter.type === 'AREA') {
    const removeAreaFilter = () => {
      const removedArea = areas.find(item => item.area === listFilter.value);
      const updatedFilteredCategories = filterCategories.filter(
        category => removedArea && !(removedArea.categories.includes(Number(category.split('-')[0])))
      );
      dispatch(updateFilterCategories(updatedFilteredCategories));
    };
    return <FilterPillButton filterText={listFilter.value} onClosePress={removeAreaFilter} />;
  }

  if (listFilter.type === 'CATEGORY') {
    const removeFilter = () => {
      const replacementFilter = filterCategories;
      replacementFilter.splice(filterCategories.indexOf(listFilter.value), 1);
      dispatch(updateFilterCategories(replacementFilter));
    };
    return <FilterPillButton filterText={listFilter.value} onClosePress={removeFilter} />;
  }

  return <View />;
};

export const AuditWorklistTabScreen = (props: AuditWorklistTabScreenProps) => {
  const {
    items, collapsed, setCollapsed, refreshing, dispatch, navigation, error,
    areas, enableAreaFilter, filterExceptions, filterCategories
  } = props;

  const onRefresh = () => {
    dispatch(getWorklist({ worklistType: ['AU', 'RA'] }));
  };

  const fullExceptionList = ExceptionList.getInstance();

  if (error) {
    return (
      <View style={styles.errorView}>
        <MaterialIcons name="error" size={60} color={COLOR.RED_300} />
        <Text style={styles.errorText}>{strings('WORKLIST.WORKLIST_ITEM_API_ERROR')}</Text>
        <TouchableOpacity style={styles.errorButton} onPress={onRefresh}>
          <Text>{strings('GENERICS.RETRY')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (refreshing) {
    return (
      <ActivityIndicator
        animating={refreshing}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    );
  }

  let filteredData: WorklistItemI[] = items || [];

  // removes missing WorkList categories from the config list Area categories
  const filteredWorklistCatgNbr = new Set(
    filteredData.map((item: WorklistItemI) => item.catgNbr)
  );
  const configAreas: area[] = areas.map(item => {
    const newCategories: number[] = [];
    item.categories.forEach(catgNbr => {
      if (filteredWorklistCatgNbr.has(catgNbr)) {
        newCategories.push(catgNbr);
      }
    });

    return { ...item, categories: newCategories };
  });

  const filteredCategoryNbr: number[] = filterCategories.map(category => Number(category.split('-')[0]));

  const typedFilterAreaOrCategoryList = enableAreaFilter
    ? configAreas.reduce((acc: { type: string, value: string}[], item: area) => {
      const isSelected = item.categories.every(
        categoryNbr => filteredCategoryNbr.includes(categoryNbr)
      );
      const isPartiallySelected = item.categories.some(
        categoryNbr => filteredCategoryNbr.includes(categoryNbr)
      );
      if (isSelected && item.categories.length !== 0) {
        acc.push({ type: 'AREA', value: item.area });
      } else if (isPartiallySelected) {
        const partiallySelectedCategoryList = filterCategories.filter(
          category => item.categories.includes(Number(category.split('-')[0]))
        );
        partiallySelectedCategoryList.forEach((category: string) => acc.push({ type: 'CATEGORY', value: category }));
      }
      return acc;
    }, []) : filterCategories.map((category: string) => ({ type: 'CATEGORY', value: category }));

  const typedFilterExceptions = filterExceptions.map((exception: string) => ({ type: 'EXCEPTION', value: exception }));

  if (filterCategories.length !== 0) {
    filteredData = filteredData.filter(worklistItem => filterCategories
      .indexOf(`${worklistItem.catgNbr} - ${worklistItem.catgName}`) !== -1);
  }
  if (filterExceptions.length !== 0) {
    filteredData = filteredData.filter(worklistItem => {
      const hasWorklistException = fullExceptionList.has(worklistItem.worklistType);

      if (hasWorklistException) {
        return filterExceptions.findIndex(exception => exception === worklistItem.worklistType) !== -1;
      }
      return false;
    });
  }

  const itemsBasedOnCategory = groupBy(filteredData, item => `${item.catgNbr} - ${item.catgName}`);
  const sortedItemKeys = Object.keys(itemsBasedOnCategory).sort((a, b) => (a > b ? 1 : -1));

  return (
    <>
      { (filterCategories.length > 0 || (filterExceptions.length > 0)) && (
      <View style={styles.filterContainer}>
        <FlatList
          data={[...typedFilterExceptions, ...typedFilterAreaOrCategoryList]}
          horizontal
          renderItem={({ item }) => renderFilterPills(
            item, dispatch, filterCategories, filterExceptions, fullExceptionList, areas
          )}
          style={styles.filterList}
          keyExtractor={item => item.value}
        />
      </View>
      ) }
      {sortedItemKeys.length > 0 && <CollapseAllBar collapsed={collapsed} onclick={() => setCollapsed(!collapsed)} />}
      <FlatList
        data={sortedItemKeys}
        renderItem={({ item: key }) => renderCategoryCard(
          key, itemsBasedOnCategory[key], collapsed, navigation, dispatch
        )}
        keyExtractor={item => `category-${item}`}
        // TODO: worklist types needs to be updated after Filter component gets completed
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    </>
  );
};

const AuditWorklistTab = (props: AuditWorklistTabProps) => {
  const { toDo } = props;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [collapsed, setCollapsed] = useState(false);
  const auditWorklistItems = useTypedSelector(state => state.AuditWorklist.items);
  const [completedItems, toDoItems] = partition(auditWorklistItems, item => item.completed);
  const items = toDo ? toDoItems : completedItems;
  const { isWaiting, error } = useTypedSelector(state => state.async.getWorklist);
  const { areas, enableAreaFilter } = useTypedSelector(state => state.User.configs);
  const { filterExceptions, filterCategories } = useTypedSelector(state => state.Worklist);

  return (
    <AuditWorklistTabScreen
      items={items}
      dispatch={dispatch}
      navigation={navigation}
      toDo={toDo}
      collapsed={collapsed}
      setCollapsed={setCollapsed}
      refreshing={isWaiting}
      error={error}
      areas={areas}
      enableAreaFilter={enableAreaFilter}
      filterExceptions={filterExceptions}
      filterCategories={filterCategories}
    />
  );
};

export default AuditWorklistTab;
