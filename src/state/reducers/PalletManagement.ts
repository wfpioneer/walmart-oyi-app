import {
  Actions,
  CLEAR_PALLET_MANAGEMENT,
  SETUP_PALLET,
  SET_ITEM_NEW_QUANTITY,
  SHOW_MANAGE_PALLET_MENU,
  TOGGLE_PALLET_MANAGEMENT_POPUP
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
  items: [
    {
      added: false,
      deleted: false,
      itemDesc: 'food',
      itemNbr: '1234',
      price: 2.34,
      quantity: 3,
      upcNbr: '9876543212345'
    }
  ],
  combinePallets: []
};

export const PalletManagement = (state = initialState, action: Actions): PalletManagementState => {
  switch (action.type) {
    case SHOW_MANAGE_PALLET_MENU:
      return {
        ...state,
        managePalletMenu: action.payload
      };
    case TOGGLE_PALLET_MANAGEMENT_POPUP:
      return {
        ...state,
        managePalletMenu: !state.managePalletMenu
      };
    case SETUP_PALLET:
      return {
        ...initialState,
        ...action.payload
      };
    case CLEAR_PALLET_MANAGEMENT:
      return initialState;
    case SET_ITEM_NEW_QUANTITY: {
      const newItems = state.items.map(item => {
        if (item.itemNbr.toString() === action.payload.itemNbr) {
          item.newQuantity = action.payload.newQuantity;
          return item;
        }
        return item;
      });
      return {
        ...state,
        items: newItems
      };
    }
    default:
      return {
        ...state
      };
  }
};
