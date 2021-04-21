import { SET_APPROVAL_LIST, TOGGLE_ALL_ITEMS, TOGGLE_ITEM } from '../actions/Approvals';
import { ApprovalCategory } from '../../screens/ApprovalList/ApprovalList';

interface ApprovalState {
  approvalList: Array<ApprovalCategory>;
  categoryIndices: Array<number>;
  selectedItemQty: number;
  isAllSelected: boolean;
}
const initialState: ApprovalState = {
  approvalList: [],
  categoryIndices: [],
  selectedItemQty: 0,
  isAllSelected: false
};

export const Approvals = (
  state = initialState,
  action: {type: string; payload: any}
): ApprovalState => {
  switch (action.type) {
    case SET_APPROVAL_LIST: {
      return {
        ...state,
        approvalList: action.payload.approvals,
        categoryIndices: action.payload.headerIndices,
        selectedItemQty: 0,
        isAllSelected: false
      };
    }
    case TOGGLE_ALL_ITEMS: {
      const { approvalList, categoryIndices } = state;
      const toggledItems: ApprovalCategory[] = approvalList.map(item => (
        { ...item, isChecked: action.payload.selectAll }));

      return {
        ...state,
        approvalList: toggledItems,
        selectedItemQty: action.payload.selectAll ? toggledItems.length - categoryIndices.length : 0,
        isAllSelected: action.payload.selectAll
      };
    }
    case TOGGLE_ITEM: {
      const { approvalList: currApprovalList, selectedItemQty } = state;
      const itemIndex = currApprovalList.findIndex(item => item.itemNbr === action.payload.itemNbr);
      // Creates a new array and updates an item at that index
      const updatedArr = [
        ...currApprovalList.slice(0, itemIndex),
        { ...currApprovalList[itemIndex], isChecked: action.payload.isSelected },
        ...currApprovalList.slice(itemIndex + 1)];

      const newSelectedQty = action.payload.isSelected ? selectedItemQty + 1 : selectedItemQty - 1;
      /* TODO If all items are checked in a category, set categorySelected to true
      else set categorySelected to false */
      const isAllChecked = updatedArr.every(item => item.isChecked === true);
      return {
        ...state,
        approvalList: updatedArr,
        selectedItemQty: newSelectedQty,
        isAllSelected: isAllChecked
      };
    }
    /* TODO Scenario toggle all items in category
        - Set select all to false
          - Set select all to true if this last group of items to be selected
    */
    default:
      return state;
  }
};
