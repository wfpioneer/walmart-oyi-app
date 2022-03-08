import {
  Actions,
  RESET_SCANNED_EVENT,
  SET_BYOD,
  SET_MANUAL_SCAN,
  SET_SCANNED_EVENT
} from '../actions/Global';

interface GlobalState {
  isByod: boolean;
  scannedEvent: {
    value: string | null;
    type: string | null;
  };
  isManualScanEnabled: boolean;
}
const initialState: GlobalState = {
  isByod: false,
  scannedEvent: {
    value: null,
    type: null
  },
  isManualScanEnabled: false
};

export const Global = (state = initialState, action: Actions): GlobalState => {
  switch (action.type) {
    case SET_BYOD:
      return {
        ...state,
        isByod: action.payload
      };
    case SET_SCANNED_EVENT:
      return {
        ...state,
        scannedEvent: action.payload
      };
    case RESET_SCANNED_EVENT:
      return {
        ...state,
        scannedEvent: initialState.scannedEvent
      };
    case SET_MANUAL_SCAN:
      return {
        ...state,
        isManualScanEnabled: action.payload
      };
    default:
      return state;
  }
};
