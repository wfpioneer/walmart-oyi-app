import {
  ACTION_COMPLETED,
  Actions,
  CLEAR_SCREEN,
  CLEAR_SELECTED_LOCATION,
  DELETE_LOCATION_FROM_EXISTING,
  RESET_LOCATIONS,
  SETUP_SCREEN,
  SET_FLOOR_LOCATIONS,
  SET_ITEM_DETAILS,
  SET_RESERVE_LOCATIONS,
  SET_SELECTED_LOCATION, SET_UPC,
  UPDATE_PENDING_OH_QTY
} from '../actions/ItemDetailScreen';
import LocationType from '../../models/Location';
import ItemDetails from '../../models/ItemDetails';

export interface ItemDetailsState {
  itemNbr: number;
  upcNbr: string;
  pendingOnHandsQty: number;
  exceptionType: string | null | undefined;
  actionCompleted: boolean;
  floorLocations: Array<LocationType>;
  reserveLocations: Array<LocationType>;
  selectedLocation: LocationType | null;
  salesFloor: boolean;
  itemDetails: ItemDetails | null;
}

export const initialState : ItemDetailsState = {
  itemNbr: 0,
  upcNbr: '',
  pendingOnHandsQty: -999,
  exceptionType: null,
  actionCompleted: false,
  floorLocations: [],
  reserveLocations: [],
  selectedLocation: null,
  salesFloor: false,
  itemDetails: null
};

/**
 * Redux mainly for ReviewItemDetails screen, but we do use its values elsewhere to
 * prevent data redundancy.
 * TODO Redux will be refactored to a flow based system instead of
 * current screen based system for clarity of data redundancy avoidance
 *
 * @param state current or initial state of redux
 * @param action changes being made to state
 * @returns new state
 */
export const ItemDetailScreen = (
  // eslint-disable-next-line default-param-last
  state = initialState,
  action: Actions
) : ItemDetailsState => {
  switch (action.type) {
    case SETUP_SCREEN:
      return action.payload.itemDetails ? {
        ...state,
        itemNbr: action.payload.itemNbr,
        upcNbr: action.payload.upcNbr,
        exceptionType: action.payload.exceptionType,
        pendingOnHandsQty: action.payload.pendingOHQty,
        actionCompleted: action.payload.completed,
        salesFloor: action.payload.salesFloor,
        itemDetails: action.payload.itemDetails
      } : {
        ...state,
        itemNbr: action.payload.itemNbr,
        upcNbr: action.payload.upcNbr,
        exceptionType: action.payload.exceptionType,
        pendingOnHandsQty: action.payload.pendingOHQty,
        actionCompleted: action.payload.completed,
        salesFloor: action.payload.salesFloor
      };
    case CLEAR_SCREEN:
      return initialState;
    case SET_ITEM_DETAILS:
      return {
        ...state,
        itemDetails: action.payload,
        itemNbr: action.payload.itemNbr
      };
    case UPDATE_PENDING_OH_QTY:
      return {
        ...state,
        pendingOnHandsQty: action.payload
      };
    case ACTION_COMPLETED:
      return {
        ...state,
        actionCompleted: true
      };
    case SET_FLOOR_LOCATIONS:
      return {
        ...state,
        floorLocations: action.payload.map((loc: LocationType) => ({
          ...loc,
          locationName: `${loc.zoneName}${loc.aisleName}-${loc.sectionName}`
        }))
      };
    case SET_RESERVE_LOCATIONS:
      return {
        ...state,
        reserveLocations: action.payload.map((loc: LocationType) => ({
          ...loc,
          qty: loc.qty ? loc.qty : loc.quantity,
          locationName: `${loc.zoneName}${loc.aisleName}-${loc.sectionName}`
        }))
      };
    case DELETE_LOCATION_FROM_EXISTING: {
      const { locIndex } = action.payload;

      if (action.payload.locationArea === 'floor') {
        const deleteFloorLocation = [
          ...state.floorLocations.slice(0, locIndex),
          ...state.floorLocations.slice(locIndex + 1)];
        return {
          ...state,
          floorLocations: deleteFloorLocation
        };
      }
      if (action.payload.locationArea === 'reserve') {
        const deleteReserveLocation = [
          ...state.reserveLocations.slice(0, locIndex),
          ...state.reserveLocations.slice(locIndex + 1)];
        return {
          ...state,
          reserveLocations: deleteReserveLocation
        };
      }
      return {
        ...state
      };
    }
    case RESET_LOCATIONS:
      return {
        ...state,
        floorLocations: [],
        reserveLocations: [],
        selectedLocation: null
      };
    case SET_SELECTED_LOCATION:
      return {
        ...state,
        selectedLocation: action.payload.location
      };
    case CLEAR_SELECTED_LOCATION:
      return {
        ...state,
        selectedLocation: null
      };
    case SET_UPC:
      return {
        ...state,
        upcNbr: action.payload.upc
      };
    default:
      return state;
  }
};
