import Location from '../../models/Location';

export const SET_FLOOR_LOCATIONS = 'LOCATION/SET_FLOOR_LOCATIONS';
export const SET_RESERVE_LOCATIONS = 'LOCATION/SET_RESERVE_LOCATIONS';
export const SET_ITEM_LOC_DETAILS = 'LOCATION/SET_ITEM_LOC_DETAILS';
export const ADD_LOCATION_TO_EXISTING = 'LOCATION/ADD_LOCATION_TO_EXISTING';

export const setItemLocDetails = (itemNbr: number, upcNbr: string) => ({
  type: SET_ITEM_LOC_DETAILS,
  payload: {
    itemNbr,
    upcNbr
  }
});

export const setFloorLocations = (floor: [Location]) => ({
  type: SET_FLOOR_LOCATIONS,
  payload: floor
});

export const setReserveLocations = (reserve: [Location]) => ({
  type: SET_RESERVE_LOCATIONS,
  payload: reserve
});

export const addLocationToExisting = (locationName: string, locationTypeNbr: number, locationArea: string) => ({
  type: ADD_LOCATION_TO_EXISTING,
  payload: {
    locationName,
    locationTypeNbr,
    locationArea
  }
});
