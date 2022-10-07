import { ItemPalletInfo } from '../../models/AuditItem';
import ItemDetails from '../../models/ItemDetails';
import Location from '../../models/Location';
import {
  Actions,
  CLEAR_AUDIT_SCREEN_DATA,
  SET_FLOOR_LOCATIONS,
  SET_ITEM_DETAILS,
  SET_RESERVE_LOCATIONS
} from '../actions/AuditItemScreen';

export interface AuditItemScreenState {
   itemDetails: ItemDetails | null,
   floorLocations: Location[],
   reserveLocations: ItemPalletInfo[]
}

export const initialState: AuditItemScreenState = {
  itemDetails: null,
  floorLocations: [],
  reserveLocations: []
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
    case CLEAR_AUDIT_SCREEN_DATA:
      return initialState;
    default:
      return state;
  }
};
