import { ItemPalletInfo } from '../../models/AuditItem';
import ItemDetails from '../../models/ItemDetails';
import {
  Actions,
  CLEAR_RESERVE_ADJUSTMENT_SCREEN_DATA,
  SET_ITEM_DETAILS,
  SET_RESERVE_LOCATIONS,
  SET_SCANNED_PALLET_ID,
  UPDATE_PALLET_QTY,
  UPDATE_SCANNED_PALLET_STATUS
} from '../actions/ReserveAdjustmentScreen';

export interface ReserveAdjustmentScreenState {
  itemDetails: ItemDetails | null;
  reserveLocations: ItemPalletInfo[];
  scannedPalletId: number;
}

export const initialState: ReserveAdjustmentScreenState = {
  itemDetails: null,
  reserveLocations: [],
  scannedPalletId: 0
};

export const ReserveAdjustmentScreen = (
  state = initialState,
  action: Actions
): ReserveAdjustmentScreenState => {
  switch (action.type) {
    case SET_ITEM_DETAILS:
      return {
        ...state,
        itemDetails: action.payload
      };
    case SET_RESERVE_LOCATIONS:
      return {
        ...state,
        reserveLocations: action.payload
      };
    case SET_SCANNED_PALLET_ID:
      return {
        ...state,
        scannedPalletId: action.payload
      };
    case UPDATE_PALLET_QTY: {
      const { reserveLocations } = state;
      const { palletId, newQty } = action.payload;
      const updatedLocations = reserveLocations.map(loc => {
        if (loc.palletId === palletId) {
          return { ...loc, newQty };
        }
        return loc;
      });
      return { ...state, reserveLocations: updatedLocations };
    }
    case UPDATE_SCANNED_PALLET_STATUS: {
      const { reserveLocations } = state;
      const { palletId, scanned } = action.payload;
      const updateReserveLocations = reserveLocations.map(loc => {
        if (loc.palletId === palletId) {
          return { ...loc, scanned };
        }
        return loc;
      });
      return { ...state, reserveLocations: updateReserveLocations };
    }
    case CLEAR_RESERVE_ADJUSTMENT_SCREEN_DATA:
      return initialState;
    default:
      return state;
  }
};
