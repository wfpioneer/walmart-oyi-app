import React, { Dispatch } from 'react';
import {
  FlatList, Text, TouchableOpacity, View
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { strings } from '../../../locales';
import {
  ApprovalFilteredCategory
} from '../../../models/FilterListItem';
import {
  clearApprovalFilter,
  toggleFilterCategories,
  updateApprovalFilterCategories
} from '../../../state/actions/Approvals';
import { useTypedSelector } from '../../../state/reducers/RootReducer';
import COLOR from '../../../themes/Color';
import { trackEvent } from '../../../utils/AppCenterTool';
import { MenuCard } from '../../Worklist/FilterMenu/FilterMenu';
import styles from './ApprovalFilterMenu.styles';
import { ApprovalListItem } from '../../../models/ApprovalListItem';

interface FilterMenuProps {
  categoryOpen: boolean;
  filterCategories: string[];
  dispatch: Dispatch<any>;
  categoryMap: ApprovalFilteredCategory[];
}
// Renders audit/itemdetails resource card
// export const renderSourceFilterCard = (
//   item: FilterListItem,
//   dispatch: Dispatch<any>
// ) => {
//   const onItemPress = () => console.log('select');
//   return (
//     <TouchableOpacity
//       testID="request source button"
//       style={styles.categoryFilterCard}
//       onPress={onItemPress}
//     >
//       <View style={styles.selectionView}>
//         {item.selected ? (
//           <MaterialCommunityIcons
//             name="checkbox-marked-outline"
//             size={15}
//             color={COLOR.MAIN_THEME_COLOR}
//           />
//         ) : (
//           <MaterialCommunityIcons
//             name="checkbox-blank-outline"
//             size={15}
//             color={COLOR.MAIN_THEME_COLOR}
//           />
//         )}
//       </View>
//       <Text style={styles.categoryFilterText} numberOfLines={2}>
//         {`${item.display} `}
//       </Text>
//     </TouchableOpacity>
//   );
// };

// export const RenderSourceCollapsibleCard = (props: any) => {

// }
export const renderCategoryFilterCard = (
  item: ApprovalFilteredCategory,
  dispatch: Dispatch<any>,
  filterCategories: string[]
): JSX.Element => {
  const onItemPress = () => {
    if (item.selected) {
      filterCategories.splice(
        filterCategories.indexOf(
          `${item.categoryNbr} - ${item.categoryDescription}`
        ),
        1
      );
      trackEvent('approval_update_filter_categories', {
        categories: JSON.stringify(filterCategories)
      });
      return dispatch(updateApprovalFilterCategories(filterCategories));
    }

    const replacementFilter = filterCategories;
    replacementFilter.push(`${item.categoryNbr} - ${item.categoryDescription}`);
    return dispatch(updateApprovalFilterCategories(replacementFilter));
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
        {`${item.categoryNbr} - ${item.categoryDescription} `}
      </Text>
    </TouchableOpacity>
  );
};

export const RenderCategoryCollapsibleCard = (props: {
  categoryMap: ApprovalFilteredCategory[];
  categoryOpen: boolean;
  filterCategories: string[];
  dispatch: Dispatch<any>;
}): JSX.Element => {
  const {
    categoryMap, categoryOpen, filterCategories, dispatch
  } = props;
  const categoryNumberMap = categoryMap.map(
    (item: ApprovalFilteredCategory) => item.categoryNbr
  );
  const categoryNumberSet = new Set();
  categoryNumberMap.forEach(catgNbr => categoryNumberSet.add(catgNbr));
  const filteredCategories = categoryMap.filter(item => {
    if (categoryNumberSet.has(item.categoryNbr)) {
      categoryNumberSet.delete(item.categoryNbr);
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
          dispatch(toggleFilterCategories(!categoryOpen));
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
          keyExtractor={(item: any) => item.categoryNbr.toString()}
        />
      )}
    </>
  );
};

export const getCategoryMap = (
  approvalListItems: ApprovalListItem[],
  filterCategories: string[]
): ApprovalFilteredCategory[] => {
  const categoryMap: ApprovalFilteredCategory[] = approvalListItems.map(
    item => {
      const isSelected = filterCategories.indexOf(
        `${item.categoryNbr} - ${item.categoryDescription}`
      ) !== -1;
      return {
        categoryNbr: item.categoryNbr,
        categoryDescription: item.categoryDescription,
        selected: isSelected
      };
    }
  );
  return categoryMap.sort(
    (firstItem: any, secondItem: any) => firstItem.catgNbr - secondItem.catgNbr
  );
};

export const ApprovalFilterMenuComponent = (props: FilterMenuProps) => {
  const {
    categoryMap, categoryOpen, dispatch, filterCategories
  } = props;
  const onClearPress = () => {
    trackEvent('approvals_clear_filter');
    dispatch(clearApprovalFilter());
  };
  return (
    <View style={styles.menuContainer}>
      <View style={styles.headerBar}>
        <Text style={styles.refineText}>{strings('WORKLIST.REFINE')}</Text>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => onClearPress()}
        >
          <Text style={styles.clearText}>{strings('WORKLIST.CLEAR')}</Text>
        </TouchableOpacity>
      </View>
      <RenderCategoryCollapsibleCard
        categoryMap={categoryMap}
        categoryOpen={categoryOpen}
        filterCategories={filterCategories}
        dispatch={dispatch}
      />
    </View>
  );
};

export const ApprovalFilterMenu = (): JSX.Element => {
  const dispatch = useDispatch();
  const { approvalList, filterCategories, categoryOpen } = useTypedSelector(
    state => state.Approvals
  );
  const categoryMap = getCategoryMap(approvalList, filterCategories);
  return (
    <ApprovalFilterMenuComponent
      categoryMap={categoryMap}
      categoryOpen={categoryOpen}
      dispatch={dispatch}
      filterCategories={filterCategories}
    />
  );
};
