import { ItemHistoryI } from '../../models/ItemDetails';
import {
  Actions,
  CLEAR_ITEM_HISTORY,
  SET_HISTORY
} from '../actions/ItemHistory';

export interface ItemHistoryState {
   data: ItemHistoryI[];
   title: string
  }

export const initialState: ItemHistoryState = {
  data: [],
  title: ''
};

export const ItemHistory = (state = initialState, action: Actions) => {
  switch (action.type) {
    case SET_HISTORY:
      return {
        ...state,
        data: action.payload.data,
        title: action.payload.title
      };
    case CLEAR_ITEM_HISTORY:
      return {
        ...state
      };
    default:
      return state;
  }
};
