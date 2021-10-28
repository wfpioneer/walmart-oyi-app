export const SELECT_ZONE = 'LOCATION/SELECT_ZONE';
export const SELECT_AISLE = 'LOCATION/SELECT_AISLE';
export const SELECT_SECTION = 'LOCATION/SELECT_SECTION';

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

export type Actions =
  ReturnType<typeof selectZone>
  | ReturnType<typeof selectAisle>
  | ReturnType<typeof selectSection>;
