import {
  Actions,
  HIDE_PALLET_MANAGEMENT_POPUP,
  SHOW_PALLET_MANAGEMENT_POPUP,
  TOGGLE_PALLET_MANAGEMENT_POPUP
} from '../actions/PalletManagement';

interface PalletManagementState {
  managePalletMenu: boolean;
  palletInfo: {
    palletId: number;
    expirationDate?: string;
  }
  items: {
    description: string;
    price: number;
    upc: string;
    itemNbr: string;
    category: number;
    categoryDesc: string;
    quantity: number;
    newQuantity: number;
    deleted: boolean;
    added: boolean;
  }[],
  combinePallets: {
    palletId: number;
    itemCount: number
  }[]
}

const initialState: PalletManagementState = {
  managePalletMenu: false,
  palletInfo: {
    palletId: 0,
    expirationDate: undefined
  },
  items: [],
  combinePallets: []
};

export const Pallets = (state = initialState, action: Actions): PalletManagementState => {
  switch (action.type) {
    case SHOW_PALLET_MANAGEMENT_POPUP:
      return {
        ...state,
        managePalletMenu: true
      };
    case HIDE_PALLET_MANAGEMENT_POPUP:
      return {
        ...state,
        managePalletMenu: false
      };
    case TOGGLE_PALLET_MANAGEMENT_POPUP:
      return {
        ...state,
        managePalletMenu: !state.managePalletMenu
      };
    default:
      return state;
  }
};
