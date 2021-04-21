import { ApprovalListItem } from '../../models/ApprovalListItem';

export const SET_APPROVAL_LIST = 'APPROVAL/SET_APPROVAL_LIST';
export const TOGGLE_ALL_ITEMS = 'APPROVAL/TOGGLE_ALL_ITEMS';
export const TOGGLE_ITEM = 'APPROVAL/TOGGLE_ITEM';
export const setApprovalList = (approvals: ApprovalListItem[], headerIndices: number[]) => ({
  type: SET_APPROVAL_LIST,
  payload: {
    approvals,
    headerIndices
  }
});

export const toggleAllItems = (selectAll: boolean) => ({
  type: TOGGLE_ALL_ITEMS,
  payload: {
    selectAll
  }
});

export const toggleItem = (itemNbr: number, isSelected: boolean) => ({
  type: TOGGLE_ITEM,
  payload: {
    itemNbr,
    isSelected
  }
})
