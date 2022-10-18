import {
  Actions,
  RESET_SCANNED_EVENT,
  SET_BOTTOM_TAB,
  SET_BYOD,
  SET_CALCULATOR_OPEN,
  SET_MANUAL_SCAN,
  SET_SCANNED_EVENT
} from '../actions/Global';

export interface StateType {
  isByod: boolean;
  isManualScanEnabled: boolean;
  scannedEvent: {
    value: string | null;
    type: string | null;
  };
  isBottomTabEnabled: boolean;
  calcOpen: boolean;
}

const initialState: StateType = {
  isByod: false,
  scannedEvent: {
    value: null,
    type: null
  },
  isManualScanEnabled: false,
  isBottomTabEnabled: true,
  calcOpen: false
};

export const Global = (state = initialState, action: Actions): StateType => {
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
    case SET_BOTTOM_TAB:
      return {
        ...state,
        isBottomTabEnabled: action.payload
      };
    case SET_CALCULATOR_OPEN:
      return {
        ...state,
        calcOpen: action.payload
      };
    default:
      return state;
  }
};
