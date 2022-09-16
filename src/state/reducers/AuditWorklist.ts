import { WorklistItemI } from '../../models/WorklistItem';
import {
  Actions,
  CLEAR_WORKLIST_ITEMS,
  SET_WORKLIST_ITEMS
} from '../actions/AuditWorklist';

export interface AuditWorklistState {
   items: WorklistItemI[]
}

export const initialState: AuditWorklistState = {
  items: []
};

export const AuditWorklist = (state = initialState, action: Actions) => {
  switch (action.type) {
    case SET_WORKLIST_ITEMS:
      return {
        ...state,
        items: action.payload
      };
    case CLEAR_WORKLIST_ITEMS:
      return initialState;
    default:
      return state;
  }
};
