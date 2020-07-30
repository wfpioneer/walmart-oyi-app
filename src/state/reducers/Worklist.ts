import {
  TOGGLE_MENU,
  TOGGLE_CATEGORIES,
  TOGGLE_EXCEPTIONS,
  UPDATE_FILTER_CATEGORIES,
  UPDATE_FILTER_EXCEPTIONS,
  CLEAR_FILTER
} from "../actions/Worklist";

const initialState = {
  menuOpen: false,
  categoryOpen: false,
  exceptionOpen: false,
  data: [
    {
      exceptionType: 'No sales floor location',
      itemName: 'Hotel Premier Collection King Pillow by Member\'s Mark (2 pk.)',
      itemNbr: 980145693,
      upcNbr: '123456789012',
      catgNbr: 21,
      catgName: 'DOMESTICS',
      isCompleted: false
    },
    {
      exceptionType: 'No sales floor location',
      itemName: 'Member\'s Mark Parmesan Crisps (9.5oz)',
      itemNbr: 980039376,
      upcNbr: '123456789012',
      catgNbr: 46,
      catgName: 'CAN PROTEIN - CONDIMENTS - PASTA',
      isCompleted: false
    },
    {
      exceptionType: 'No sales floor location',
      itemName: 'Dole 100% Pineapple Juice (8.4oz / 24pk)',
      itemNbr: 464033,
      upcNbr: '123456789012',
      catgNbr: 40,
      catgName: 'JUICE - WATER - SPORTS DRINKS',
      isCompleted: true
    },
    {
      exceptionType: 'No sales floor location',
      itemName: 'Member\'s Mark Parmesan Crisps (9.5oz)',
      itemNbr: 980039378,
      upcNbr: '123456789012',
      catgNbr: 46,
      catgName: 'CAN PROTEIN - CONDIMENTS - PASTA',
      isCompleted: true
    }
  ],
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
      }
    case UPDATE_FILTER_CATEGORIES:
      return {
        ...state,
        filterCategories: action.payload
      }
    case UPDATE_FILTER_EXCEPTIONS:
      return {
        ...state,
        filterExceptions: action.payload
      }
    case CLEAR_FILTER:
      return {
        ...state,
        filterCategories: [],
        filterExceptions: []
      }
    default:
      return state;
  }
};
