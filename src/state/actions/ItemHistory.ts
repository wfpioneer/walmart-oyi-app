import { ItemHistoryI } from '../../models/ItemDetails';

export const SET_ITEM_HISTORY = 'ITEM_HISTORY/SET_HISTORY';
export const CLEAR_ITEM_HISTORY = 'ITEM_HISTORY/CLEAR_ITEM_HISTORY';

export const setItemHistory = (data: ItemHistoryI[], title: string) => ({
  type: SET_ITEM_HISTORY,
  payload: { data, title }
} as const);

export const clearHistory = () => ({
  type: CLEAR_ITEM_HISTORY
} as const);

export type Actions =
  | ReturnType<typeof setItemHistory>
  | ReturnType<typeof clearHistory>
