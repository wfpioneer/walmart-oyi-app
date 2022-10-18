import { Global, StateType } from './Global';
import {
  resetScannedEvent,
  setCalculatorOpen,
  setIsByod,
  setManualScan,
  setScannedEvent
} from '../actions/Global';

describe('testing Global reducer', () => {
  it('testing Global reducer', () => {
    const testEvent: {value: string; type: string} = {
      type: 'manual',
      value: '123'
    };
    const testInitialState: StateType = {
      isByod: false,
      scannedEvent: {
        value: null,
        type: null
      },
      isManualScanEnabled: false,
      isBottomTabEnabled: false,
      calcOpen: false
    };

    const testChangedState: StateType = {
      isByod: false,
      scannedEvent: {
        value: null,
        type: null
      },
      isManualScanEnabled: false,
      isBottomTabEnabled: false,
      calcOpen: false
    };

    testChangedState.scannedEvent = testEvent;
    let testResults = Global(testInitialState, setScannedEvent(testEvent));
    expect(testResults).toStrictEqual(testChangedState);

    testChangedState.scannedEvent = testInitialState.scannedEvent;
    testChangedState.isByod = true;
    testResults = Global(testInitialState, setIsByod(true));
    expect(testResults).toStrictEqual(testChangedState);

    testChangedState.isByod = testInitialState.isByod;
    testChangedState.isManualScanEnabled = true;
    testResults = Global(testInitialState, setManualScan(true));
    expect(testResults).toStrictEqual(testChangedState);

    testChangedState.scannedEvent = { value: null, type: null };
    testChangedState.isManualScanEnabled = testInitialState.isManualScanEnabled;
    testResults = Global(testInitialState, resetScannedEvent());
    expect(testResults).toStrictEqual(testChangedState);

    testChangedState.calcOpen = true;
    testResults = Global(testInitialState, setCalculatorOpen(true));
    expect(testResults).toStrictEqual(testChangedState);
  });
});
