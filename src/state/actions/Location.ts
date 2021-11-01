export const SELECT_ZONE = 'LOCATION/SELECT_ZONE';
export const SELECT_AISLE = 'LOCATION/SELECT_AISLE';
export const SELECT_SECTION = 'LOCATION/SELECT_SECTION';
export const SHOW_LOCATION_POPUP = 'LOCATION/SHOW_POPUP';
export const HIDE_LOCATION_POPUP = 'LOCATION/HIDE_POPUP';

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
  ReturnType<typeof selectZone>
  | ReturnType<typeof selectAisle>
  | ReturnType<typeof selectSection>
  | ReturnType<typeof showLocationPopup>
  | ReturnType<typeof hideLocationPopup>;
