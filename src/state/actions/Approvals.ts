import { ApprovalListItem } from '../../models/ApprovalListItem';

export const SET_APPROVAL_LIST = 'APPROVAL/SET_APPROVAL_LIST';
export const TOGGLE_ALL_ITEMS = 'APPROVAL/TOGGLE_ALL_ITEMS';
export const TOGGLE_CATEGORY = 'APPROVAL/TOGGLE_CATEGORY';
export const TOGGLE_ITEM = 'APPROVAL/TOGGLE_ITEM';

export const setApprovalList = (approvals: ApprovalListItem[], headerIndices: number[]) => ({
  type: SET_APPROVAL_LIST,
  payload: {
    approvals,
    headerIndices
  }
} as const);

export const toggleAllItems = (selectAll: boolean) => ({
  type: TOGGLE_ALL_ITEMS,
  payload: {
    selectAll
  }
} as const);

export const toggleCategory = (categoryNbr: number, isSelected: boolean) => ({
  type: TOGGLE_CATEGORY,
  payload: {
    categoryNbr,
    isSelected
  }
} as const);

export const toggleItem = (itemNbr: number, isSelected: boolean) => ({
  type: TOGGLE_ITEM,
  payload: {
    itemNbr,
    isSelected
  }
} as const);

export type Actions =
  | ReturnType<typeof setApprovalList>
  | ReturnType<typeof toggleAllItems>
  | ReturnType<typeof toggleCategory>
  | ReturnType<typeof toggleItem>;
