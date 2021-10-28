import Location from '../../models/Location';

export const SET_FLOOR_LOCATIONS = 'LOCATION/SET_FLOOR_LOCATIONS';
export const SET_RESERVE_LOCATIONS = 'LOCATION/SET_RESERVE_LOCATIONS';
export const SET_ITEM_LOC_DETAILS = 'LOCATION/SET_ITEM_LOC_DETAILS';
export const ADD_LOCATION_TO_EXISTING = 'LOCATION/ADD_LOCATION_TO_EXISTING';
export const EDIT_EXISTING_LOCATION = 'LOCATION/EDIT_EXISTING_LOCATION';
export const DELETE_LOCATION_FROM_EXISTING = 'LOCATION/DELETE_LOCATION_FROM_EXISTING';
export const RESET_LOCATIONS = 'LOCATION/RESET_LOCATIONS';
export const GET_LOCATION_DETAILS = 'LOCATION/GET_LOCATION_DETAILS';
export const SELECT_ZONE = 'LOCATION/SELECT_ZONE';
export const SELECT_AISLE = 'LOCATION/SELECT_AISLE';
export const SELECT_SECTION = 'LOCATION/SELECT_SECTION';
export const SHOW_LOCATION_POPUP = 'LOCATION/SHOW_POPUP';
export const HIDE_LOCATION_POPUP = 'LOCATION/HIDE_POPUP';

export const setItemLocDetails = (itemNbr: number, upcNbr: string, exceptionType: string) => ({
  type: SET_ITEM_LOC_DETAILS,
  payload: {
    itemNbr,
    upcNbr,
    exceptionType
  }
} as const);

export const setFloorLocations = (floor: Location[]) => ({
  type: SET_FLOOR_LOCATIONS,
  payload: floor
} as const);

export const setReserveLocations = (reserve: Location[]) => ({
  type: SET_RESERVE_LOCATIONS,
  payload: reserve
} as const);

export const addLocationToExisting = (locationName: string, locationTypeNbr: number, locationArea: string) => ({
  type: ADD_LOCATION_TO_EXISTING,
  payload: {
    locationName,
    locationTypeNbr,
    locationArea
  }
} as const);

export const editExistingLocation = (locationName: string, locationTypeNbr: number, locationArea: string,
  locIndex: number) => ({
  type: EDIT_EXISTING_LOCATION,
  payload: {
    locationName,
    locationTypeNbr,
    locationArea,
    locIndex
  }
} as const);

export const deleteLocationFromExisting = (locationArea: string, locIndex: number) => ({
  type: DELETE_LOCATION_FROM_EXISTING,
  payload: {
    locationArea,
    locIndex
  }
} as const);

export const resetLocations = () => ({
  type: RESET_LOCATIONS
} as const);

export const getLocationDetails = (itemNbr: number) => ({
  type: GET_LOCATION_DETAILS,
  payload: {
    itemNbr
  }
} as const);

export const selectZone = (id: number, name: string) => ({
  type: SELECT_ZONE,
  payload: {
    id,
    name
  }
} as const);

export const selectAisle = (id: number, name: string) => ({
  type: SELECT_AISLE,
  payload: {
    id,
    name
  }
} as const);

export const selectSection = (id: number, name: string) => ({
  type: SELECT_SECTION,
  payload: {
    id,
    name
  }
} as const);

export const showLocationPopup = () => ({
  type: SHOW_LOCATION_POPUP
} as const);

export const hideLocationPopup = () => ({
  type: HIDE_LOCATION_POPUP
} as const);

export type Actions =
  | ReturnType<typeof setItemLocDetails>
  | ReturnType<typeof setFloorLocations>
  | ReturnType<typeof setReserveLocations>
  | ReturnType<typeof addLocationToExisting>
  | ReturnType<typeof editExistingLocation>
  | ReturnType<typeof deleteLocationFromExisting>
  | ReturnType<typeof getLocationDetails>
  | ReturnType<typeof resetLocations>
  | ReturnType<typeof selectZone>
  | ReturnType<typeof selectAisle>
  | ReturnType<typeof selectSection>
  | ReturnType<typeof showLocationPopup>
  | ReturnType<typeof hideLocationPopup>;
