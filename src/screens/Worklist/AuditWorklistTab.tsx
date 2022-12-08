import { NavigationProp, useNavigation } from '@react-navigation/native';
import { partition } from 'lodash';
import React from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import {
  FlatList, Text, TouchableOpacity, View
} from 'react-native';
import { AxiosError } from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { WorklistItemI } from '../../models/WorklistItem';
import WorklistHeader from '../../components/WorklistHeader/WorklistHeader';
import { setAuditItemNumber } from '../../state/actions/AuditWorklist';
import COLOR from '../../themes/Color';
import styles from './AuditWorklistTab.style';
import { strings } from '../../locales';
import { area } from '../../models/User';
import { ExceptionList } from './FullExceptionList';
import { FilterPillButton } from '../../components/filterPillButton/FilterPillButton';
import { updateFilterCategories, updateFilterExceptions } from '../../state/actions/Worklist';
import ItemCard from '../../components/ItemCard/ItemCard';
import { FilterType } from '../../models/FilterListItem';

export interface AuditWorklistTabProps {
    toDo: boolean;
    onRefresh: () => void;
}

interface ListItemProps {
  item: WorklistItemI;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  showItemImage: boolean;
  countryCode: string;
}

export interface AuditWorklistTabScreenProps {
    items: WorklistItemI[];
    navigation: NavigationProp<any>;
    dispatch: Dispatch<any>;
    toDo: boolean;
    refreshing: boolean;
    error: AxiosError | null;
    areas: area[];
    enableAreaFilter: boolean;
    filterExceptions: string[];
    filterCategories: string[];
    onRefresh: () => void;
    showItemImage: boolean;
    countryCode: string;
}

const onItemClick = (itemNumber: number, navigation: NavigationProp<any>, dispatch: Dispatch<any>) => {
  dispatch(setAuditItemNumber(itemNumber));
  navigation.navigate('AuditItem');
};

export const RenderWorklistItem = (props: ListItemProps): JSX.Element => {
  const {
    dispatch, item, navigation, showItemImage, countryCode
  } = props;
  if (item.worklistType === 'CATEGORY') {
    const { catgName, itemCount } = item;
    return (
      <WorklistHeader title={catgName} numberOfItems={itemCount || 0} />
    );
  }
  const {
    itemName, itemNbr, imageURLKey
  } = item;

  return (
    <ItemCard
      imageUrl={imageURLKey ? { uri: imageURLKey } : undefined}
      itemNumber={itemNbr || 0}
      description={itemName || ''}
      onClick={(itemNumber: number) => {
        onItemClick(itemNumber, navigation, dispatch);
      }}
      loading={false}
      onHandQty={undefined}
      showItemImage={showItemImage}
      countryCode={countryCode}
    />
  );
};

export const convertDataToDisplayList = (data: WorklistItemI[], groupToggle: boolean): WorklistItemI[] => {
  if (!groupToggle) {
    const workListItems = data || [];
    return [
      {
        worklistType: 'CATEGORY',
        catgName: strings('WORKLIST.ALL'),
        itemCount: workListItems.length
      },
      ...workListItems
    ];
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
  listFilter: { type: FilterType; value: string },
  dispatch: Dispatch<any>,
  filterCategories: string[],
  filterExceptions: string[],
  fullExceptionList: Map<string, string>,
  areas: area[]
): JSX.Element => {
  if (listFilter.type === FilterType.EXCEPTION) {
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
  if (listFilter.type === FilterType.AREA) {
    const removeAreaFilter = () => {
      const removedArea = areas.find(item => item.area === listFilter.value);
      const updatedFilteredCategories = filterCategories.filter(
        category => removedArea && !(removedArea.categories.includes(Number(category.split('-')[0])))
      );
      dispatch(updateFilterCategories(updatedFilteredCategories));
    };
    return <FilterPillButton filterText={listFilter.value} onClosePress={removeAreaFilter} />;
  }

  if (listFilter.type === FilterType.CATEGORY) {
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
    items, refreshing, dispatch, navigation, error,
    areas, enableAreaFilter, filterExceptions, filterCategories, onRefresh,
    showItemImage, countryCode
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
    ? configAreas.reduce((acc: { type: FilterType, value: string}[], item: area) => {
      const isSelected = item.categories.every(
        categoryNbr => filteredCategoryNbr.includes(categoryNbr)
      );
      const isPartiallySelected = item.categories.some(
        categoryNbr => filteredCategoryNbr.includes(categoryNbr)
      );
      if (isSelected && item.categories.length !== 0) {
        acc.push({ type: FilterType.AREA, value: item.area });
      } else if (isPartiallySelected) {
        const partiallySelectedCategoryList = filterCategories.filter(
          category => item.categories.includes(Number(category.split('-')[0]))
        );
        partiallySelectedCategoryList.forEach((category: string) => acc.push(
          { type: FilterType.CATEGORY, value: category }
        ));
      }
      return acc;
    }, []) : filterCategories.map((category: string) => ({ type: FilterType.CATEGORY, value: category }));

  const typedFilterExceptions = filterExceptions.map((exception: string) => (
    { type: FilterType.EXCEPTION, value: exception }
  ));

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
      <FlatList
        data={convertDataToDisplayList(filteredData, true)}
        renderItem={({ item }) => (
          <RenderWorklistItem
            item={item}
            dispatch={dispatch}
            navigation={navigation}
            showItemImage={showItemImage}
            countryCode={countryCode}
          />
        )}
        keyExtractor={(item: WorklistItemI, index: number) => {
          if (item.worklistType === 'CATEGORY') {
            return item.catgName.toString();
          }
          return item.itemNbr + index.toString();
        }}
        onRefresh={onRefresh}
        refreshing={refreshing}
        windowSize={3}
      />
    </>
  );
};

const AuditWorklistTab = (props: AuditWorklistTabProps) => {
  const { toDo, onRefresh } = props;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const auditWorklistItems = useTypedSelector(state => state.AuditWorklist.items);
  const [completedItems, toDoItems] = partition(auditWorklistItems, item => item.completed);
  const items = toDo ? toDoItems : completedItems;
  const { isWaiting, error } = useTypedSelector(state => state.async.getWorklistAudits);
  const { areas, enableAreaFilter, showItemImage } = useTypedSelector(state => state.User.configs);
  const { countryCode } = useTypedSelector(state => state.User);
  const { filterExceptions, filterCategories } = useTypedSelector(state => state.Worklist);

  return (
    <AuditWorklistTabScreen
      items={items}
      dispatch={dispatch}
      navigation={navigation}
      toDo={toDo}
      refreshing={isWaiting}
      error={error}
      areas={areas}
      enableAreaFilter={enableAreaFilter}
      filterExceptions={filterExceptions}
      filterCategories={filterCategories}
      onRefresh={onRefresh}
      countryCode={countryCode}
      showItemImage={showItemImage}
    />
  );
};

export default AuditWorklistTab;
