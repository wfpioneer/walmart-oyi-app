import {
  ADD_PALLET,
  Actions,
  CLEAR_BIN_LOCATION,
  CLEAR_PALLETS,
  DELETE_PALLET,
  SET_BIN_LOCATION
} from '../actions/Binning';

import { BinningPallet } from '../../models/Binning';

export interface StateType {
  pallets: BinningPallet[];
  binLocation: number | string | null;
}

const initialState: StateType = {
  pallets: [],
  binLocation: null
};

export const Binning = (state = initialState, action: Actions) => {
  switch (action.type) {
    case ADD_PALLET:
      return {
        ...state,
        pallets: [...state.pallets, action.payload]
      };
    case DELETE_PALLET:
      return {
        ...state,
        pallets: state.pallets.filter(pallet => pallet.id !== action.payload)
      };
    case CLEAR_PALLETS:
      return {
        ...state,
        pallets: []
      };
    case SET_BIN_LOCATION:
      return {
        ...state,
        binLocation: action.payload
      };
    case CLEAR_BIN_LOCATION:
      return {
        ...state,
        binLocation: null
      };
    default:
      return state;
  }
};
