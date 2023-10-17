import React from 'react';
import {
  FlatList, Text, TouchableOpacity, View
} from 'react-native';
import { useDispatch } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dispatch } from 'redux';
import { useRoute } from '@react-navigation/native';
import styles from './FilterMenu.style';
import COLOR from '../../../themes/Color';
import { useTypedSelector } from '../../../state/reducers/RootReducer';
import {
  clearFilter,
  toggleArea,
  toggleCategories,
  toggleExceptions,
  updateFilterCategories,
  updateFilterExceptions
} from '../../../state/actions/Worklist';
import { strings } from '../../../locales';
import { ExceptionList } from '../FullExceptionList';
import { trackEvent } from '../../../utils/AppCenterTool';
import {
  FilterListItem,
  FilteredCategory
} from '../../../models/FilterListItem';
import { area } from '../../../models/User';
import { WorklistItemI } from '../../../models/WorklistItem';
import { WorklistState } from '../../../state/reducers/Worklist';
import { WorklistGoal, WorklistSummary } from '../../../models/WorklistSummary';
import { RenderCategoryCollapsibleCard } from '../../../components/CategoryCollapsibleCard/CategoryCollapsibleCard';
import { MenuCard } from '../../../components/FilterMenuCard/FilterMenuCard';

interface FilteredArea extends area {
  isSelected: boolean;
}

export const renderExceptionFilterCard = (
  item: FilterListItem,
  dispatch: Dispatch<any>,
  filterExceptions: string[],
  screenName: string
): JSX.Element => {
  const onItemPress = () => {
    if (item.selected) {
      filterExceptions.splice(
        filterExceptions.indexOf(item.value),
        1
      );
      trackEvent(screenName, {
        action: 'worklist_update_filter_exceptions',
        removedException: item.value,
        exception: JSON.stringify(filterExceptions)
      });
      return dispatch(updateFilterExceptions(filterExceptions));
    }
    const replacementFilter = filterExceptions;
    replacementFilter.push(item.value);
    trackEvent(screenName, {
      action: 'worklist_update_filter_exceptions',
      addedException: item.value,
      exception: JSON.stringify(replacementFilter)
    });
    return dispatch(updateFilterExceptions(replacementFilter));
  };
  return (
    <TouchableOpacity
      testID="exception button"
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
        {item.display}
      </Text>
    </TouchableOpacity>
  );
};

export const renderAreaCheckbox = (
  isSelected: boolean,
  isPartiallySelected: boolean
) => {
  if (isSelected) {
    return (
      <MaterialCommunityIcons
        name="checkbox-marked-outline"
        size={15}
        color={COLOR.MAIN_THEME_COLOR}
      />
    );
  }
  if (isPartiallySelected) {
    return (
      <MaterialCommunityIcons
        name="minus-box"
        size={15}
        color={COLOR.MAIN_THEME_COLOR}
      />
    );
  }
  return (
    <MaterialCommunityIcons
      name="checkbox-blank-outline"
      size={15}
      color={COLOR.MAIN_THEME_COLOR}
    />
  );
};

export const renderAreaFilterCard = (
  item: FilteredArea,
  workListCatgMap: Map<number, FilteredCategory>,
  dispatch: Dispatch<any>,
  filterCategories: string[],
  filteredCategoryNbr: number[],
  screenName: string
): JSX.Element => {
  const isPartiallySelected = item.categories.some(categoryNbr => filteredCategoryNbr.includes(categoryNbr));
  const onAreaPress = () => {
    // Selects all categories for this Area
    const filteredAreas: string[] = [...filterCategories];

    if (!item.isSelected) {
      item.categories.forEach(catgNbr => {
        const category = workListCatgMap.get(catgNbr);
        if (category && !category.selected) {
          filteredAreas.push(`${category.catgNbr} - ${category.catgName}`);
        }
      });
      trackEvent(screenName, {
        action: 'worklist_update_filter_categories',
        addedArea: item.area,
        categories: JSON.stringify(filteredAreas)
      });
      return dispatch(updateFilterCategories(filteredAreas));
    }
    const filterCategoriesMap: Map<number, string> = new Map();
    filterCategories.forEach(category => {
      filterCategoriesMap.set(Number(category.split('-')[0]), category);
    });

    item.categories.forEach(catgNbr => {
      if (filterCategoriesMap.has(catgNbr)) {
        filterCategoriesMap.delete(catgNbr);
      }
    });

    const newFilteredCategories: string[] = [...filterCategoriesMap.values()];
    trackEvent(screenName, {
      action: 'worklist_update_filter_categories',
      removedArea: item.area,
      categories: JSON.stringify(newFilteredCategories)
    });
    return dispatch(updateFilterCategories(newFilteredCategories));
  };

  return (
    <TouchableOpacity
      testID="area button"
      style={styles.categoryFilterCard}
      onPress={onAreaPress}
    >
      <View style={styles.selectionView}>
        {renderAreaCheckbox(item.isSelected, isPartiallySelected)}
      </View>
      <Text style={styles.categoryFilterText} numberOfLines={2}>
        {`${item.area} `}
      </Text>
    </TouchableOpacity>
  );
};

