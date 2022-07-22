import { IPickHistory } from '../../models/ItemDetails';

export const SET_PICK_HISTORY = 'ITEM_HISTORY/SET_PICK_HISTORY';
export const CLEAR_ITEM_HISTORY = 'ITEM_HISTORY/CLEAR_ITEM_HISTORY';

export const setPickHistory = (data: IPickHistory[]) => ({
  type: SET_PICK_HISTORY,
  payload: data
} as const);

export const clearHistory = () => ({
  type: CLEAR_ITEM_HISTORY
} as const);

export type Actions =
  | ReturnType<typeof setPickHistory>
  | ReturnType<typeof clearHistory>
