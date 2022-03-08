export const TOGGLE_MENU = 'WORKLIST_FILTER/TOGGLE_MENU';
export const TOGGLE_CATEGORIES = 'WORKLIST_FILTER/TOGGLE_CATEGORIES';
export const TOGGLE_EXCEPTIONS = 'WORKLIST_FILTER/TOGGLE_EXCEPTIONS';
export const UPDATE_FILTER_CATEGORIES = 'WORKLIST_FILTER/UPDATE_FILTER_CATEGORIES';
export const UPDATE_FILTER_EXCEPTIONS = 'WORKLIST_FILTER/UPDATE_FILTER_EXCEPTIONS';
export const CLEAR_FILTER = 'WORKLIST_FILTER/CLEAR_FILTER';

export const toggleMenu = (menuOpen: boolean) => ({
  type: TOGGLE_MENU,
  payload: menuOpen
} as const);

export const toggleCategories = (categoriesOpen: boolean) => ({
  type: TOGGLE_CATEGORIES,
  payload: categoriesOpen
} as const);

export const toggleExceptions = (exceptionsOpen: boolean) => ({
  type: TOGGLE_EXCEPTIONS,
  payload: exceptionsOpen
} as const);

export const updateFilterCategories = (filterCategories: string[]) => ({
  type: UPDATE_FILTER_CATEGORIES,
  payload: filterCategories
} as const);

export const updateFilterExceptions = (filterExceptions: string[]) => ({
  type: UPDATE_FILTER_EXCEPTIONS,
  payload: filterExceptions
} as const);

export const clearFilter = () => ({
  type: CLEAR_FILTER
} as const);

export type Actions =
  | ReturnType<typeof toggleMenu>
  | ReturnType<typeof toggleCategories>
  | ReturnType<typeof toggleExceptions>
  | ReturnType<typeof updateFilterCategories>
  | ReturnType<typeof updateFilterExceptions>
  | ReturnType<typeof clearFilter>;