export const renderExceptionRadioFilterCard = (
  item: FilterListItem,
  dispatch: Dispatch<any>,
  screenName: string
): JSX.Element => {
  const onItemPress = () => {
    trackEvent(screenName, {
      action: 'worklist_update_filter_exceptions',
      exception: JSON.stringify(item.value)
    });
    return dispatch(updateFilterExceptions([item.value]));
  };
  return (
    <TouchableOpacity
      testID="radio exception button"
      style={styles.categoryFilterCard}
      onPress={onItemPress}
    >
      <View style={styles.selectionView}>
        {item.selected ? (
          <MaterialCommunityIcons
            name="radiobox-marked"
            size={15}
            color={COLOR.MAIN_THEME_COLOR}
          />
        ) : (
          <MaterialCommunityIcons
            name="radiobox-blank"
            size={15}
            color={COLOR.MAIN_THEME_COLOR}
          />
        )}
      </View>
      <Text style={styles.categoryFilterText} numberOfLines={2}>
        {item.display}
      </Text>
    </TouchableOpacity>
  );
};

export const RenderAreaCard = (props: {
  areaOpen: boolean;
  dispatch: Dispatch<any>;
  areas: area[];
  filterCategories: string[];
  categoryMap: FilteredCategory[];
  screenName: string;
}): JSX.Element => {
  const {
    areaOpen, dispatch, areas, filterCategories, categoryMap, screenName
  } = props;
  const filteredCategoryNbr: number[] = filterCategories.map(category => Number(category.split('-')[0]));

  const workListCatgMap: Map<number, FilteredCategory> = new Map();
  categoryMap.forEach(category => {
    if (category.catgNbr) {
      workListCatgMap.set(category.catgNbr, category);
    }
  });
  const areasFiltered: FilteredArea[] = areas.map(item => {
    const isAllSelected: boolean[] = [];
    const newCategories: number[] = [];
    // Checks if WorkList API is missing Item categories
    item.categories.forEach(catgNbr => {
      if (workListCatgMap.has(catgNbr)) {
        newCategories.push(catgNbr);

        if (workListCatgMap.get(catgNbr)?.selected) {
          isAllSelected.push(true);
        } else {
          isAllSelected.push(false);
        }
      }
    });
    return {
      area: item.area,
      categories: newCategories,
      isSelected: isAllSelected.length > 0 && isAllSelected.every(value => value === true)
    };
  });

  const selectedAmount = areasFiltered.filter(item => item.isSelected).length;
  let areaSubText = '';
  if (selectedAmount === 0) {
    areaSubText = strings('WORKLIST.ALL');
  } else {
    areaSubText = `${selectedAmount} ${strings('GENERICS.SELECTED')}`;
  }

  return (
    <>
      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => {
          trackEvent(screenName, {
            action: 'toggle_area_filter',
            areaOpen: !areaOpen
          });
          dispatch(toggleArea(!areaOpen));
        }}
      >
        <MenuCard
          title={strings('WORKLIST.AREA')}
          subtext={areaSubText}
          opened={areaOpen}
        />
      </TouchableOpacity>
      {areaOpen && (
        <FlatList
          data={areasFiltered}
          renderItem={({ item }) => renderAreaFilterCard(
            item,
            workListCatgMap,
            dispatch,
            filterCategories,
            filteredCategoryNbr,
            screenName
          )}
          style={styles.categoryList}
          keyExtractor={(item: area) => item.area}
        />
      )}
    </>
  );
};

