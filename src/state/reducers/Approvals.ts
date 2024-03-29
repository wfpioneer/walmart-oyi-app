import { cloneDeep } from 'lodash';
import {
  Actions,
  CLEAR_FILTER,
  RESET_APPROVALS,
  SET_APPROVAL_LIST,
  TOGGLE_ALL_ITEMS,
  TOGGLE_CATEGORIES,
  TOGGLE_CATEGORY,
  TOGGLE_ITEM,
  TOGGLE_SOURCES,
  UPDATE_FILTER_CATEGORIES,
  UPDATE_FILTER_SOURCES
} from '../actions/Approvals';
import { ApprovalCategory } from '../../models/ApprovalListItem';

type Category = {
  [key: number]: {
    checkedItemQty: number;
    totalItemQty: number;
  };
}
export interface ApprovalState {
  approvalList: Array<ApprovalCategory>;
  categories: Category;
  categoryIndices: Array<number>;
  selectedItemQty: number;
  isAllSelected: boolean;
  categoryOpen: boolean;
  sourceOpen: boolean;
  filterCategories: string[];
  filterSources: string[];
}
export const initialState: ApprovalState = {
  approvalList: [],
  categories: {},
  categoryIndices: [],
  selectedItemQty: 0,
  isAllSelected: false,
  categoryOpen: false,
  sourceOpen: false,
  filterCategories: [],
  filterSources: []
};

const isSelectedItemQty = (isSelected: boolean, selectedItemQty: number) => (isSelected
  ? selectedItemQty + 1 : selectedItemQty - 1);

const isSelectedItem = (isSelectedItemQuantity: boolean) => (isSelectedItemQuantity ? 1 : -1);

const isCheckedTotalCategoryQty = (checked: boolean, totalCategoryQty: number) => (checked ? totalCategoryQty : 0);

const filterCheckedListValidate = (filterCheckedList: ApprovalCategory[], newApprovalList: ApprovalCategory[],
  newCategories: Category) => {
  filterCheckedList.forEach(checkedItem => {
    const checkedIdx = newApprovalList.findIndex(item => item.itemNbr === checkedItem.itemNbr);
    if (checkedIdx !== -1) {
      const catg = newCategories[checkedItem.categoryNbr];

      newApprovalList[checkedIdx].isChecked = checkedItem.isChecked;
      catg.checkedItemQty += 1;
      // Set CategoryHeader to true if all items in category are selected
      if (catg.checkedItemQty === catg.totalItemQty) {
        const catHeaderIdx = newApprovalList.findIndex(item => item.categoryNbr === checkedItem.categoryNbr
          && item.categoryHeader);
        newApprovalList[catHeaderIdx].isChecked = true;
      }
    }
  });
};

