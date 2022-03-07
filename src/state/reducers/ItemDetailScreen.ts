import {
  ACTION_COMPLETED,
  Actions,
  CLEAR_SELECTED_LOCATION,
  DELETE_LOCATION_FROM_EXISTING,
  RESET_LOCATIONS,
  SETUP_SCREEN,
  SET_FLOOR_LOCATIONS,
  SET_RESERVE_LOCATIONS,
  SET_SELECTED_LOCATION, SET_UPC,
  UPDATE_PENDING_OH_QTY
} from '../actions/ItemDetailScreen';
import LocationType from '../../models/Location';

interface ItemDetailsState {
  itemNbr: number;
  upcNbr: string;
  pendingOnHandsQty: number;
  exceptionType: string | null | undefined;
  actionCompleted: boolean;
  floorLocations: Array<LocationType>;
  reserveLocations: Array<LocationType>;
  selectedLocation: LocationType | null;
  salesFloor: boolean;
}

const initialState : ItemDetailsState = {
  itemNbr: 0,
  upcNbr: '',
  pendingOnHandsQty: -999,
  exceptionType: null,
  actionCompleted: false,
  floorLocations: [],
  reserveLocations: [],
  selectedLocation: null,
  salesFloor: false
};

export const ItemDetailScreen = (
  state = initialState,
  action: Actions
) : ItemDetailsState => {
  switch (action.type) {
    case SETUP_SCREEN:
      return {
        itemNbr: action.payload.itemNbr,
        upcNbr: action.payload.upcNbr,
        floorLocations: action.payload.floorLocations.map((loc: LocationType) => ({
          ...loc,
          locationName: `${loc.zoneName}${loc.aisleName}-${loc.sectionName}`
        })),
        reserveLocations: action.payload.reserveLocations.map((loc: LocationType) => ({
          ...loc,
          locationName: `${loc.zoneName}${loc.aisleName}-${loc.sectionName}`
        })),
        exceptionType: action.payload.exceptionType,
        pendingOnHandsQty: action.payload.pendingOHQty,
        actionCompleted: action.payload.completed,
        selectedLocation: null,
        salesFloor: action.payload.salesFloor
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
      return initialState;
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
