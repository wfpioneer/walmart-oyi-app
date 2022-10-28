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
  UPDATE_FLOOR_LOCATION_QTY,
  UPDATE_PALLET_QTY
} from '../actions/AuditItemScreen';

export interface AuditItemScreenState {
   itemDetails: ItemDetails | null,
   floorLocations: Location[],
   reserveLocations: ItemPalletInfo[],
   scannedPalletId: number
}

export const initialState: AuditItemScreenState = {
  itemDetails: null,
  floorLocations: [],
  reserveLocations: [],
  scannedPalletId: 0
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
        floorLocations: action.payload.map((loc: Location) => ({
          ...loc,
          locationName: `${loc.zoneName}${loc.aisleName}-${loc.sectionName}`
        }))
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
      const { palletId, newQty, scanned } = action.payload;
      const updatedLocations = reserveLocations.map(loc => {
        if (loc.palletId === palletId) {
          return { ...loc, newQty, scanned };
        }
        return loc;
      });
      return { ...state, reserveLocations: updatedLocations };
    }
    case UPDATE_FLOOR_LOCATION_QTY: {
      const { floorLocations } = state;
      const { locationName, newQty } = action.payload;
      const updatedLocations = floorLocations.map(loc => {
        if (loc.locationName === locationName) {
          return { ...loc, newQty };
        }
        return loc;
      });
      return { ...state, floorLocations: updatedLocations };
    }
    case CLEAR_AUDIT_SCREEN_DATA:
      return initialState;
    default:
      return state;
  }
};