export const Approvals = (
  state = initialState,
  action: Actions
): ApprovalState => {
  switch (action.type) {
    case SET_APPROVAL_LIST: {
      const newApprovalList = action.payload.approvals;
      const newCategories: Category = {};

      newApprovalList.forEach((item: ApprovalCategory) => {
        if (item.categoryHeader) {
          newCategories[item.categoryNbr] = {
            checkedItemQty: 0,
            totalItemQty: newApprovalList.filter((list: ApprovalCategory) => list.categoryNbr === item.categoryNbr)
              .length - 1
          };
        }
      });

      let selectedQty = 0;
      // Maintains the State of previously selected items on page refresh
      if (state.approvalList.length !== 0) {
        const filterCheckedList = state.approvalList.filter(item => (item.isChecked === true && !item.categoryHeader));
        selectedQty = filterCheckedList.length;
        filterCheckedListValidate(filterCheckedList, newApprovalList, newCategories);
      }
      return {
        ...state,
        approvalList: newApprovalList,
        categories: newCategories,
        categoryIndices: action.payload.headerIndices,
        selectedItemQty: selectedQty,
        isAllSelected: newApprovalList.every(item => item.isChecked)
      };
    }
    case TOGGLE_ALL_ITEMS: {
      const {
        approvalList, categories, filterCategories, filterSources, selectedItemQty
      } = state;
      const isChecked = action.payload.selectAll;

      const catgMap: Map<string, {checkedItemQty: number; totalItemQty: number;}> = new Map(Object.entries(categories));
      let updatedSelectedItemQty = selectedItemQty;

      const toggledItems: ApprovalCategory[] = approvalList.map(item => {
        const isFilteredCatg = filterCategories.length === 0
        || filterCategories.indexOf(`${item.categoryNbr} - ${item.categoryDescription}`) !== -1;
        const isFilteredSource = filterSources.length === 0 || filterSources.indexOf(item.approvalRequestSource) !== -1;

        if ((isFilteredCatg && isFilteredSource) || item.categoryHeader) {
          const updateToggledCatg = catgMap.get(item.categoryNbr.toString());

          if (updateToggledCatg && !item.categoryHeader) {
            if (!item.isChecked && isChecked) {
              updateToggledCatg.checkedItemQty += 1;
              updatedSelectedItemQty += 1;
            } else if (item.isChecked && !isChecked) {
              updateToggledCatg.checkedItemQty -= 1;
              updatedSelectedItemQty -= 1;
            }
          }

          return (item.categoryHeader && !isFilteredCatg) ? { ...item } : { ...item, isChecked };
        }
        return { ...item };
      });
      const toggledCategories: Category = Object.fromEntries(catgMap);

      return {
        ...state,
        approvalList: toggledItems,
        categories: toggledCategories,
        selectedItemQty: isChecked ? updatedSelectedItemQty : 0,
        isAllSelected: isChecked
      };
    }
    case TOGGLE_ITEM: {
      const { approvalList: currApprovalList, selectedItemQty, categories } = state;
      const { isSelected, itemNbr } = action.payload;
      const itemIdx = currApprovalList.findIndex(item => item.itemNbr === itemNbr);
      const toggledItem = currApprovalList[itemIdx];
      // Creates a new array and updates an item at that index
      const updatedArr = [
        ...currApprovalList.slice(0, itemIdx),
        { ...toggledItem, isChecked: isSelected },
        ...currApprovalList.slice(itemIdx + 1)];

      const newSelectedQty = isSelectedItemQty(isSelected, selectedItemQty);

      // Deep Clone Categories Object
      const clonedCategories = cloneDeep(categories);
      const updatedCategory = clonedCategories[toggledItem.categoryNbr];
      updatedCategory.checkedItemQty += isSelectedItem(isSelected);

      // Updates category header for items with that category
      const headerIdx = updatedArr.findIndex(item => item.categoryNbr === toggledItem.categoryNbr
        && item.categoryHeader);

      updatedArr[headerIdx].isChecked = updatedCategory.checkedItemQty === updatedCategory.totalItemQty;

      const isAllChecked = updatedArr.every(item => item.isChecked);

      return {
        ...state,
        approvalList: updatedArr,
        categories: clonedCategories,
        selectedItemQty: newSelectedQty,
        isAllSelected: isAllChecked
      };
    }
    case TOGGLE_CATEGORY: {
      const {
        approvalList: currList, categories: currCategories, selectedItemQty: currCheckedQty, filterSources
      } = state;
      const { categoryNbr, isSelected: checked } = action.payload;

      // Deep Clone Categories Object
      const updatedCategories = cloneDeep(currCategories);
      const updatedItemCat: ApprovalCategory[] = [...currList];
      let selectedQtyToAdd = currCheckedQty;
      let updateCheckedQty = 0;

      updatedItemCat.forEach((item, index) => {
        const isItemSource = filterSources.indexOf(item.approvalRequestSource) !== -1 || filterSources.length === 0;
        // Possibly refactor to make this look nicer
        if (item.categoryNbr === categoryNbr) {
          if (isItemSource || item.categoryHeader) {
            if (!item.categoryHeader) {
              if (!item.isChecked && checked) {
                selectedQtyToAdd += 1;
                updateCheckedQty += 1;
              } else if (item.isChecked && !checked) {
                selectedQtyToAdd -= 1;
                updateCheckedQty -= 1;
              }
            }
            updatedItemCat[index].isChecked = checked;
          }
        }
      });

      updatedCategories[categoryNbr].checkedItemQty = isCheckedTotalCategoryQty(checked, updateCheckedQty);

      return {
        ...state,
        approvalList: updatedItemCat,
        categories: updatedCategories,
        selectedItemQty: selectedQtyToAdd,
        isAllSelected: updatedItemCat.every(item => item.isChecked === true)
      };
    }
    case RESET_APPROVALS: {
      return initialState;
    }
    case TOGGLE_CATEGORIES:
      return {
        ...state,
        categoryOpen: action.payload
      };
    case TOGGLE_SOURCES:
      return {
        ...state,
        sourceOpen: action.payload
      };
    case UPDATE_FILTER_CATEGORIES:
      return {
        ...state,
        filterCategories: action.payload
      };
    case UPDATE_FILTER_SOURCES:
      return {
        ...state,
        filterSources: action.payload
      };
    case CLEAR_FILTER:
      return {
        ...state,
        filterCategories: [],
        filterSources: []
      };
    default:
      return state;
  }
};
