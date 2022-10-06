import { ItemPalletInfo } from '../../models/AuditItem';
import ItemDetails from '../../models/ItemDetails';
import Location from '../../models/Location';
import {
  Actions,
  CLEAR_AUDIT_SCREEN_DATA,
  SET_FLOOR_LOCATIONS,
  SET_ITEM_DETAILS,
  SET_RESERVE_LOCATIONS,
  SET_SCANNED_PALLET_ID,
  UPDATE_PALLET_QTY
} from '../actions/AuditItemScreen';

export interface AuditItemScreenState {
   itemDetails: ItemDetails | null,
   floorLocations: Location[],
   reserveLocations: ItemPalletInfo[],
   scannedPalletId: string
}

export const initialState: AuditItemScreenState = {
  itemDetails: null,
  floorLocations: [],
  reserveLocations: [],
  scannedPalletId: ''
};

export const AuditItemScreen = (state = initialState, action: Actions) : AuditItemScreenState => {
  switch (action.type) {
    case SET_ITEM_DETAILS:
      return {
        ...state,
        itemDetails: action.payload
      };
    case SET_FLOOR_LOCATIONS:
      return {
        ...state,
        floorLocations: action.payload
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
          return { ...loc, newQty, scanned: true };
        }
        return loc;
      });
      return { ...state, reserveLocations: updatedLocations };
    }
    case CLEAR_AUDIT_SCREEN_DATA:
      return initialState;
    default:
      return state;
  }
};
