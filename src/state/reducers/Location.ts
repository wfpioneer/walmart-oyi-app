import {
  ADD_LOCATION_TO_EXISTING,
  DELETE_LOCATION_FROM_EXISTING,
  EDIT_EXISTING_LOCATION,
  IS_UPDATING,
  RESET_LOCATIONS,
  SET_FLOOR_LOCATIONS,
  SET_ITEM_LOC_DETAILS,
  SET_RESERVE_LOCATIONS
} from '../actions/Location';
import LocationType from '../../models/Location';
import { GET_LOCATION_DETAILS } from '../actions/saga';

interface LocationState {
  floorLocations: Array<LocationType>;
  reserveLocations: Array<LocationType>;
  isUpdating: boolean;
  itemLocDetails: {
    itemNbr: number | null;
    upcNbr: string | null;
    exceptionType: string | null;
  };
}

const initialState: LocationState = {
  floorLocations: [],
  reserveLocations: [],
  isUpdating: false,
  itemLocDetails: {
    itemNbr: null,
    upcNbr: null,
    exceptionType: null
  }
};

export const Location = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_ITEM_LOC_DETAILS:
      return {
        ...state,
        itemLocDetails: { ...action.payload }
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
        state.floorLocations.push({
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
          floorLocations: state.floorLocations
        };
      }
      if (action.payload.locationArea === 'reserve') {
        state.reserveLocations.push({
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
          reserveLocations: state.reserveLocations
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
        state.floorLocations.splice(action.payload.locIndex, 1, editedLocation);
        return {
          ...state,
          floorLocations: state.floorLocations
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
        state.reserveLocations.splice(action.payload.locIndex, 1, editedLocation);
        return {
          ...state,
          reserveLocations: state.reserveLocations
        };
      }
      return {
        ...state
      };
    case IS_UPDATING:
      return {
        ...state,
        isUpdating: action.payload
      };
    case DELETE_LOCATION_FROM_EXISTING:
      if (action.payload.locationArea === 'floor') {
        state.floorLocations.splice(action.payload.locIndex, 1);
        return {
          ...state,
          floorLocations: state.floorLocations
        };
      }
      if (action.payload.locationArea === 'reserve') {
        state.reserveLocations.splice(action.payload.locIndex, 1);
        return {
          ...state,
          reserveLocations: state.reserveLocations
        };
      }
      return {
        ...state
      };
    case RESET_LOCATIONS:
      return {
        floorLocations: [],
        reserveLocations: [],
        isUpdating: false,
        itemLocDetails: {
          itemNbr: null,
          upcNbr: null,
          exceptionType: null
        }
      };
      case GET_LOCATION_DETAILS:
        return {
          ...state,
          floorLocations: action.payload.floor ?? [],
          reserveLocations: action.payload.reserve ?? [],
        }
    default:
      return state;
  }
};
