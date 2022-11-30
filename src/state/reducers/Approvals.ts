import { cloneDeep } from 'lodash';
import {
  Actions,
  CLEAR_APPROVAL_FILTER,
  CLEAR_FILTER,
  RESET_APPROVALS,
  SET_APPROVAL_LIST,
  TOGGLE_ALL_ITEMS,
  TOGGLE_CATEGORIES, TOGGLE_CATEGORY, TOGGLE_FILTER_CATEGORIES, TOGGLE_FILTER_MENU, TOGGLE_ITEM,
  TOGGLE_SOURCES,
  UPDATE_APPROVAL_FILTER_CATEGORIES,
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
  menuOpen: boolean; // HERE
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
  menuOpen: false, // here
  categoryOpen: false,
  sourceOpen: false,
  filterCategories: [],
  filterSources: []
};
const isCheckedElseTotalItemQty = (isChecked: boolean, categoryObj: {
  checkedItemQty: number;
  totalItemQty: number;
}) => (isChecked ? categoryObj.totalItemQty : 0);

const isCheckedElseToggledItems = (isChecked: boolean,
  toggledItems: ApprovalCategory[], categoryIndices: number[]) => (isChecked
  ? toggledItems.length - categoryIndices.length : 0);

const isSelectedItemQty = (isSelected: boolean, selectedItemQty: number) => (isSelected
  ? selectedItemQty + 1 : selectedItemQty - 1);

const isSelectedItem = (isSelectedItemQuantity: boolean) => (isSelectedItemQuantity ? 1 : -1);

const isCheckedTotalCategoryQty = (checked: boolean, totalCategoryQty: number) => (checked ? totalCategoryQty : 0);

const isCheckedSelectedItemQty = (checked: boolean, selectedQtyToAdd: number,
  currCheckedQty: number, totalCategoryQty: number) => (checked
  ? selectedQtyToAdd : currCheckedQty - totalCategoryQty);

const isCheckedSelectedQtyToAdd = (updatedItemCat: ApprovalCategory[],
  index: number) => (!updatedItemCat[index].isChecked
  ? 1 : 0);

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
      const { approvalList, categoryIndices, categories } = state;
      const isChecked = action.payload.selectAll;
      const toggledItems: ApprovalCategory[] = approvalList.map(item => (
        { ...item, isChecked }));

      // iterates over the checkedItemQty for the categories obj, then converts the array back into an Object
      const toggledCategories: Category = Object.fromEntries(Object.entries(categories)
        .map(([catNbr, categoryObj]) => [catNbr, {
          ...categoryObj,
          checkedItemQty: isCheckedElseTotalItemQty(isChecked, categoryObj)
        }]));

      return {
        ...state,
        approvalList: toggledItems,
        categories: toggledCategories,
        selectedItemQty: isCheckedElseToggledItems(isChecked, toggledItems, categoryIndices),
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
      const { approvalList: currList, categories: currCategories, selectedItemQty: currCheckedQty } = state;
      const { categoryNbr, isSelected: checked } = action.payload;

      const updatedItemCat: ApprovalCategory[] = [...currList];
      let selectedQtyToAdd = currCheckedQty;

      updatedItemCat.forEach((item, index) => {
        if (item.categoryNbr === categoryNbr) {
          if (!item.categoryHeader) {
            selectedQtyToAdd += isCheckedSelectedQtyToAdd(updatedItemCat, index);
          }
          updatedItemCat[index].isChecked = checked;
        }
      });
      // Deep Clone Categories Object
      const updatedCategories = cloneDeep(currCategories);

      const totalCategoryQty = updatedCategories[categoryNbr].totalItemQty;
      updatedCategories[categoryNbr].checkedItemQty = isCheckedTotalCategoryQty(checked, totalCategoryQty);

      return {
        ...state,
        approvalList: updatedItemCat,
        categories: updatedCategories,
        selectedItemQty: isCheckedSelectedItemQty(checked, selectedQtyToAdd, currCheckedQty, totalCategoryQty),
        isAllSelected: updatedItemCat.every(item => item.isChecked === true)
      };
    }
    case UPDATE_APPROVAL_FILTER_CATEGORIES: {
      return {
        ...state,
        filterCategories: action.payload
      };
    }
    case CLEAR_APPROVAL_FILTER: {
      return {
        ...state,
        filterCategories: []
      };
    }
    case TOGGLE_FILTER_CATEGORIES: {
      return {
        ...state,
        categoryOpen: action.payload
      };
    }
    case TOGGLE_FILTER_MENU: {
      return {
        ...state,
        menuOpen: action.payload
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
