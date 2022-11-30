import { ApprovalCategory } from '../../models/ApprovalListItem';

export const SET_APPROVAL_LIST = 'APPROVAL/SET_APPROVAL_LIST';
export const TOGGLE_ALL_ITEMS = 'APPROVAL/TOGGLE_ALL_ITEMS';
export const TOGGLE_CATEGORY = 'APPROVAL/TOGGLE_CATEGORY';
export const TOGGLE_ITEM = 'APPROVAL/TOGGLE_ITEM';
export const RESET_APPROVALS = 'APPROVAL/RESET_APPROVALS';
export const UPDATE_APPROVAL_FILTER_CATEGORIES = 'APPROVAL/UPDATE_APPROVAL_FILTER_CATEGORIES';
export const CLEAR_APPROVAL_FILTER = 'APPROVAL/CLEAR_APPROVAL_FILTER';
export const TOGGLE_FILTER_CATEGORIES = 'APPROVAL/TOGGLE_FILTER_CATEGORIES';
export const TOGGLE_FILTER_MENU = 'APPROVAL/TOGGLE_FILTER_MENU';
// DOUBLE CHECK
export const TOGGLE_CATEGORIES = 'APPROVAL/TOGGLE_CATEGORIES';
export const TOGGLE_SOURCES = 'APPROVAL/TOGGLE_SOURCES';
export const UPDATE_FILTER_CATEGORIES = 'APPROVAL/UPDATE_FILTER_CATEGORIES';
export const UPDATE_FILTER_SOURCES = 'APPROVAL/UPDATE_FILTER_SOURCES';
export const CLEAR_FILTER = 'APPROVAL/CLEAR_FILTER';

export const setApprovalList = (approvals: ApprovalCategory[], headerIndices: number[]) => ({
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

export const resetApprovals = () => ({
  type: RESET_APPROVALS
} as const);

export const updateApprovalFilterCategories = (filterCategories: string[]) => ({
  type: UPDATE_APPROVAL_FILTER_CATEGORIES,
  payload: filterCategories
} as const);

export const toggleFilterCategories = (categoriesOpen: boolean) => ({
  type: TOGGLE_FILTER_CATEGORIES,
  payload: categoriesOpen
} as const);

export const clearApprovalFilter = () => ({
  type: CLEAR_APPROVAL_FILTER
} as const);

export const toggleFilterMenu = (menuOpen: boolean) => ({
  type: TOGGLE_FILTER_MENU,
  payload: menuOpen
} as const);
// Double check
export const toggleCategories = (categoriesOpen: boolean) => ({
  type: TOGGLE_CATEGORIES,
  payload: categoriesOpen
} as const);

export const toggleSources = (sourcesOpen: boolean) => ({
  type: TOGGLE_SOURCES,
  payload: sourcesOpen
} as const);

export const updateFilterCategories = (filterCategories: string[]) => ({
  type: UPDATE_FILTER_CATEGORIES,
  payload: filterCategories
} as const);

export const updateFilterSources = (filterSources: string[]) => ({
  type: UPDATE_FILTER_SOURCES,
  payload: filterSources
} as const);

export const clearFilter = () => ({
  type: CLEAR_FILTER
} as const);

export type Actions =
  | ReturnType<typeof setApprovalList>
  | ReturnType<typeof toggleAllItems>
  | ReturnType<typeof toggleCategory>
  | ReturnType<typeof toggleItem>
  | ReturnType<typeof resetApprovals>
  | ReturnType<typeof updateApprovalFilterCategories> // here
  | ReturnType<typeof clearApprovalFilter>
  | ReturnType<typeof toggleFilterCategories>
  | ReturnType<typeof toggleFilterMenu> // to here
  | ReturnType<typeof toggleCategories>
  | ReturnType<typeof toggleSources>
  | ReturnType<typeof updateFilterCategories>
  | ReturnType<typeof updateFilterSources>
  | ReturnType<typeof clearFilter>;
