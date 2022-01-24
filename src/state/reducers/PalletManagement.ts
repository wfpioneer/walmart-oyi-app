import {
  ADD_PALLET,
  Actions,
  CLEAR_PALLET_MANAGEMENT,
  SETUP_PALLET,
  SET_ITEM_NEW_QUANTITY,
  SET_ITEM_QUANTITY,
  SHOW_MANAGE_PALLET_MENU,
  TOGGLE_PALLET_MANAGEMENT_POPUP
} from '../actions/PalletManagement';
import { CombinePallet, PalletInfo } from '../../models/PalletManagementTypes';
import { PalletItem } from '../../models/PalletItem';

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
    case ADD_PALLET:
      return {
        ...state,
        items: [...state.items, action.payload]
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
    case SET_ITEM_QUANTITY: {
      const newItems = state.items.map(item => {
        if (item.itemNbr.toString() === action.payload.itemNbr && item.newQuantity) {
          item.quantity = item.newQuantity;
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
