import { Actions, SHOW_MANAGE_PALLET_MENU } from '../actions/PalletManagement';

interface PalletManagementState {
  managePalletMenu: boolean;
  palletInfo: {
    palletId: number;
    expirationDate: string;
  }
  items: {
    itemDesc: string;
    price: number;

  }
}

const initialState: PalletManagementState = {
  managePalletMenu: false
};

export const PalletManagement = (state = initialState, action: Actions): PalletManagementState => {
  switch (action.type) {
    case SHOW_MANAGE_PALLET_MENU:
      return {
        ...state,
        managePalletMenu: action.payload
      };
    default:
      return {
        ...state
      };
  }
};