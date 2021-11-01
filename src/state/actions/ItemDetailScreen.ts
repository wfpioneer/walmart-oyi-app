import Location from '../../models/Location';

export const SETUP_SCREEN = 'ITEM_DETAILS_SCREEN/SETUP';
export const ACTION_COMPLETED = 'ITEM_DETAILS_SCREEN/ACTION_COMPLETED';
export const UPDATE_PENDING_OH_QTY = 'ITEM_DETAILS_SCREEN/UPDATE_PENDING_OH_QTY';
export const SET_FLOOR_LOCATIONS = 'LOCATION/SET_FLOOR_LOCATIONS';
export const SET_RESERVE_LOCATIONS = 'LOCATION/SET_RESERVE_LOCATIONS';
export const ADD_LOCATION_TO_EXISTING = 'LOCATION/ADD_LOCATION_TO_EXISTING';
export const EDIT_EXISTING_LOCATION = 'LOCATION/EDIT_EXISTING_LOCATION';
export const DELETE_LOCATION_FROM_EXISTING = 'LOCATION/DELETE_LOCATION_FROM_EXISTING';
export const RESET_LOCATIONS = 'LOCATION/RESET_LOCATIONS';
export const GET_LOCATION_DETAILS = 'LOCATION/GET_LOCATION_DETAILS';

export const setupScreen = (
  itemNbr: number,
  upcNbr: string,
  floorLocations: Location[],
  reserveLocations: Location[],
  exceptionType: string | null | undefined,
  pendingOHQty: number,
  completed: boolean
) => ({
  type: SETUP_SCREEN,
  payload: {
    itemNbr,
    upcNbr,
    floorLocations,
    reserveLocations,
    exceptionType,
    pendingOHQty,
    completed
  }
} as const);

export const updatePendingOHQty = (pendingOHQty: number) => ({
  type: UPDATE_PENDING_OH_QTY,
  payload: pendingOHQty
} as const);

export const setActionCompleted = () => ({
  type: ACTION_COMPLETED
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

export const editExistingLocation = (
  locationName: string,
  locationTypeNbr: number,
  locationArea: string,
  locIndex: number
) => ({
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

export type Actions =
  ReturnType<typeof setupScreen>
  | ReturnType<typeof updatePendingOHQty>
  | ReturnType<typeof setActionCompleted>
  | ReturnType<typeof setFloorLocations>
  | ReturnType<typeof setReserveLocations>
  | ReturnType<typeof addLocationToExisting>
  | ReturnType<typeof editExistingLocation>
  | ReturnType<typeof deleteLocationFromExisting>
  | ReturnType<typeof resetLocations>
  | ReturnType<typeof getLocationDetails>;
