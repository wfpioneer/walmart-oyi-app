import { RESET_SCANNED_EVENT, SET_BYOD, SET_SCANNED_EVENT } from '../actions/Global';

const initialState = {
  isByod: false,
  scannedEvent: {
    value: null,
    type: null
  }
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
    default:
      return state;
  }
}
