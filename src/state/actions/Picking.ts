import { PickCreateItem, PickListItem, Tabs } from '../../models/Picking.d';
import Location from '../../models/Location';

export const INITIALIZE_PICKLIST = 'PICKLIST/INITIALIZE';
export const UPDATE_PICKS = 'PICKLIST/UPDATE_PICKS';
export const SELECT_PICKS = 'PICKLIST/SELECT_PICKS';
export const DELETE_PICKS = 'PICKLIST/DELETE_PICKS';
export const RESET_PICKLIST = 'PICKLIST/RESET';
export const SET_PICK_CREATE_ITEM = 'PICKLIST/SET_PICK_CREATE_ITEM';
export const SET_PICK_CREATE_FLOOR = 'PICKLIST/SET_PICK_CREATE_FLOOR';
export const SET_PICK_CREATE_RESERVE = 'PICKLIST/SET_PICK_CREATE_RESERVE';
export const SET_SELECTED_TAB = 'PICKLIST/SET_SELECTED_TAB';
export const SHOW_PICKING_MENU = 'PICKLIST/SHOW_PICKING_MENU';
export const TOGGLE_MULTI_PICK = 'PICKLIST/TOGGLE_MULTI_PICK';
export const TOGGLE_MULTI_BIN = 'PICKLIST/TOGGLE_MULTI_BIN'

export const initializePicklist = (plItems: PickListItem[]) => ({
  type: INITIALIZE_PICKLIST,
  payload: plItems
} as const);

export const updatePicks = (plItems: PickListItem[]) => ({
  type: UPDATE_PICKS,
  payload: plItems
} as const);

export const selectPicks = (pickIds: number[]) => ({
  type: SELECT_PICKS,
  payload: pickIds
} as const);

export const deletePicks = (pickIds: number[]) => ({
  type: DELETE_PICKS,
  payload: pickIds
} as const);

export const resetPickList = () => ({
  type: RESET_PICKLIST
} as const);

export const setPickCreateItem = (pickCreateItem: PickCreateItem) => ({
  type: SET_PICK_CREATE_ITEM,
  payload: pickCreateItem
} as const);

export const setPickCreateFloor = (pickCreateFloorLocations: Location[]) => ({
  type: SET_PICK_CREATE_FLOOR,
  payload: pickCreateFloorLocations
} as const);

export const setPickCreateReserve = (pickCreateReserveLocations: Location[]) => ({
  type: SET_PICK_CREATE_RESERVE,
  payload: pickCreateReserveLocations
} as const);

export const setSelectedTab = (tab: Tabs) => ({
  type: SET_SELECTED_TAB,
  payload: tab
} as const);

export const showPickingMenu = (show: boolean) => ({
  type: SHOW_PICKING_MENU,
  payload: show
} as const);

export const toggleMultiPick = (togglePick: boolean) => ({
  type: TOGGLE_MULTI_PICK,
  payload: togglePick
} as const);

export const toggleMultiBin = (toggleBin: boolean) => ({
  type: TOGGLE_MULTI_BIN,
  payload: toggleBin
} as const);

export type Actions =
  | ReturnType<typeof initializePicklist>
  | ReturnType<typeof updatePicks>
  | ReturnType<typeof selectPicks>
  | ReturnType<typeof deletePicks>
  | ReturnType<typeof setPickCreateItem>
  | ReturnType<typeof setPickCreateFloor>
  | ReturnType<typeof setPickCreateReserve>
  | ReturnType<typeof setSelectedTab>
  | ReturnType<typeof resetPickList>
  | ReturnType<typeof showPickingMenu>
  | ReturnType<typeof toggleMultiBin>
  | ReturnType<typeof toggleMultiPick>;
