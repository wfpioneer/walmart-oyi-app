import {
  CLEAR_FILTER,
  TOGGLE_CATEGORIES,
  TOGGLE_EXCEPTIONS,
  TOGGLE_MENU,
  UPDATE_FILTER_CATEGORIES,
  UPDATE_FILTER_EXCEPTIONS
} from '../actions/Worklist';

const initialState = {
  menuOpen: false,
  categoryOpen: false,
  exceptionOpen: false,
  filterCategories: [],
  filterExceptions: []
};

export const worklist = (state = initialState, action: any) => {
  switch (action.type) {
    case TOGGLE_MENU:
      return {
        ...state,
        menuOpen: action.payload
      };
    case TOGGLE_CATEGORIES:
      return {
        ...state,
        categoryOpen: action.payload
      };
    case TOGGLE_EXCEPTIONS:
      return {
        ...state,
        exceptionOpen: action.payload
      };
    case UPDATE_FILTER_CATEGORIES:
      return {
        ...state,
        filterCategories: action.payload
      };
    case UPDATE_FILTER_EXCEPTIONS:
      return {
        ...state,
        filterExceptions: action.payload
      };
    case CLEAR_FILTER:
      return {
        ...state,
        filterCategories: [],
        filterExceptions: []
      };
    default:
      return state;
  }
};
