import { ItemHistoryI } from '../../models/ItemDetails';

export const SET_HISTORY = 'ITEM_HISTORY/SET_HISTORY';
export const CLEAR_ITEM_HISTORY = 'ITEM_HISTORY/CLEAR_ITEM_HISTORY';

export const setHistory = (data: ItemHistoryI[], title: string) => ({
  type: SET_HISTORY,
  payload: { data, title }
} as const);

export const clearHistory = () => ({
  type: CLEAR_ITEM_HISTORY
} as const);

export type Actions =
  | ReturnType<typeof setHistory>
  | ReturnType<typeof clearHistory>
