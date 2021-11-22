import {
  AisleItem,
  CREATE_FLOW,
  PossibleZone,
  SectionItem,
  ZoneItem
} from '../../models/LocationItems';

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
export const SET_NUMBER_OF_AISLES_TO_CREATE = 'LOCATION/SET_NUMBER_OF_AISLES_TO_CREATE';

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

export const resetSectionName = () => ({
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

export const setNumberOfAislesToCreate = (aisles: number) => ({
  type: SET_NUMBER_OF_AISLES_TO_CREATE,
  payload: aisles
} as const);

export const setNewZone = (name: string) => ({
  type: SET_NEW_ZONE,
  payload: name
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
  | ReturnType<typeof resetSectionName>
  | ReturnType<typeof setPossibleZones>
  | ReturnType<typeof setCreateFlow>
  | ReturnType<typeof setNewZone>
  | ReturnType<typeof setNumberOfAislesToCreate>
