import { Tabs } from '../../models/PalletWorklist';
import {
  Actions,
  CLEAR_SELECTED_PALLET_WORKLIST_ID,
  SET_SELECTED_TAB,
  SET_SELECTED_WORKLIST_PALLET_ID
} from '../actions/PalletWorklist';

export interface PalletWorklistState {
   selectedTab: Tabs;
   selectedWorklistPalletId: string
  }

export const initialState: PalletWorklistState = {
  selectedTab: Tabs.TODO,
  selectedWorklistPalletId: ''
};

export const PalletWorklist = (state = initialState, action: Actions) => {
  switch (action.type) {
    case SET_SELECTED_WORKLIST_PALLET_ID:
      return {
        ...state,
        selectedWorklistPalletId: action.payload
      };
    case SET_SELECTED_TAB:
      return {
        ...state,
        selectedTab: action.payload
      };
    case CLEAR_SELECTED_PALLET_WORKLIST_ID:
      return {
        ...state,
        selectedWorklistPalletId: ''
      };
    default:
      return state;
  }
};
