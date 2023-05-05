import {ItemPalletInfo} from '../../models/AuditItem';
import ItemDetails from '../../models/ItemDetails';
import Location from '../../models/Location';
import {
  Actions,
  CLEAR_AUDIT_SCREEN_DATA,
  SET_APPROVAL_ITEM,
  SET_FLOOR_LOCATIONS,
  SET_ITEM_DETAILS,
  SET_RESERVE_LOCATIONS,
  SET_SCANNED_PALLET_ID,
  UPDATE_FLOOR_LOCATION_QTY,
  UPDATE_PALLET_QTY,
  UPDATE_SCANNED_PALLET_STATUS
} from '../actions/AuditItemScreen';
import {ApprovalListItem} from '../../models/ApprovalListItem';

export interface AuditItemScreenState {
  itemDetails: ItemDetails | null,
  floorLocations: Location[],
  reserveLocations: ItemPalletInfo[],
  scannedPalletId: number,
  approvalItem: ApprovalListItem | null
}

export const initialState: AuditItemScreenState = {
  itemDetails: null,
  floorLocations: [],
  reserveLocations: [],
  scannedPalletId: 0,
  approvalItem: null
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
      const { palletId, newQty } = action.payload;
      const updatedLocations = reserveLocations.map(loc => {
        if (loc.palletId === palletId) {
          return { ...loc, newQty };
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
    case CLEAR_AUDIT_SCREEN_DATA:
      return initialState;
    case SET_APPROVAL_ITEM:
      return { ...state, approvalItem: action.payload };
    default:
      return state;
  }
};
