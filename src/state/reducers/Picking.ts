import { PickListItem } from '../../models/Picking.d';
import {
  Actions,
  DELETE_PICKS,
  INITIALIZE_PICKLIST,
  SELECT_PICKS,
  UPDATE_PICKS
} from '../actions/Picking';

export interface PickingState {
  pickList: PickListItem[];
  selectedPicks: number[];
}

const initialState: PickingState = {
  pickList: [],
  selectedPicks: []
};

export const Picking = (state = initialState, action: Actions): PickingState => {
  switch (action.type) {
    case INITIALIZE_PICKLIST:
      return {
        ...state,
        pickList: action.payload
      };
    case UPDATE_PICKS:
      return {
        ...state,
        pickList: state.pickList
          .filter(pick => !action.payload
            .reduce((ids: number[], updatedPick) => ids.concat([updatedPick.id]), [])
            .includes(pick.id))
          .concat(action.payload)
      };
    case SELECT_PICKS:
      return {
        ...state,
        selectedPicks: action.payload
      };
    case DELETE_PICKS:
      return {
        ...state,
        pickList: state.pickList.filter(pick => !action.payload.includes(pick.id))
      };
    default:
      return state;
  }
};
