export const TOGGLE_MENU = 'WORKLIST_FILTER/TOGGLE_MENU';
export const TOGGLE_CATEGORIES = 'WORKLIST_FILTER/TOGGLE_CATEGORIES';
export const TOGGLE_EXCEPTIONS = 'WORKLIST_FILTER/TOGGLE_EXCEPTIONS';
export const UPDATE_FILTER_CATEGORIES = 'WORKLIST_FILTER/UPDATE_FILTER_CATEGORIES';
export const UPDATE_FILTER_EXCEPTIONS = 'WORKLIST_FILTER/UPDATE_FILTER_EXCEPTIONS';
export const CLEAR_FILTER = 'WORKLIST_FILTER/CLEAR_FILTER';

export const toggleMenu = (menuOpen: boolean) => ({
  type: TOGGLE_MENU,
  payload: menuOpen
});

export const toggleCategories = (categoriesOpen: boolean) => ({
  type: TOGGLE_CATEGORIES,
  payload: categoriesOpen
});

export const toggleExceptions = (exceptionsOpen: boolean) => ({
  type: TOGGLE_EXCEPTIONS,
  payload: exceptionsOpen
});

export const updateFilterCategories = (filterCategories: string[]) => ({
  type: UPDATE_FILTER_CATEGORIES,
  payload: filterCategories
});

export const updateFilterExceptions = (filterExceptions: string[]) => ({
  type: UPDATE_FILTER_EXCEPTIONS,
  payload: filterExceptions
});

export const clearFilter = () => ({
  type: CLEAR_FILTER
});
