import {SET_FLOOR_LOCATIONS, SET_ITEM_LOC_DETAILS, SET_RESERVE_LOCATIONS} from "../actions/Location";
import LocationType from "../../models/Location";

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
  console.log(action.payload);
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
    default:
      return state;
  }
};