export const RenderExceptionTypeCard = (props: {
  exceptionOpen: boolean;
  filterExceptions: string[];
  dispatch: Dispatch<any>;
  wlSummary: WorklistSummary | undefined;
  isAudits: boolean,
  disableAuditWL: boolean;
  screenName: string;
  disableOnHandsWL: boolean
}): JSX.Element => {
  const {
    exceptionOpen, filterExceptions, dispatch, wlSummary, isAudits, disableAuditWL, screenName, disableOnHandsWL
  } = props;
  const fullExceptionList = ExceptionList.getInstance();
  const exceptionMap: FilterListItem[] = [];

  wlSummary?.worklistTypes.forEach(worklist => {
    if (disableAuditWL && worklist.worklistType === 'AU') {
      return;
    }
    if (disableOnHandsWL && worklist.worklistType === 'NO') {
      return;
    }
    const exceptionType = fullExceptionList.get(worklist.worklistType);
    if (exceptionType) {
      const isSelected = filterExceptions.indexOf(worklist.worklistType) !== -1;
      exceptionMap.push({
        value: worklist.worklistType,
        display: exceptionType,
        selected: isSelected
      });
    }
  });

  let subtext = '';
  if (filterExceptions.length === 0) {
    subtext = strings('WORKLIST.ALL');
  } else {
    filterExceptions.forEach((exception: string) => {
      const exceptionObj = fullExceptionList.get(exception);
      if (exceptionObj && subtext !== '') {
        subtext = `${subtext}\n${exceptionObj}`;
      } else if (exceptionObj) {
        subtext = exceptionObj;
      }
    });
  }

  return (
    <>
      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => {
          trackEvent(screenName, {
            action: 'toggle_ exceptions_filter',
            exceptionOpen: !exceptionOpen
          });
          dispatch(toggleExceptions(!exceptionOpen));
        }}
      >
        <MenuCard
          title={strings('WORKLIST.EXCEPTION_TYPE')}
          subtext={subtext}
          opened={exceptionOpen}
        />
      </TouchableOpacity>
      {exceptionOpen && (
        <FlatList
          data={exceptionMap}
          renderItem={({ item }) => (isAudits ? renderExceptionRadioFilterCard(item, dispatch, screenName)
            : renderExceptionFilterCard(item, dispatch, filterExceptions, screenName))}
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

export const getCategoryMap = (
  workListItems: WorklistItemI[],
  filterCategories: string[]
): FilteredCategory[] => {
  const categoryMap: FilteredCategory[] = workListItems.map(item => {
    const isSelected = filterCategories.indexOf(`${item.catgNbr} - ${item.catgName}`) !== -1;
    return {
      catgNbr: item.catgNbr,
      catgName: item.catgName,
      selected: isSelected
    };
  });
  return categoryMap.sort(
    (firstItem: any, secondItem: any) => firstItem.catgNbr - secondItem.catgNbr
  );
};

const isRollOverComplete = (wlSummary: WorklistSummary) => {
  const rollOverSummary = wlSummary.worklistTypes.find(wlType => wlType.worklistType === 'RA');
  if (rollOverSummary) {
    return rollOverSummary.totalItems === 0 || rollOverSummary.completedItems === rollOverSummary.totalItems;
  }
  return true;
};
interface FilterMenuProps {
  categoryOpen: boolean;
  filterCategories: string[];
  exceptionOpen: boolean;
  filterExceptions: string[];
  dispatch: Dispatch<any>;
  areaOpen: boolean;
  areas: area[];
  categoryMap: FilteredCategory[];
  enableAreaFilter: boolean;
  wlSummary: WorklistSummary[];
  selectedWorklistGoal: WorklistGoal;
  showRollOverAudit: boolean;
  screenName: string;
  userFeatures: string[];
}

export const FilterMenuComponent = (props: FilterMenuProps): JSX.Element => {
  const {
    categoryOpen,
    filterCategories,
    dispatch,
    exceptionOpen,
    filterExceptions,
    areaOpen,
    areas,
    categoryMap,
    enableAreaFilter,
    wlSummary,
    selectedWorklistGoal,
    showRollOverAudit,
    screenName,
    userFeatures
  } = props;
  const worklistIndex = wlSummary.findIndex(item => item.worklistGoal === selectedWorklistGoal);
  const disableAuditWL = showRollOverAudit && !isRollOverComplete(wlSummary[worklistIndex]);
  const disableOnHandsWL = !userFeatures.includes('on hands change');

  return (
    <View style={styles.menuContainer}>
      <View style={styles.headerBar}>
        <Text style={styles.refineText}>{strings('WORKLIST.REFINE')}</Text>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => {
            trackEvent(screenName, {
              action: 'clear_filters_clicked'
            });
            onClearPress(props.dispatch);
          }}
        >
          <Text style={styles.clearText}>{strings('WORKLIST.CLEAR')}</Text>
        </TouchableOpacity>
      </View>
      { enableAreaFilter
      && (
      <RenderAreaCard
        areaOpen={areaOpen}
        dispatch={dispatch}
        areas={areas}
        filterCategories={filterCategories}
        categoryMap={categoryMap}
        screenName={screenName}
      />
      )}
      <RenderCategoryCollapsibleCard
        categoryMap={categoryMap}
        categoryOpen={categoryOpen}
        filterCategories={filterCategories}
        source={screenName}
        // already toggled in the component, just needs to get into redux
        toggleCategories={(updatedCatOpen: boolean) => dispatch(toggleCategories(updatedCatOpen))}
        updateFilterCatgories={(updatedCats: string[]) => dispatch(updateFilterCategories(updatedCats))}
      />
      <RenderExceptionTypeCard
        exceptionOpen={exceptionOpen}
        filterExceptions={filterExceptions}
        dispatch={dispatch}
        wlSummary={wlSummary[worklistIndex]}
        isAudits={selectedWorklistGoal === WorklistGoal.AUDITS}
        disableAuditWL={disableAuditWL}
        screenName={screenName}
        disableOnHandsWL={disableOnHandsWL}
      />
    </View>
  );
};

export const FilterMenu = (props: {screenName: string;}): JSX.Element => {
  const dispatch = useDispatch();
  const appUser = useTypedSelector(state => state.User);
  const {
    areas, enableAreaFilter, showRollOverAudit, inProgress
  } = appUser.configs;
  const workListApi = inProgress ? useTypedSelector(state => state.async.getWorklistV1)
    : useTypedSelector(state => state.async.getWorklist);
  const auditWorklistItems = useTypedSelector(state => state.AuditWorklist.items);
  const { screenName } = props;
  const {
    categoryOpen,
    filterCategories,
    exceptionOpen,
    filterExceptions,
    areaOpen,
    workListType
  } = useTypedSelector(state => state.Worklist) as WorklistState;
  const wlSummary: WorklistSummary[] = useTypedSelector(state => state.async.getWorklistSummary.result?.data);
  const wlSummaryV2: WorklistSummary[] = useTypedSelector(state => state.async.getWorklistSummaryV2.result?.data) || [];
  const { result } = workListApi;
  let data: WorklistItemI[] = result && result.data && Array.isArray(result.data) ? result.data : [];
  if (workListType === 'AUDIT') {
    data = auditWorklistItems;
  }
  const categoryMap: FilteredCategory[] = getCategoryMap(
    data,
    filterCategories
  );
  const route = useRoute();
  const selectedWorklistGoal = route.name.includes('Audit') ? WorklistGoal.AUDITS : WorklistGoal.ITEMS;

  return (
    <FilterMenuComponent
      dispatch={dispatch}
      categoryOpen={categoryOpen}
      filterCategories={filterCategories}
      exceptionOpen={exceptionOpen}
      filterExceptions={filterExceptions}
      areaOpen={areaOpen}
      areas={areas}
      categoryMap={categoryMap}
      enableAreaFilter={enableAreaFilter}
      wlSummary={wlSummary || wlSummaryV2}
      selectedWorklistGoal={selectedWorklistGoal}
      showRollOverAudit={showRollOverAudit}
      screenName={screenName}
      userFeatures={appUser.features}
    />
  );
};
