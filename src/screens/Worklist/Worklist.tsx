import React, { useState } from 'react';
import {
  FlatList, Text, TouchableOpacity, View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import { WorklistItem } from '../../components/worklistItem/WorklistItem';
import COLOR from '../../themes/Color';
import styles from './Worklist.style';
import { WorklistItemI } from '../../models/WorklistItem';
import { CategorySeparator } from '../../components/worklistItem/CategorySeparator';
import { strings } from '../../locales';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import FullExceptionList from './FullExceptionList';
import { FilterPillButton } from '../../components/filterPillButton/FilterPillButton';
import { updateFilterCategories, updateFilterExceptions } from '../../state/actions/Worklist';

interface ListItemI {
  item: WorklistItemI;
}

interface WorklistProps {
  data: any;
  onRefresh: () => void;
  refreshing: boolean;
  error: any;
}

export const renderWorklistItem = (listItem: ListItemI) => {
  if (listItem.item.worklistType === 'CATEGORY') {
    const { catgName, catgNbr, itemCount } = listItem.item;
    return (
      <CategorySeparator categoryName={catgName} categoryNumber={catgNbr || 0} numberOfItems={itemCount} />
    );
  }
  const {
    worklistType, itemName, itemNbr, upcNbr
  } = listItem.item;

  return (
    <WorklistItem
      exceptionType={worklistType}
      itemDescription={itemName || ''}
      upcNbr={upcNbr || ''}
      itemNumber={itemNbr || 0}
    />
  );
};

export const convertDataToDisplayList = (data: WorklistItemI[], groupToggle: boolean): WorklistItemI[] => {
  if (!groupToggle) {
    const workListItems = data ? data : [];
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

  const returnData = [];

  // next, insert into the array where the category numbers change
  const iterator = sortedData.values();
  let previousItem: WorklistItemI | undefined;
  let previousCategoryIndex: any;
  for (const item of iterator) {
    if (!previousItem || (previousItem.catgNbr !== item.catgNbr)) {
      previousItem = item;
      returnData.push({
        worklistType: 'CATEGORY',
        catgName: item.catgName,
        catgNbr: item.catgNbr,
        itemCount: 1
      });
      previousCategoryIndex = returnData.length - 1;
      returnData.push(item);
    } else {
      previousItem = item;
      if (returnData[previousCategoryIndex].itemCount) {
        // @ts-ignore
        returnData[previousCategoryIndex].itemCount += 1;
      }
      returnData.push(item);
    }
  }

  return returnData;
};

export const renderFilterPills = (listItem: any, dispatch: any, filterCategories: any, filterExceptions: any) => {
  const { item } = listItem;

  if (item.type === 'EXCEPTION') {
    const exceptionObj = FullExceptionList().find(exceptionListItem => exceptionListItem.value === item.value);

    if (exceptionObj) {
      const removeFilter = () => {
        const replacementFilter = filterExceptions;
        replacementFilter.splice(filterExceptions.indexOf(item.value), 1);
        dispatch(updateFilterExceptions(replacementFilter));
      };
      return <FilterPillButton filterText={exceptionObj.display} onClosePress={removeFilter} />;
    }

    return null;
  }

  if (item.type === 'CATEGORY') {
    const removeFilter = () => {
      const replacementFilter = filterCategories;
      replacementFilter.splice(filterCategories.indexOf(item.value), 1);
      dispatch(updateFilterCategories(replacementFilter));
    };
    return <FilterPillButton filterText={item.value} onClosePress={removeFilter} />;
  }

  return null;
};

export const Worklist = (props: WorklistProps) => {
  const errorView = () => (
    <View style={styles.errorView}>
      <MaterialIcons name="error" size={60} color={COLOR.RED_300} />
      <Text style={styles.errorText}>An error has occurred. Please try again.</Text>
      <TouchableOpacity style={styles.errorButton} onPress={props.onRefresh}>
        <Text>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  if (props.error) {
    return (
      <FlatList
        data={['error']}
        renderItem={errorView}
        refreshing={false}
        onRefresh={props.onRefresh}
      />
    );
  }

  if (props.refreshing && !props.data) {
    return (
      <FlatList data={[]} renderItem={() => null} refreshing onRefresh={() => null} />
    );
  }

  const [groupToggle, updateGroupToggle] = useState(false);
  const { filterExceptions, filterCategories } = useTypedSelector(state => state.Worklist);
  const dispatch = useDispatch();
  const typedFilterExceptions = filterExceptions.map((exception: string) => ({ type: 'EXCEPTION', value: exception }));
  const typedFilterCategories = filterCategories.map((category: number) => ({ type: 'CATEGORY', value: category }));
  let filteredData: WorklistItemI[] = props.data ? props.data : [];
  if (filterCategories.length !== 0) {
    filteredData = filteredData.filter((worklistItem: WorklistItemI) => filterCategories
      .indexOf(`${worklistItem.catgNbr} - ${worklistItem.catgName}`) !== -1);
  }
  if (filterExceptions.length !== 0) {
    filteredData = filteredData.filter((worklistItem: WorklistItemI) => {
      const exceptionTranslation = FullExceptionList().find((exceptionListItem: any) => exceptionListItem.value
        === worklistItem.worklistType);
      if (exceptionTranslation) {
        return filterExceptions.findIndex((exception: any) => exception === exceptionTranslation.value) !== -1;
      }
      return false;
    });
  }

  return (
    <View style={styles.container}>
      { (filterCategories.length > 0 || filterExceptions.length > 0) && (
        <View style={styles.filterContainer}>
          <FlatList
            data={[...typedFilterExceptions, ...typedFilterCategories]}
            horizontal
            renderItem={(item: any) => renderFilterPills(item, dispatch, filterCategories, filterExceptions)}
            style={styles.filterList}
            keyExtractor={(item: any) => item.value.toString()}
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
        keyExtractor={(item: any, index: number) => {
          if (item.exceptionType === 'CATEGORY') {
            return item.catgName.toString();
          }
          return item.itemNbr + index.toString();
        }}
        renderItem={renderWorklistItem}
        onRefresh={props.onRefresh}
        refreshing={props.refreshing}
        style={styles.list}
      />
    </View>
  );
};
