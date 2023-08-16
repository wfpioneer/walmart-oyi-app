import {
  ADD_PALLET,
  Actions,
  CLEAR_BIN_LOCATION,
  CLEAR_PALLETS,
  DELETE_PALLET,
  SET_BIN_LOCATION,
  TOGGLE_BIN_MENU,
  TOGGLE_MULTI_BIN
} from '../actions/Binning';

import { BinningPallet } from '../../models/Binning';

export interface StateType {
  pallets: BinningPallet[];
  binLocation: number | string | null;
  enableMultiplePalletBin: boolean;
  showBinningMenu: boolean;
}

export const initialState: StateType = {
  pallets: [],
  binLocation: null,
  enableMultiplePalletBin: false,
  showBinningMenu: false
};

// eslint-disable-next-line default-param-last
export const Binning = (state = initialState, action: Actions): StateType => {
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
    case TOGGLE_MULTI_BIN:
      return {
        ...state,
        enableMultiplePalletBin: action.payload === undefined ? !state.enableMultiplePalletBin : action.payload
      };
    case TOGGLE_BIN_MENU:
      return {
        ...state,
        showBinningMenu: action.payload === undefined ? !state.showBinningMenu : action.payload
      };
    default:
      return state;
  }
};
