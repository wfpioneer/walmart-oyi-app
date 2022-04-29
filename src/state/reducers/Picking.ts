import { PickListItem } from '../../models/Picking.d';
import {
  Actions,
  DELETE_PICKS,
  INITIALIZE_PICKLIST,
  RESET_PICKLIST,
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

export const Picking = (
  state = initialState,
  action: Actions
): PickingState => {
  switch (action.type) {
    case INITIALIZE_PICKLIST:
      return {
        ...state,
        pickList: action.payload
      };
    case UPDATE_PICKS: {
      const updatedPicklist = state.pickList.map(pick => {
        const newPick = action.payload.filter(
          payloadPick => pick.id === payloadPick.id
        )[0];
        if (newPick && pick.id === newPick.id) {
          return newPick;
        }
        return pick;
      });
      return {
        ...state,
        pickList: updatedPicklist
      };
    }
    case SELECT_PICKS:
      return {
        ...state,
        selectedPicks: action.payload
      };
    case DELETE_PICKS:
      return {
        ...state,
        pickList: state.pickList.filter(
          pick => !action.payload.includes(pick.id)
        )
      };
    case RESET_PICKLIST:
      return initialState;
    default:
      return state;
  }
};
