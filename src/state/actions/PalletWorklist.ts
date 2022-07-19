import { Tabs } from '../../models/PalletWorklist';

export const SET_SELECTED_TAB = 'PALLET_WORKLIST/SET_SELECTED_TAB';
export const SET_SELECTED_WORKLIST_PALLET_ID = 'PALLET_WORKLIST/SET_SELECTED_WORKLIST_PALLET_ID';
export const CLEAR_SELECTED_PALLET_WORKLIST_ID = 'PALLET_WORKLIST/CLEAR_SELECTED_PALLET_WORKLIST_ID';

export const setSelectedTab = (tab: Tabs) => ({
  type: SET_SELECTED_TAB,
  payload: tab
} as const);

export const setSelectedWorklistPalletId = (id: string) => ({
  type: SET_SELECTED_WORKLIST_PALLET_ID,
  payload: id
} as const);

export const clearSelectedWorklistPalletId = () => ({
  type: CLEAR_SELECTED_PALLET_WORKLIST_ID
} as const);

export type Actions =
  | ReturnType<typeof setSelectedTab>
  | ReturnType<typeof setSelectedWorklistPalletId>
  | ReturnType<typeof clearSelectedWorklistPalletId>
