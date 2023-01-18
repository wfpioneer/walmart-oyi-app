import { NavigationProp, useNavigation } from '@react-navigation/native';
import { groupBy, partition } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import {
  FlatList, Text, TouchableOpacity, View
} from 'react-native';
import { AxiosError } from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { WorklistItemI } from '../../models/WorklistItem';
import { setAuditItemNumber } from '../../state/actions/AuditWorklist';
import COLOR from '../../themes/Color';
import styles from './AuditWorklistTab.style';
import { strings } from '../../locales';
import { Configurations, area } from '../../models/User';
import { ExceptionList } from './FullExceptionList';
import { FilterPillButton } from '../../components/filterPillButton/FilterPillButton';
import { updateFilterCategories, updateFilterExceptions } from '../../state/actions/Worklist';
import { FilterType } from '../../models/FilterListItem';
import { trackEvent } from '../../utils/AppCenterTool';
import CollapseAllBar from '../../components/CollapseAllBar/CollapseAllBar';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import { UseStateType } from '../../models/Generics.d';

const ROLLOVER_AUDITS = 'RA';

export interface AuditWorklistTabProps {
    toDo: boolean;
    onRefresh: () => void;
}

export interface AuditWorklistTabScreenProps {
    items: WorklistItemI[];
    navigation: NavigationProp<any>;
    dispatch: Dispatch<any>;
    toDo: boolean;
    refreshing: boolean;
    error: AxiosError | null;
    filterExceptions: string[];
    filterCategories: string[];
    onRefresh: () => void;
    countryCode: string;
    config: Configurations;
    trackEventCall: typeof trackEvent;
    collapsedState: UseStateType<boolean>;
    isLoadedState: UseStateType<boolean>;
    useEffectHook: typeof useEffect;
}

const onItemClick = (
  itemNumber: number,
  navigation: NavigationProp<any>,
  dispatch: Dispatch<any>,
  trackEventCall: typeof trackEvent,
  worklistType: string
) => {
  dispatch(setAuditItemNumber(itemNumber));
  trackEventCall('Audit_Worklist', { action: 'worklist_item_click', itemNbr: itemNumber });
  navigation.navigate('AuditItem', { worklistType });
};

const renderCategoryCard = (
  category: string, items: WorklistItemI[], collapsed: boolean, navigation: NavigationProp<any>,
  dispatch: Dispatch<any>, trackEventCall: typeof trackEvent,
  showItemImage: boolean, countryCode: string
) => (
  <CategoryCard
    category={category}
    listOfItems={items}
    collapsed={collapsed}
    onItemCardClick={(itemNumber: number, worklistType: string) => {
      onItemClick(itemNumber, navigation, dispatch, trackEventCall, worklistType);
    }}
    showItemImage={showItemImage}
    countryCode={countryCode}
  />
);

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
    items, refreshing, dispatch, navigation, error, useEffectHook,
    trackEventCall, config, filterExceptions, filterCategories,
    onRefresh, countryCode, collapsedState, isLoadedState
  } = props;
  const {
    areas, enableAreaFilter, showItemImage, showRollOverAudit
  } = config;
  const [isLoaded, setIsLoaded] = isLoadedState;

  const [collapsed, setCollapsed] = collapsedState;
  const fullExceptionList = ExceptionList.getInstance();

  const isRollOverComplete = () => !items.some(item => item.worklistType === ROLLOVER_AUDITS && !item.completed);
  useEffectHook(() => {
    if (!isLoaded
      && showRollOverAudit
      && !isRollOverComplete()) {
      if (!filterExceptions.includes(ROLLOVER_AUDITS)) {
        dispatch(updateFilterExceptions([...filterExceptions, ROLLOVER_AUDITS]));
      }
      setIsLoaded(true);
    }
  }, [filterCategories, items, showRollOverAudit]);

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

  const itemsBasedOnCategory = groupBy(filteredData, item => `${item.catgNbr} - ${item.catgName}`);
  const auditItemKeys = Object.keys(itemsBasedOnCategory);

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
      {auditItemKeys.length > 0
        && (
        <CollapseAllBar
          collapsed={collapsed}
          onclick={() => {
            trackEventCall('Audit_Worklist',
              { action: `${collapsed ? 'expand' : 'collapse'}_audit_item_worklists_click` });
            setCollapsed(!collapsed);
          }}
        />
        )}
      <FlatList
        data={auditItemKeys}
        renderItem={({ item: key }) => renderCategoryCard(
          key, itemsBasedOnCategory[key], collapsed, navigation, dispatch, trackEventCall,
          showItemImage, countryCode
        )}
        keyExtractor={item => `category-${item}`}
        onRefresh={() => {
          setIsLoaded(false);
          onRefresh();
        }}
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
  const { configs } = useTypedSelector(state => state.User);
  const { countryCode } = useTypedSelector(state => state.User);
  const { filterExceptions, filterCategories } = useTypedSelector(state => state.Worklist);
  const collapsedState = useState(false);
  const isLoadedState = useState(false);
  return (
    <AuditWorklistTabScreen
      items={items}
      dispatch={dispatch}
      navigation={navigation}
      toDo={toDo}
      refreshing={isWaiting}
      error={error}
      filterExceptions={filterExceptions}
      filterCategories={filterCategories}
      onRefresh={onRefresh}
      countryCode={countryCode}
      trackEventCall={trackEvent}
      collapsedState={collapsedState}
      config={configs}
      useEffectHook={useEffect}
      isLoadedState={isLoadedState}
    />
  );
};

export default AuditWorklistTab;