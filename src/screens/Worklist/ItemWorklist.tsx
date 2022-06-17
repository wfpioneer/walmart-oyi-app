import React from 'react';
import {
  ActivityIndicator, FlatList, Text, TouchableOpacity, View
} from 'react-native';
import { Dispatch } from 'redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NavigationProp } from '@react-navigation/native';
import { WorklistItem } from '../../components/worklistItem/WorklistItem';
import COLOR from '../../themes/Color';
import styles from './ItemWorklist.style';
import { WorklistItemI } from '../../models/WorklistItem';
import { CategorySeparator } from '../../components/CategorySeparator/CategorySeparator';
import { strings } from '../../locales';
import { ExceptionList } from './FullExceptionList';
import { FilterPillButton } from '../../components/filterPillButton/FilterPillButton';
import { updateFilterCategories, updateFilterExceptions } from '../../state/actions/Worklist';
import { area } from '../../models/User';

interface ListItemProps {
  item: WorklistItemI;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
}

interface WorklistProps {
  data: any;
  onRefresh: () => void;
  refreshing: boolean;
  error: any;
  groupToggle: boolean;
  updateGroupToggle: React.Dispatch<React.SetStateAction<boolean>>;
  filterExceptions: string[];
  filterCategories: string[];
  dispatch: Dispatch<any>;
  areas: area[];
  navigation: NavigationProp<any>;
}
export const RenderWorklistItem = (props: ListItemProps): JSX.Element => {
  const { dispatch, item, navigation } = props;
  if (item.worklistType === 'CATEGORY') {
    const { catgName, itemCount } = item;
    return (
      <CategorySeparator categoryName={catgName} numberOfItems={itemCount || 0} />
    );
  }
  const {
    worklistType, itemName, itemNbr, upcNbr
  } = item;

  return (
    <WorklistItem
      exceptionType={worklistType}
      itemDescription={itemName || ''}
      upcNbr={upcNbr || ''}
      itemNumber={itemNbr || 0}
      dispatch={dispatch}
      navigation={navigation}
    />
  );
};

export const convertDataToDisplayList = (data: WorklistItemI[], groupToggle: boolean): WorklistItemI[] => {
  if (!groupToggle) {
    const workListItems = data || [];
    return [{
      worklistType: 'CATEGORY',
      catgName: strings('WORKLIST.ALL'),
      itemCount: workListItems.length
    },
    ...workListItems];
  }

  const sortedData = data;
  // first, sort by category number
  sortedData.sort((firstEl: WorklistItemI, secondEl: WorklistItemI) => {
    if (firstEl.catgNbr && secondEl.catgNbr) {
      return firstEl.catgNbr - secondEl.catgNbr;
    }
    return 0;
  });

  const returnData: WorklistItemI[] = [];

  // next, insert into the array where the category numbers change
  let previousItem: WorklistItemI;
  let previousCategoryIndex: number;
  sortedData.forEach(item => {
    if (!previousItem || (previousItem.catgNbr !== item.catgNbr)) {
      previousItem = item;
      returnData.push({
        worklistType: 'CATEGORY',
        catgName: item.catgName || '',
        catgNbr: item.catgNbr,
        itemCount: 1
      });
      previousCategoryIndex = returnData.length - 1;
      returnData.push(item);
    } else {
      previousItem = item;
      if (returnData[previousCategoryIndex].itemCount) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        returnData[previousCategoryIndex].itemCount += 1;
      }
      returnData.push(item);
    }
  });

  return returnData;
};

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

export const Worklist = (props: WorklistProps): JSX.Element => {
  const {
    data, dispatch, error, filterCategories, filterExceptions,
    groupToggle, onRefresh, refreshing, updateGroupToggle, navigation, areas
  } = props;
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
  let filteredData: WorklistItemI[] = data || [];

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

  const typedFilterAreas = configAreas.reduce((acc: { type: string, value: string}[], item: area) => {
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
  }, []);

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

  return (
    <View style={styles.container}>
      { (filterCategories.length > 0 || filterExceptions.length > 0) && (
        <View style={styles.filterContainer}>
          <FlatList
            data={[...typedFilterExceptions, ...typedFilterAreas]}
            horizontal
            renderItem={({ item }) => renderFilterPills(
              item, dispatch, filterCategories, filterExceptions, fullExceptionList, areas
            )}
            style={styles.filterList}
            keyExtractor={item => item.value}
          />
        </View>
      ) }
      <View style={styles.viewSwitcher}>
        <TouchableOpacity onPress={() => updateGroupToggle(false)}>
          <MaterialIcons
            name="menu"
            size={25}
            color={!groupToggle ? COLOR.BLACK : COLOR.GREY}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => updateGroupToggle(true)}>
          <MaterialIcons
            name="list"
            size={25}
            color={groupToggle ? COLOR.BLACK : COLOR.GREY}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={convertDataToDisplayList(filteredData, groupToggle)}
        keyExtractor={(item: WorklistItemI, index: number) => {
          if (item.worklistType === 'CATEGORY') {
            return item.catgName.toString();
          }
          return item.itemNbr + index.toString();
        }}
        renderItem={({ item }) => <RenderWorklistItem item={item} dispatch={dispatch} navigation={navigation} />}
        onRefresh={onRefresh}
        refreshing={refreshing}
        style={styles.list}
      />
    </View>
  );
};
