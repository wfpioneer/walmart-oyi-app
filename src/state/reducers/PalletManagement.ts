import {
  ADD_COMBINE_PALLET,
  Actions,
  CLEAR_COMBINE_PALLET,
  CLEAR_PALLET_MANAGEMENT,
  SETUP_PALLET,
  SHOW_MANAGE_PALLET_MENU
} from '../actions/PalletManagement';
import { CombinePallet, PalletInfo, PalletItem } from '../../models/PalletManagementTypes';

interface PalletManagementState {
  managePalletMenu: boolean;
  palletInfo: PalletInfo
  items: PalletItem[];
  combinePallets: CombinePallet[]
}

const initialState: PalletManagementState = {
  managePalletMenu: false,
  palletInfo: {
    id: 0
  },
  items: [],
  combinePallets: []
};

export const PalletManagement = (state = initialState, action: Actions): PalletManagementState => {
  switch (action.type) {
    case SHOW_MANAGE_PALLET_MENU:
      return {
        ...state,
        managePalletMenu: action.payload
      };
    case SETUP_PALLET:
      return {
        ...initialState,
        ...action.payload
      };
    case ADD_COMBINE_PALLET:
      return {
        ...state,
        combinePallets: [...state.combinePallets, action.payload]
      };
    case CLEAR_COMBINE_PALLET:
      return {
        ...state,
        combinePallets: []
      };
    case CLEAR_PALLET_MANAGEMENT:
      return initialState;
    default:
      return {
        ...state
      };
  }
};
