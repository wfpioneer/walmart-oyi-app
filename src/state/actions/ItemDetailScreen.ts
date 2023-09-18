import ItemDetails from '../../models/ItemDetails';
import Location from '../../models/Location';

export const SETUP_SCREEN = 'ITEM_DETAILS_SCREEN/SETUP';
export const CLEAR_SCREEN = 'ITEM_DETAILS_SCREEN/CLEAR';
export const SET_ITEM_DETAILS = 'ITEM_DETAILS_SCREEN/SET_ITEM_DETAILS';
export const ACTION_COMPLETED = 'ITEM_DETAILS_SCREEN/ACTION_COMPLETED';
export const UPDATE_PENDING_OH_QTY = 'ITEM_DETAILS_SCREEN/UPDATE_PENDING_OH_QTY';
export const SET_FLOOR_LOCATIONS = 'ITEM_DETAILS_SCREEN/SET_FLOOR_LOCATIONS';
export const SET_RESERVE_LOCATIONS = 'ITEM_DETAILS_SCREEN/SET_RESERVE_LOCATIONS';
export const DELETE_LOCATION_FROM_EXISTING = 'ITEM_DETAILS_SCREEN/DELETE_LOCATION_FROM_EXISTING';
export const RESET_LOCATIONS = 'ITEM_DETAILS_SCREEN/RESET_LOCATIONS';
export const GET_LOCATION_DETAILS = 'ITEM_DETAILS_SCREEN/GET_LOCATION_DETAILS';
export const SET_SELECTED_LOCATION = 'ITEM_DETAILS_SCREEN/SET_SELECTED_LOCATION';
export const CLEAR_SELECTED_LOCATION = 'ITEM_DETAILS_SCREEN/CLEAR_SELECTED_LOCATION';
export const SET_UPC = 'ITEM_DETAILS_SCREEN/SET_UPC';

export const setupScreen = (
  itemNbr: number,
  upcNbr: string,
  exceptionType: string | null | undefined,
  pendingOHQty: number,
  completed: boolean,
  salesFloor: boolean,
  itemDetails?: ItemDetails
) => ({
  type: SETUP_SCREEN,
  payload: {
    itemNbr,
    upcNbr,
    exceptionType,
    pendingOHQty,
    completed,
    salesFloor,
    itemDetails
  }
} as const);

export const clearScreen = () => ({ type: CLEAR_SCREEN } as const);

export const setItemDetails = (itemDetails: ItemDetails) => ({
  type: SET_ITEM_DETAILS,
  payload: itemDetails
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

export const getLocationsForItem = (itemNbr: number) => ({
  type: GET_LOCATION_DETAILS,
  payload: {
    itemNbr
  }
} as const);

export const setSelectedLocation = (location: Location) => ({
  type: SET_SELECTED_LOCATION,
  payload: {
    location
  }
} as const);

export const clearSelectedLocation = () => ({
  type: CLEAR_SELECTED_LOCATION
} as const);

export const setUPC = (upc: string) => ({
  type: SET_UPC,
  payload: {
    upc
  }
} as const);

export type Actions =
  ReturnType<typeof setupScreen>
  | ReturnType<typeof clearScreen>
  | ReturnType<typeof setItemDetails>
  | ReturnType<typeof updatePendingOHQty>
  | ReturnType<typeof setActionCompleted>
  | ReturnType<typeof setFloorLocations>
  | ReturnType<typeof setReserveLocations>
  | ReturnType<typeof deleteLocationFromExisting>
  | ReturnType<typeof resetLocations>
  | ReturnType<typeof getLocationsForItem>
  | ReturnType<typeof setSelectedLocation>
  | ReturnType<typeof clearSelectedLocation>
  | ReturnType<typeof setUPC>
