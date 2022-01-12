import { PalletInfo, PalletItems } from '../../models/PalletItem';
import {
  Actions,
  SET_PALLET_INFO,
  SET_PALLET_ITEMS
} from '../actions/PalletManagement';

interface PalletManagementState {
  palletInfo: PalletInfo;
  items: PalletItems[];
}

const initialState: PalletManagementState = {
  palletInfo: {
    palletId: 0
  },
  items: []
};

export const PalletManagement = (
  state = initialState,
  action: Actions
): PalletManagementState => {
  switch (action.type) {
    case SET_PALLET_INFO: {
      return {
        ...state,
        palletInfo: action.payload
      };
    }
    case SET_PALLET_ITEMS: {
      return {
        ...state,
        items: action.payload
      };
    }
    default:
      return state;
  }
};
