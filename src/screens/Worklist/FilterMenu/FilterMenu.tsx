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

interface MenuCardProps {
  title: string;
  subtext: string;
  opened: boolean;
}
interface FilteredArea extends area {
  isSelected: boolean;
}

export const MenuCard = (props: MenuCardProps): JSX.Element => {
  const iconName = props.opened ? 'keyboard-arrow-up' : 'keyboard-arrow-down';
  return (
    <>
      <View style={styles.menuCardText}>
        <Text>{props.title}</Text>
        <Text style={styles.subtitleText}>{props.subtext}</Text>
      </View>
      <View style={styles.arrowView}>
        <MaterialIcons name={iconName} size={25} color={COLOR.GREY_700} />
      </View>
    </>
  );
};

export const renderCategoryFilterCard = (
  item: FilteredCategory,
  dispatch: Dispatch<any>,
  filterCategories: string[]
): JSX.Element => {
  const onItemPress = () => {
    if (item.selected) {
      filterCategories.splice(
        filterCategories.indexOf(`${item.catgNbr} - ${item.catgName}`),
        1
      );
      trackEvent('worklist_update_filter_categories', {
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

export const renderExceptionFilterCard = (
  item: FilterListItem,
  dispatch: Dispatch<any>
): JSX.Element => {
  const onItemPress = () => {
    trackEvent('worklist_update_filter_exceptions', { exception: item.value });
    return dispatch(updateFilterExceptions([item.value]));
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
            name="checkbox-marked-circle-outline"
            size={15}
            color={COLOR.MAIN_THEME_COLOR}
          />
        ) : (
          <MaterialCommunityIcons
            name="checkbox-blank-circle-outline"
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
  filteredCategoryNbr: number[]
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

export const RenderAreaCard = (props: {
  areaOpen: boolean;
  dispatch: Dispatch<any>;
  areas: area[];
  filterCategories: string[];
  categoryMap: FilteredCategory[];
}): JSX.Element => {
  const {
    areaOpen, dispatch, areas, filterCategories, categoryMap
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
            filteredCategoryNbr
          )}
          style={styles.categoryList}
          keyExtractor={(item: area) => item.area}
        />
      )}
    </>
  );
};

export const RenderCategoryCollapsibleCard = (props: {
  categoryMap: FilteredCategory[];
  categoryOpen: boolean;
  filterCategories: string[];
  dispatch: Dispatch<any>;
}): JSX.Element => {
  const {
    categoryMap, categoryOpen, filterCategories, dispatch
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
          renderItem={({ item }) => renderCategoryFilterCard(item, dispatch, filterCategories)}
          style={styles.categoryList}
          keyExtractor={(item: any) => item.catgNbr.toString()}
        />
      )}
    </>
  );
};

export const RenderExceptionTypeCard = (props: {
  exceptionOpen: boolean;
  filterExceptions: string[];
  dispatch: Dispatch<any>;
}): JSX.Element => {
  const { exceptionOpen, filterExceptions, dispatch } = props;
  const fullExceptionList = ExceptionList.getInstance();
  const exceptionMap: FilterListItem[] = [];

  fullExceptionList.forEach((value, key) => {
    const isSelected = filterExceptions.indexOf(key) !== -1;
    exceptionMap.push({ value: key, display: value, selected: isSelected });
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
          renderItem={({ item }) => renderExceptionFilterCard(item, dispatch)}
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
  const categoryMap: FilteredCategory[] = workListItems.map((item: any) => {
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

interface FilterMenuProps {
  categoryOpen: boolean;
  filterCategories: string[];
  exceptionOpen: boolean;
  filterExceptions: string[];
  dispatch: Dispatch<any>;
  areaOpen: boolean;
  areas: area[];
  categoryMap: FilteredCategory[];
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
    categoryMap
  } = props;

  return (
    <View style={styles.menuContainer}>
      <View style={styles.headerBar}>
        <Text style={styles.refineText}>{strings('WORKLIST.REFINE')}</Text>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => onClearPress(props.dispatch)}
        >
          <Text style={styles.clearText}>{strings('WORKLIST.CLEAR')}</Text>
        </TouchableOpacity>
      </View>
      <RenderAreaCard
        areaOpen={areaOpen}
        dispatch={dispatch}
        areas={areas}
        filterCategories={filterCategories}
        categoryMap={categoryMap}
      />
      <RenderCategoryCollapsibleCard
        categoryMap={categoryMap}
        categoryOpen={categoryOpen}
        filterCategories={filterCategories}
        dispatch={dispatch}
      />
      <RenderExceptionTypeCard
        exceptionOpen={exceptionOpen}
        filterExceptions={filterExceptions}
        dispatch={dispatch}
      />
    </View>
  );
};

export const FilterMenu = (): JSX.Element => {
  const dispatch = useDispatch();
  const workListApi = useTypedSelector(state => state.async.getWorklist);
  const {
    categoryOpen,
    filterCategories,
    exceptionOpen,
    filterExceptions,
    areaOpen
  } = useTypedSelector(state => state.Worklist) as WorklistState;
  const { areas } = useTypedSelector(state => state.User.configs);
  const { result } = workListApi;
  const data: WorklistItemI[] = result && result.data && Array.isArray(result.data) ? result.data : [];
  const categoryMap: FilteredCategory[] = getCategoryMap(
    data,
    filterCategories
  );

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
    />
  );
};
