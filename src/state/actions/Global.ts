export const SET_BYOD = 'GLOBAL/SET_BYOD';
export const SET_SCANNED_EVENT = 'GLOBAL/SET_SCANNED_EVENT';
export const RESET_SCANNED_EVENT = 'GLOBAL/RESET_SCANNED_EVENT';
export const SET_MANUAL_SCAN = 'GLOBAL/SET_MANUAL_SCAN';
export const SET_BOTTOM_TAB = 'GLOBAL/SET_BOTTOM_TAB';

export const setBottomTab = (isEnabled: boolean) => ({
  type: SET_BOTTOM_TAB,
  payload: isEnabled
} as const);

export const setIsByod = (bool: boolean) => ({
  type: SET_BYOD,
  payload: bool
} as const);

export const setScannedEvent = (event: { value: string; type: string }) => ({
  type: SET_SCANNED_EVENT,
  payload: event
} as const);

export const resetScannedEvent = () => ({
  type: RESET_SCANNED_EVENT
} as const);

export const setManualScan = (bool: boolean) => ({
  type: SET_MANUAL_SCAN,
  payload: bool
} as const);

export type Actions =
  | ReturnType<typeof setIsByod>
  | ReturnType<typeof setScannedEvent>
  | ReturnType<typeof resetScannedEvent>
  | ReturnType<typeof setManualScan>
  | ReturnType<typeof setBottomTab>;
