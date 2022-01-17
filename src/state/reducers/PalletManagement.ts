import { PalletInfo, PalletItem } from '../../models/PalletManagementTypes';
import {
  Actions,
  CLEAR_PALLET_MANAGEMENT,
  SETUP_PALLET
} from '../actions/PalletManagement';

interface PalletManagementState {
  palletInfo: PalletInfo;
  items: PalletItem[];
}

const initialState: PalletManagementState = {
  palletInfo: {
    createDate: '',
    expirationDate: '',
    id: 0
  },
  items: []
};

export const PalletManagement = (
  state = initialState,
  action: Actions
): PalletManagementState => {
  switch (action.type) {
    case SETUP_PALLET: {
      return {
        ...initialState,
        ...action.payload
      };
    }
    case CLEAR_PALLET_MANAGEMENT:
      return initialState;
    default:
      return {
        ...state
      };
  }
};
