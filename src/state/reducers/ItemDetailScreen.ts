import {
  Actions,
  ADD_LOCATION_TO_EXISTING,
  ACTION_COMPLETED,
  DELETE_LOCATION_FROM_EXISTING,
  EDIT_EXISTING_LOCATION,
  RESET_LOCATIONS,
  SET_FLOOR_LOCATIONS,
  SET_RESERVE_LOCATIONS,
  SETUP_SCREEN,
  UPDATE_PENDING_OH_QTY } from '../actions/ItemDetailScreen';
import LocationType from "../../models/Location";

interface ItemDetailsState {
  itemNbr: number;
  upcNbr: string;
  pendingOnHandsQty: number;
  exceptionType: string | null | undefined;
  actionCompleted: boolean;
  floorLocations: Array<LocationType>;
  reserveLocations: Array<LocationType>;
}

const initialState : ItemDetailsState = {
  itemNbr: 0,
  upcNbr: '',
  pendingOnHandsQty: -999,
  exceptionType: null,
  actionCompleted: false,
  floorLocations: [],
  reserveLocations: [],
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
        actionCompleted: action.payload.completed
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
    case ADD_LOCATION_TO_EXISTING:
      if (action.payload.locationArea === 'floor') {
        const addFloorLocations = [...state.floorLocations];
        addFloorLocations.push({
          zoneId: 0,
          aisleId: 0,
          sectionId: 0,
          zoneName: '',
          aisleName: '',
          sectionName: '',
          locationName: action.payload.locationName,
          type: '',
          typeNbr: action.payload.locationTypeNbr
        });
        return {
          ...state,
          floorLocations: addFloorLocations
        };
      }
      if (action.payload.locationArea === 'reserve') {
        const addReserveLocations = [...state.reserveLocations];
        addReserveLocations.push({
          zoneId: 0,
          aisleId: 0,
          sectionId: 0,
          zoneName: '',
          aisleName: '',
          sectionName: '',
          locationName: action.payload.locationName,
          type: '',
          typeNbr: action.payload.locationTypeNbr
        });
        return {
          ...state,
          reserveLocations: addReserveLocations
        };
      }
      return {
        ...state
      };
    case EDIT_EXISTING_LOCATION:
      if (action.payload.locationArea === 'floor') {
        const editedLocation = {
          zoneId: 0,
          aisleId: 0,
          sectionId: 0,
          zoneName: '',
          aisleName: '',
          sectionName: '',
          locationName: action.payload.locationName,
          type: '',
          typeNbr: action.payload.locationTypeNbr
        };
        const editFloorLocations = [...state.floorLocations].splice(action.payload.locIndex, 1, editedLocation);
        return {
          ...state,
          floorLocations: editFloorLocations
        };
      }
      if (action.payload.locationArea === 'reserve') {
        const editedLocation = {
          zoneId: 0,
          aisleId: 0,
          sectionId: 0,
          zoneName: '',
          aisleName: '',
          sectionName: '',
          locationName: action.payload.locationName,
          type: '',
          typeNbr: action.payload.locationTypeNbr
        };
        const editReserveLocations = [...state.reserveLocations].splice(action.payload.locIndex, 1, editedLocation);
        return {
          ...state,
          reserveLocations: editReserveLocations
        };
      }
      return {
        ...state
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
    default:
      return state;
  }
};
