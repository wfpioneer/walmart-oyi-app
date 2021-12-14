import {
  AisleItem,
  CREATE_FLOW,
  PossibleZone,
  SectionDetailsItem,
  SectionItem,
  ZoneItem
} from '../../models/LocationItems';
import { LocationIdName } from '../reducers/Location';

export const SELECT_ZONE = 'LOCATION/SELECT_ZONE';
export const SET_ZONES = 'LOCATION/SET_ZONES';
export const SELECT_AISLE = 'LOCATION/SELECT_AISLE';
export const SET_AISLES = 'LOCATION/SET_AISLES';
export const SELECT_SECTION = 'LOCATION/SELECT_SECTION';
export const SET_SECTIONS = 'LOCATION/SET_SECTIONS';
export const SHOW_LOCATION_POPUP = 'LOCATION/SHOW_POPUP';
export const HIDE_LOCATION_POPUP = 'LOCATION/HIDE_POPUP';
export const RESET_SECTION_NAME = 'LOCATION/RESET_SECTION_NAME';
export const SET_POSSIBLE_ZONES = 'LOCATION/SET_POSSIBLE_ZONES';
export const SET_CREATE_FLOW = 'LOCATION/SET_CREATE_FLOW';
export const SET_NEW_ZONE = 'LOCATION/SET_NEW_ZONE';
export const SET_AISLES_TO_CREATE = 'LOCATION/SET_NUMBER_OF_AISLES_TO_CREATE';
export const SET_AISLES_TO_CREATE_TO_EXISTING_AISLE = 'LOCATION/SET_AISLES_TO_CREATE_TO_EXISTING_AISLE';
export const SET_AISLE_SECTION_COUNT = 'LOCATION/SET_AISLE_SECTION_COUNT';
export const SHOW_ITEM_POPUP = 'LOCATION/SHOW_ITEM_POPUP';
export const HIDE_ITEM_POPUP = 'LOCATION/HIDE_ITEM_POPUP';
export const SET_SELECTED_ITEM = 'LOCATION/SET_SELECTED_ITEM';
export const CLEAR_SELECTED_ITEM = 'LOCATION/CLEAR_SELECTED_ITEM';

export const selectZone = (id: number, name: string) => ({
  type: SELECT_ZONE,
  payload: {
    id,
    name
  }
} as const);

export const setZones = (zones: ZoneItem[]) => ({
  type: SET_ZONES,
  payload: zones
} as const);

export const selectAisle = (id: number, name: string) => ({
  type: SELECT_AISLE,
  payload: {
    id,
    name
  }
} as const);

export const setAisles = (aisles: AisleItem[]) => ({
  type: SET_AISLES,
  payload: aisles
} as const);

export const selectSection = (id: number, name: string) => ({
  type: SELECT_SECTION,
  payload: {
    id,
    name
  }
} as const);

export const setSections = (sections: SectionItem[]) => ({
  type: SET_SECTIONS,
  payload: sections
} as const);

export const showLocationPopup = () => ({
  type: SHOW_LOCATION_POPUP
} as const);

export const hideLocationPopup = () => ({
  type: HIDE_LOCATION_POPUP
} as const);

export const resetLocationAll = () => ({
  type: RESET_SECTION_NAME
} as const);

export const setPossibleZones = (zoneArray: PossibleZone[]) => ({
  type: SET_POSSIBLE_ZONES,
  payload: zoneArray
} as const);

export const setCreateFlow = (createFlow: CREATE_FLOW) => ({
  type: SET_CREATE_FLOW,
  payload: createFlow
} as const);

export const setAislesToCreate = (aisles: number) => ({
  type: SET_AISLES_TO_CREATE,
  payload: aisles
} as const);

export const setAislesToCreateToExistingAisle = (existingAisle: LocationIdName) => ({
  type: SET_AISLES_TO_CREATE_TO_EXISTING_AISLE,
  payload: existingAisle
} as const);

export const setNewZone = (name: string) => ({
  type: SET_NEW_ZONE,
  payload: name
} as const);

export const setAisleSectionCount = (aisleIndex: number, sectionCount: number) => ({
  type: SET_AISLE_SECTION_COUNT,
  payload: {
    aisleIndex,
    sectionCount
  }
} as const);

export const showItemPopup = () => ({
  type: SHOW_ITEM_POPUP
} as const);

export const hideItemPopup = () => ({
  type: HIDE_ITEM_POPUP
} as const);

export const setSelectedItem = (selectedItem: SectionDetailsItem) => ({
  type: SET_SELECTED_ITEM,
  payload: selectedItem
} as const);

export const clearSelectedItem = () => ({
  type: CLEAR_SELECTED_ITEM
} as const);

export type Actions =
  ReturnType<typeof selectZone>
  | ReturnType<typeof setZones>
  | ReturnType<typeof selectAisle>
  | ReturnType<typeof setAisles>
  | ReturnType<typeof selectSection>
  | ReturnType<typeof setSections>
  | ReturnType<typeof showLocationPopup>
  | ReturnType<typeof hideLocationPopup>
  | ReturnType<typeof resetLocationAll>
  | ReturnType<typeof setPossibleZones>
  | ReturnType<typeof setCreateFlow>
  | ReturnType<typeof setNewZone>
  | ReturnType<typeof setAislesToCreate>
  | ReturnType<typeof setAislesToCreateToExistingAisle>
  | ReturnType<typeof setAisleSectionCount>
  | ReturnType<typeof showItemPopup>
  | ReturnType<typeof hideItemPopup>
  | ReturnType<typeof setSelectedItem>
  | ReturnType<typeof clearSelectedItem>
