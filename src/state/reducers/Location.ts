import {
  ADD_LOCATION_TO_EXISTING,
  Actions,
  DELETE_LOCATION_FROM_EXISTING,
  EDIT_EXISTING_LOCATION,
  HIDE_LOCATION_POPUP,
  RESET_LOCATIONS,
  SELECT_AISLE,
  SELECT_SECTION,
  SELECT_ZONE,
  SET_FLOOR_LOCATIONS,
  SET_ITEM_LOC_DETAILS,
  SET_RESERVE_LOCATIONS,
  SHOW_LOCATION_POPUP
} from '../actions/Location';
import LocationType from '../../models/Location';

interface LocationState {
  floorLocations: Array<LocationType>;
  reserveLocations: Array<LocationType>;
  itemLocDetails: {
    itemNbr: number;
    upcNbr: string;
    exceptionType: string;
  };
  selectedZone: {
    id: number;
    name: string;
  };
  selectedAisle: {
    id: number;
    name: string;
  };
  selectedSection: {
    id: number;
    name: string;
  };
  locationPopupVisible: boolean
}

const initialState: LocationState = {
  floorLocations: [],
  reserveLocations: [],
  itemLocDetails: {
    itemNbr: 0,
    upcNbr: '',
    exceptionType: ''
  },
  selectedZone: {
    id: 0,
    name: ''
  },
  selectedAisle: {
    id: 0,
    name: ''
  },
  selectedSection: {
    id: 0,
    name: ''
  },
  locationPopupVisible: false
};

export const Location = (
  state = initialState,
  action: Actions
) : LocationState => {
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
    case SELECT_ZONE: {
      return {
        ...state,
        selectedZone: {
          id: action.payload.id,
          name: action.payload.name
        }
      };
    }
    case SELECT_AISLE: {
      return {
        ...state,
        selectedAisle: {
          id: action.payload.id,
          name: action.payload.name
        }
      };
    }
    case SELECT_SECTION: {
      return {
        ...state,
        selectedSection: {
          id: action.payload.id,
          name: action.payload.name
        }
      };
    }
    case RESET_LOCATIONS:
      return initialState;
    case SHOW_LOCATION_POPUP:
      return {
        ...state,
        locationPopupVisible: true
      };
    case HIDE_LOCATION_POPUP:
      return {
        ...state,
        locationPopupVisible: false
      };
    default:
      return state;
  }
};
