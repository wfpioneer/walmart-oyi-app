import {
  ADD_LOCATION_TO_EXISTING,
  SET_FLOOR_LOCATIONS,
  SET_ITEM_LOC_DETAILS,
  SET_RESERVE_LOCATIONS
} from "../actions/Location";
import LocationType from "../../models/Location";
import _ from 'lodash';

interface LocationState {
  floorLocations: Array<LocationType>;
  reserveLocations: Array<LocationType>;
  itemLocDetails: {
    itemNbr: number | null,
    upcNbr: string | null,
  }
}

const initialState: LocationState = {
  itemLocDetails: {
    itemNbr: null,
    upcNbr: null
  },
  floorLocations: [],
  reserveLocations: [],

};

export const Location = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_ITEM_LOC_DETAILS:
      return {
        ...state,
        itemLocDetails: {...action.payload}
      }
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
        const newLocationsArray = _.cloneDeep(state.floorLocations);
        newLocationsArray.push({
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
          floorLocations: newLocationsArray
        }
      } else if (action.payload.locationArea === 'reserve') {
        const newLocationsArray = _.cloneDeep(state.floorLocations);
        newLocationsArray.push({
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
          reserveLocations: newLocationsArray
        }
      } else {
        return {
          ...state
        }
      }
    default:
      return state;
  }
};