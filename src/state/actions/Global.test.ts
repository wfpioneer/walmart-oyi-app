import {
  RESET_SCANNED_EVENT,
  SET_BYOD,
  SET_CALC_OPEN,
  SET_MANUAL_SCAN,
  SET_SCANNED_EVENT,
  resetScannedEvent,
  setCalcOpen,
  setIsByod,
  setManualScan,
  setScannedEvent
} from './Global';

describe('test action creators for Global', () => {
  it('test action creators for binning', () => {
    const testEvent: {value: string; type: string} = {
      type: 'manual',
      value: '123'
    };
    // setScannedEvent action creator
    const setScannedEventResult = setScannedEvent(testEvent);
    expect(setScannedEventResult).toStrictEqual({
      type: SET_SCANNED_EVENT,
      payload: testEvent
    });
    const mockIsManualScan = false;
    // setManualScan action creator
    const setManualScanResult = setManualScan(mockIsManualScan);
    expect(setManualScanResult).toStrictEqual({ type: SET_MANUAL_SCAN, payload: mockIsManualScan });
    // resetScannedEvent action creator
    const resetScannedEventResult = resetScannedEvent();
    expect(resetScannedEventResult).toStrictEqual({ type: RESET_SCANNED_EVENT });
    const mockIsByod = true;
    // setIsByod action creator
    const setIsByodResult = setIsByod(mockIsByod);
    expect(setIsByodResult).toStrictEqual({
      type: SET_BYOD,
      payload: mockIsByod
    });
    // setCalcOpen action creator
    const mockCalcOpen = true;
    const setCalcOpenResult = setCalcOpen(mockCalcOpen);
    expect(setCalcOpenResult).toStrictEqual({
      type: SET_CALC_OPEN,
      payload: mockCalcOpen
    });
  });
});
