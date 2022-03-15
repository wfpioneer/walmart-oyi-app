import { PickListItem } from '../../models/Picking.d';

export const INITIALIZE_PICKLIST = 'PICKLIST/INITIALIZE';
export const UPDATE_PICKS = 'PICKLIST/UPDATE_PICKS';
export const SELECT_PICKS = 'PICKLIST/SELECT_PICKS';
export const DELETE_PICKS = 'PICKLIST/DELETE_PICKS';

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

export type Actions =
  | ReturnType<typeof initializePicklist>
  | ReturnType<typeof updatePicks>
  | ReturnType<typeof selectPicks>
  | ReturnType<typeof deletePicks>;
