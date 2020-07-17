import { RESET_SCANNED_EVENT, SET_BYOD, SET_MANUAL_SCAN, SET_SCANNED_EVENT } from '../actions/Global';

const initialState = {
  isByod: false,
  scannedEvent: {
    value: null,
    type: null
  },
  isManualScanEnabled: false
}

export const Global = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_BYOD:
      return {
        ...state,
        isByod: action.payload
      }
    case SET_SCANNED_EVENT:
      return {
        ...state,
        scannedEvent: action.payload
      }
    case RESET_SCANNED_EVENT:
      return {
        ...state,
        scannedEvent: initialState.scannedEvent
      }
    case SET_MANUAL_SCAN:
      return {
        ...state,
        isManualScanEnabled: action.payload
      }
    default:
      return state;
  }
}
