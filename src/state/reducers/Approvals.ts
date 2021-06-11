import { cloneDeep } from 'lodash';
import {
  Actions,
  RESET_APPROVALS, SET_APPROVAL_LIST, TOGGLE_ALL_ITEMS, TOGGLE_CATEGORY,
  TOGGLE_ITEM
} from '../actions/Approvals';
import { ApprovalCategory } from '../../models/ApprovalListItem';

type Category = {
  [key: number]: {
    checkedItemQty: number;
    totalItemQty: number;
  };
}
interface ApprovalState {
  approvalList: Array<ApprovalCategory>;
  categories: Category;
  categoryIndices: Array<number>;
  selectedItemQty: number;
  isAllSelected: boolean;
}
const initialState: ApprovalState = {
  approvalList: [],
  categories: {},
  categoryIndices: [],
  selectedItemQty: 0,
  isAllSelected: false
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
          checkedItemQty: isChecked ? categoryObj.totalItemQty : 0
        }]));

      return {
        ...state,
        approvalList: toggledItems,
        categories: toggledCategories,
        selectedItemQty: isChecked ? toggledItems.length - categoryIndices.length : 0,
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

      const newSelectedQty = isSelected ? selectedItemQty + 1 : selectedItemQty - 1;

      // Deep Clone Categories Object
      const clonedCategories = cloneDeep(categories);
      const updatedCategory = clonedCategories[toggledItem.categoryNbr];
      updatedCategory.checkedItemQty += isSelected ? 1 : -1;

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
            selectedQtyToAdd += !updatedItemCat[index].isChecked ? 1 : 0;
          }
          updatedItemCat[index].isChecked = checked;
        }
      });
      // Deep Clone Categories Object
      const updatedCategories = cloneDeep(currCategories);

      const totalCategoryQty = updatedCategories[categoryNbr].totalItemQty;
      updatedCategories[categoryNbr].checkedItemQty = checked ? totalCategoryQty : 0;

      return {
        ...state,
        approvalList: updatedItemCat,
        categories: updatedCategories,
        selectedItemQty: checked ? selectedQtyToAdd : currCheckedQty - totalCategoryQty,
        isAllSelected: updatedItemCat.every(item => item.isChecked === true)
      };
    }
    case RESET_APPROVALS: {
      return initialState;
    }
    default:
      return state;
  }
};
