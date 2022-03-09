import {
  RESET_SCANNED_EVENT,
  SET_BYOD,
  SET_MANUAL_SCAN,
  SET_SCANNED_EVENT,
  resetScannedEvent,
  setIsByod,
  setManualScan,
  setScannedEvent
} from './Global';

describe('test action creators for Global', () => {
  it('test action creators for binning', () => {
    // setScannedEvent action creator
    const testEvent: {value: string; type: string} = {
      type: 'manual',
      value: '123'
    };
    const setScannedEventResult = setScannedEvent(testEvent);
    expect(setScannedEventResult).toStrictEqual({
      type: SET_SCANNED_EVENT,
      payload: testEvent
    });
    // setScannedEvent action creator
    const mockIsManualScan = false;
    const setManualScanResult = setManualScan(mockIsManualScan);
    expect(setManualScanResult).toStrictEqual({ type: SET_MANUAL_SCAN, payload: mockIsManualScan });
    // setScannedEvent action creator
    const resetScannedEventResult = resetScannedEvent();
    expect(resetScannedEventResult).toStrictEqual({ type: RESET_SCANNED_EVENT });
    // setScannedEvent action creator
    const mockIsByod = true;
    const setIsByodResult = setIsByod(mockIsByod);
    expect(setIsByodResult).toStrictEqual({
      type: SET_BYOD,
      payload: mockIsByod
    });
  });
});
