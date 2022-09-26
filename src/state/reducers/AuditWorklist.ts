import { WorklistItemI } from '../../models/WorklistItem';
import {
  Actions,
  CLEAR_WORKLIST_ITEMS,
  SET_AUDIT_ITEM_NUMBER,
  SET_WORKLIST_ITEMS
} from '../actions/AuditWorklist';

export interface AuditWorklistState {
   items: WorklistItemI[],
   itemNumber: number
}

export const initialState: AuditWorklistState = {
  items: [],
  itemNumber: 0
};

export const AuditWorklist = (state = initialState, action: Actions) => {
  switch (action.type) {
    case SET_WORKLIST_ITEMS:
      return {
        ...state,
        items: action.payload
      };
    case SET_AUDIT_ITEM_NUMBER:
      return {
        ...state,
        itemNumber: action.payload
      };
    case CLEAR_WORKLIST_ITEMS:
      return initialState;
    default:
      return state;
  }
};
