export const SET_BYOD = 'GLOBAL/SET_BYOD';
export const SET_SCANNED_EVENT = 'GLOBAL/SET_SCANNED_EVENT';
export const RESET_SCANNED_EVENT = 'GLOBAL/RESET_SCANNED_EVENT';

export const setIsByod = (bool: boolean) => {
  return {
    type: SET_BYOD,
    payload: bool
  }
}

export const setScannedEvent = (event: {value: string, type: string}) => {
  return {
    type: SET_SCANNED_EVENT,
    payload: event
  }
}

export const resetScannedEvent = () => {
  return {
    type: RESET_SCANNED_EVENT
  }
}
