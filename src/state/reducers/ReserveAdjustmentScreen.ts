import { ItemPalletInfo } from '../../models/AuditItem';
import ItemDetails from '../../models/ItemDetails';
import {
  Actions,
  CLEAR_RESERVE_ADJUSTMENT_SCREEN_DATA,
  SET_ITEM_DETAILS,
  SET_RESERVE_LOCATIONS,
  UPDATE_PALLET_QTY
} from '../actions/ReserveAdjustmentScreen';

export interface ReserveAdjustmentScreenState {
  itemDetails: ItemDetails | null;
  reserveLocations: ItemPalletInfo[];
}

export const initialState: ReserveAdjustmentScreenState = {
  itemDetails: null,
  reserveLocations: []
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
    case CLEAR_RESERVE_ADJUSTMENT_SCREEN_DATA:
      return initialState;
    default:
      return state;
  }
};
