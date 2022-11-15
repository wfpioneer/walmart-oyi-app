import React, { useState } from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FilteredCategory } from '../../../models/FilterListItem';
import { ApprovalListItem } from '../../../models/ApprovalListItem';
import { RenderCategoryCollapsibleCard } from '../../../components/CategoryCollapsibleCard/CategoryCollapsibleCard';
import { UseStateType } from '../../../models/Generics.d';
import { useTypedSelector } from '../../../state/reducers/RootReducer';
import { MenuCard } from '../../Worklist/FilterMenu/FilterMenu';
import { trackEvent } from '../../../utils/AppCenterTool';
import styles from './ApprovalFilter.style';
import COLOR from '../../../themes/Color';
import { strings } from '../../../locales';

interface ApprovalFilterProps {
  dispatch: Dispatch<any>;
  categoryOpenState: UseStateType<boolean>;
  sourceOpenState: UseStateType<boolean>;
  approvalList: ApprovalListItem[];
  filteredCategoriesState: UseStateType<string[]>;
  filteredSourcesState: UseStateType<string[]>;
}

export const renderSourceFilterCard = (
  item: FilteredCategory,
  dispatch: Dispatch<any>,
  filterSources: string[],
  updateFilterSources: (categories: string[]) => void
): JSX.Element => {
  const onItemPress = () => {
    if (item.selected) {
      filterSources.splice(
        filterSources.indexOf(`${item.catgNbr} - ${item.catgName}`),
        1
      );
      trackEvent('approvals_update_filter_source', {
        categories: JSON.stringify(filterSources)
      });
      return dispatch(updateFilterSources(filterSources));
    }

    const replacementFilter = filterSources;
    replacementFilter.push(`${item.catgNbr} - ${item.catgName}`);
    return dispatch(updateFilterSources(replacementFilter));
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

export const RenderSourceCollapsibleCard = (props: {
    sourceMap: FilteredCategory[];
    sourceOpen: boolean;
    filterSources: string[];
    dispatch: Dispatch<any>;
    updateFilterSources: (categories: string[]) => void;
    toggleSources: (open: boolean) => void;
  }): JSX.Element => {
  const {
    sourceMap, sourceOpen, filterSources, dispatch, updateFilterSources, toggleSources
  } = props;

  const sourceNameMap = sourceMap.map(
    (item: FilteredCategory) => item.catgName
  );
  const sourceNameSet = new Set();
  sourceNameMap.forEach(item => sourceNameSet.add(item));

  const filteredSources = sourceMap.filter((item: any) => {
    if (sourceNameSet.has(item.catgName)) {
      sourceNameSet.delete(item.catgName);
      return true;
    }
    return false;
  });

  let categorySubtext = '';
  if (filterSources.length === 0) {
    categorySubtext = strings('WORKLIST.ALL');
  } else {
    categorySubtext = `${filterSources.length} ${strings(
      'GENERICS.SELECTED'
    )}`;
  }

  return (
    <>
      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => {
          dispatch(toggleSources(!sourceOpen));
        }}
      >
        <MenuCard
          title={strings('APPROVAL.SOURCE')}
          subtext={categorySubtext}
          opened={sourceOpen}
        />
      </TouchableOpacity>
      {sourceOpen && (
      <FlatList
        data={filteredSources}
        renderItem={({ item }) => renderSourceFilterCard(item, dispatch, filterSources, updateFilterSources)}
        style={styles.categoryList}
        keyExtractor={(item: any) => item.catgNbr.toString()}
      />
      )}
    </>
  );
};

export const getCategoryMap = (
  approvalItems: ApprovalListItem[],
  filteredCategories: string[]
): FilteredCategory[] => {
  const categoryMap: FilteredCategory[] = approvalItems.map(item => {
    const isSelected = filteredCategories.indexOf(`${item.categoryNbr} - ${item.categoryDescription}`) !== -1;
    return {
      catgNbr: item.categoryNbr,
      catgName: item.categoryDescription,
      selected: isSelected
    };
  });
  return categoryMap.sort(
    (firstItem: any, secondItem: any) => firstItem.catgNbr - secondItem.catgNbr
  );
};

export const getSourceMap = (
  approvalItems: ApprovalListItem[],
  filteredSources: string[]
): FilteredCategory[] => {
  const sourceMap: FilteredCategory[] = approvalItems.map(item => {
    const isSelected = filteredSources.indexOf(item.approvalRequestSource) !== -1;
    return {
      catgName: item.approvalRequestSource,
      selected: isSelected
    };
  });
  return sourceMap.sort((firstItem: FilteredCategory, secondItem: FilteredCategory) => (
    firstItem.catgName.localeCompare(secondItem.catgName)
  ));
};

export const ApprovalFilterScreen = (props: ApprovalFilterProps) => {
  const {
    dispatch,
    categoryOpenState,
    approvalList,
    filteredCategoriesState,
    filteredSourcesState,
    sourceOpenState
  } = props;

  return (
    <View>
      <RenderCategoryCollapsibleCard
        categoryMap={getCategoryMap(approvalList, filteredCategoriesState[0])}
        categoryOpen={categoryOpenState[0]}
        dispatch={dispatch}
        filterCategories={filteredCategoriesState[0]}
        updateFilterCatgories={filteredCategoriesState[1]}
        source="approval"
        toggleCategories={categoryOpenState[1]}
      />
      <RenderSourceCollapsibleCard
        sourceMap={getSourceMap(approvalList, filteredSourcesState[0])}
        dispatch={dispatch}
        filterSources={filteredSourcesState[0]}
        sourceOpen={sourceOpenState[0]}
        toggleSources={sourceOpenState[1]}
        updateFilterSources={filteredSourcesState[1]}
      />
      <Text>Hekki</Text>
    </View>
  );
};

const ApprovalFilter = () => {
  const categoryOpenState = useState(false);
  const sourceOpenState = useState(false);
  const filterCategoriesState = useState<Array<string>>([]);
  const filterSourcesState = useState<Array<string>>([]);
  const { approvalList } = useTypedSelector(state => state.Approvals);
  const dispatch = useDispatch();

  return (
    <ApprovalFilterScreen
      dispatch={dispatch}
      categoryOpenState={categoryOpenState}
      sourceOpenState={sourceOpenState}
      approvalList={approvalList}
      filteredCategoriesState={filterCategoriesState}
      filteredSourcesState={filterSourcesState}
    />
  );
};

export default ApprovalFilter;
