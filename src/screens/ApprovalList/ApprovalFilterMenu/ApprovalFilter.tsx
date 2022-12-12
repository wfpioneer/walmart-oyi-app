import React from 'react';
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
import { ApprovalListItem, approvalRequestSource } from '../../../models/ApprovalListItem';
import { RenderCategoryCollapsibleCard } from '../../../components/CategoryCollapsibleCard/CategoryCollapsibleCard';
import { useTypedSelector } from '../../../state/reducers/RootReducer';
import { MenuCard } from '../../../components/FilterMenuCard/FilterMenuCard';
import { trackEvent } from '../../../utils/AppCenterTool';
import styles from './ApprovalFilter.style';
import COLOR from '../../../themes/Color';
import { strings } from '../../../locales';
import {
  clearFilter,
  toggleCategories, toggleSources, updateFilterCategories, updateFilterSources
} from '../../../state/actions/Approvals';

interface ApprovalFilterProps {
  dispatch: Dispatch<any>;
  approvalList: ApprovalListItem[];
  categoryOpen: boolean;
  sourceOpen: boolean;
  filteredCategories: string[];
  filteredSources: string[];
}

export const renderSourceFilterCard = (
  item: FilteredCategory,
  filterSources: string[],
  updateFilterSrcs: (categories: string[]) => void
): JSX.Element => {
  const onItemPress = () => {
    if (item.selected) {
      filterSources.splice(
        filterSources.indexOf(item.catgName),
        1
      );
      trackEvent('approvals_update_filter_source', {
        categories: JSON.stringify(filterSources)
      });
      return updateFilterSrcs(filterSources);
    }

    const replacementFilter = filterSources;
    replacementFilter.push(item.catgName);
    return updateFilterSrcs(replacementFilter);
  };
  let displayName = '';
  switch (item.catgName) {
    case approvalRequestSource.Audits:
      displayName = strings('AUDITS.AUDITS');
      break;
    case approvalRequestSource.ItemDetails:
      displayName = strings('GENERICS.ITEMS');
      break;
    default:
      displayName = strings('GENERICS.NOT_FOUND');
  }
  return (
    <TouchableOpacity
      testID="category button"
      style={styles.categoryFilterCard}
      onPress={onItemPress}
    >
      <View style={styles.selectionView}>
        <MaterialCommunityIcons
          name={item.selected ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
          size={15}
          color={COLOR.MAIN_THEME_COLOR}
        />
      </View>
      <Text style={styles.categoryFilterText} numberOfLines={2}>
        {displayName}
      </Text>
    </TouchableOpacity>
  );
};

export const RenderSourceCollapsibleCard = (props: {
    sourceMap: FilteredCategory[];
    sourceOpen: boolean;
    filterSources: string[];
    updateFilterSrcs: (categories: string[]) => void;
    toggleSrcs: (open: boolean) => void;
  }): JSX.Element => {
  const {
    sourceMap, sourceOpen, filterSources, updateFilterSrcs, toggleSrcs
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
          toggleSrcs(!sourceOpen);
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
        renderItem={({ item }) => renderSourceFilterCard(item, filterSources, updateFilterSrcs)}
        style={styles.categoryList}
        keyExtractor={(item: any) => item.catgName}
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
    const source = item.approvalRequestSource || '';
    const isSelected = filteredSources.indexOf(source) !== -1;
    return {
      catgName: item.approvalRequestSource || '',
      selected: isSelected
    };
  });
  return sourceMap.sort((firstItem: FilteredCategory, secondItem: FilteredCategory) => (
    firstItem.catgName.toLowerCase() < secondItem.catgName.toLowerCase()
      ? -1
      : Number(firstItem.catgName.toLowerCase() > secondItem.catgName.toLowerCase())
  ));
};

export const onClearPress = (dispatch: Dispatch<any>): void => {
  trackEvent('approvals_clear_filter');
  dispatch(clearFilter());
};

export const ApprovalFilterScreen = (props: ApprovalFilterProps) => {
  const {
    dispatch,
    approvalList,
    categoryOpen,
    filteredCategories,
    filteredSources,
    sourceOpen
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
      <RenderCategoryCollapsibleCard
        categoryMap={getCategoryMap(approvalList, filteredCategories)}
        categoryOpen={categoryOpen}
        filterCategories={filteredCategories}
        updateFilterCatgories={(updatedCats: string[]) => dispatch(updateFilterCategories(updatedCats))}
        source="approval"
        toggleCategories={(updatedCatOpen: boolean) => dispatch(toggleCategories(updatedCatOpen))}
      />
      <RenderSourceCollapsibleCard
        sourceMap={getSourceMap(approvalList, filteredSources)}
        filterSources={filteredSources}
        sourceOpen={sourceOpen}
        updateFilterSrcs={(updatedSources: string[]) => dispatch(updateFilterSources(updatedSources))}
        toggleSrcs={(updatedOpen: boolean) => dispatch(toggleSources(updatedOpen))}
      />
    </View>
  );
};

const ApprovalFilter = () => {
  const {
    approvalList,
    categoryOpen,
    sourceOpen,
    filterCategories,
    filterSources
  } = useTypedSelector(state => state.Approvals);
  const dispatch = useDispatch();

  return (
    <ApprovalFilterScreen
      dispatch={dispatch}
      categoryOpen={categoryOpen}
      sourceOpen={sourceOpen}
      approvalList={approvalList}
      filteredCategories={filterCategories}
      filteredSources={filterSources}
    />
  );
};

export default ApprovalFilter;
