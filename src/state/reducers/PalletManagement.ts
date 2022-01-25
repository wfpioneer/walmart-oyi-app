import {
  ADD_COMBINE_PALLET,
  ADD_PALLET,
  Actions,
  CLEAR_COMBINE_PALLET,
  CLEAR_PALLET_MANAGEMENT,
  DELETE_ITEM,
  REMOVE_COMBINE_PALLET,
  RESET_PALLET,
  SETUP_PALLET,
  SET_ITEM_NEW_QUANTITY,
  SET_ITEM_QUANTITY,
  SHOW_MANAGE_PALLET_MENU,
  UPDATE_PALLET
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
    case REMOVE_COMBINE_PALLET: {
      const deleteIndex = state.combinePallets.findIndex(item => item.palletId === action.payload);
      const updatedPallets = [
        ...state.combinePallets.slice(0, deleteIndex),
        ...state.combinePallets.slice(deleteIndex + 1)
      ];
      return {
        ...state,
        combinePallets: updatedPallets
      }; }
    case ADD_PALLET:
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    case RESET_PALLET: {
      const resetItems = state.items.map(item => {
        item.deleted = false;
        return item;
      });
      return {
        ...state,
        items: resetItems
      };
    }
    case DELETE_ITEM: {
      const updatedItems = state.items.map(item => {
        if (item.itemNbr.toString() === action.payload.itemNbr) {
          item.deleted = true;
          return item;
        }
        return item;
      });
      return {
        ...state,
        items: updatedItems
      };
    }
    case UPDATE_PALLET:
      return {
        ...state,
        items: [...action.payload]
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
