export const SELECTED_ZONE = 'LOCATION/SELECT_ZONE';
export const SELECTED_AISLE = 'LOCATION/SELECTED_AISLE';
export const SELECTED_SECTION = 'LOCATION/SELECTED_AISLE';
export const RESET_LOCATION = 'LOCATION/RESET_LOCATION';

export const selectedZone = (id: number, name: string) => ({
  type: SELECTED_ZONE,
  payload: {
    id,
    name
  }
} as const);

export const selectedAisle = (id: number, name: string) => ({
  type: SELECTED_AISLE,
  payload: {
    id,
    name
  }
} as const);

export const selectedSection = (id: number, name: string) => ({
  type: SELECTED_SECTION,
  payload: {
    id,
    name
  }
} as const);

export const resetLocation = () => ({
  type: RESET_LOCATION
} as const);

export type Actions =
  | ReturnType<typeof selectedZone>
  | ReturnType<typeof selectedAisle>
  | ReturnType<typeof selectedSection>
  | ReturnType<typeof resetLocation>;
