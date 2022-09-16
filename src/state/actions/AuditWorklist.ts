import { WorklistItemI } from '../../models/WorklistItem';

export const SET_WORKLIST_ITEMS = 'AUDIT_WORKLIST/SET_SELECTED_TAB';
export const CLEAR_WORKLIST_ITEMS = 'AUDIT_WORKLIST/CLEAR_WORKLIST_ITEMS';

export const setWorklistItems = (items: WorklistItemI[]) => ({
  type: SET_WORKLIST_ITEMS,
  payload: items
} as const);

export const clearWorklistItems = () => ({
  type: CLEAR_WORKLIST_ITEMS
} as const);

export type Actions =
  | ReturnType<typeof setWorklistItems>
  | ReturnType<typeof clearWorklistItems>
