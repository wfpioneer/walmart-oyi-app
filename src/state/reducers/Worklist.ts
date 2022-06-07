import {
  Actions,
  CLEAR_FILTER,
  TOGGLE_AREA,
  TOGGLE_CATEGORIES,
  TOGGLE_EXCEPTIONS,
  TOGGLE_MENU,
  UPDATE_FILTER_CATEGORIES,
  UPDATE_FILTER_EXCEPTIONS
} from '../actions/Worklist';

export interface WorklistState {
  menuOpen: boolean;
  categoryOpen: boolean;
  exceptionOpen: boolean;
  areaOpen: boolean;
  filterCategories: string[];
  filterExceptions: string[];
}

export const initialState: WorklistState = {
  menuOpen: false,
  categoryOpen: false,
  exceptionOpen: false,
  areaOpen: false,
  filterCategories: [],
  filterExceptions: []
};

export const worklist = (state = initialState, action: Actions) => {
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
    case TOGGLE_AREA:
      return {
        ...state,
        areaOpen: action.payload
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
