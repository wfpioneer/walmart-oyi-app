import Location from '../../models/Location';

export const SET_FLOOR_LOCATIONS = 'LOCATION/SET_FLOOR_LOCATIONS';
export const SET_RESERVE_LOCATIONS = 'LOCATION/SET_RESERVE_LOCATIONS';
export const SET_ITEM_LOC_DETAILS = 'LOCATION/SET_ITEM_LOC_DETAILS';
export const ADD_LOCATION_TO_EXISTING = 'LOCATION/ADD_LOCATION_TO_EXISTING';
export const EDIT_EXISTING_LOCATION = 'LOCATION/EDIT_EXISTING_LOCATION';
export const IS_UPDATING = 'LOCATION/IS_UPDATING';
export const DELETE_LOCATION_FROM_EXISTING = 'LOCATION/DELETE_LOCATION_FROM_EXISTING';
export const RESET_LOCATIONS = 'LOCATION/RESET_LOCATIONS';

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

export const editExistingLocation = (locationName: string, locationTypeNbr: number, locationArea: string, locIndex: number) => ({
  type: EDIT_EXISTING_LOCATION,
  payload: {
    locationName,
    locationTypeNbr,
    locationArea,
    locIndex
  }
});

export const deleteLocationFromExisting = (locationArea: string, locIndex: number) => ({
  type: DELETE_LOCATION_FROM_EXISTING,
  payload: {
    locationArea,
    locIndex
  }
});

export const isUpdating = (updating: boolean) => ({
  type: IS_UPDATING,
  payload: updating
});

export const resetLocations = () => ({
  type: RESET_LOCATIONS
});