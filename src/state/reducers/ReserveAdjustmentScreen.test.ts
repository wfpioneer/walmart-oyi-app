import {
  clearReserveAdjustmentScreenData,
  setItemDetails,
  setReserveLocations,
  setScannedPalletId,
  updatePalletQty,
  updatePalletScannedStatus
} from '../actions/ReserveAdjustmentScreen';
import { ReserveAdjustmentScreen, ReserveAdjustmentScreenState, initialState } from './ReserveAdjustmentScreen';
import { getMockItemDetails } from '../../mockData';
import { mockPalletLocations } from '../../mockData/getItemPallets';

describe('The Reserve Adjustment Screen Reducer', () => {
  // Intitial State
  const testInitialState = initialState;
  const mockItemDetails = getMockItemDetails('123');
  const mockPalletId = 6775;
  // Changed state
  const testChangedState: ReserveAdjustmentScreenState = {
    ...initialState,
    itemDetails: mockItemDetails
  };
  const mockInitialReserveState: ReserveAdjustmentScreenState = {
    ...initialState,
    reserveLocations: mockPalletLocations
  };
  it('handles setting the item details in Reserve Adjustment Screen redux state', () => {
    const testResults = ReserveAdjustmentScreen(testInitialState, setItemDetails(mockItemDetails));
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handles setting the reserve locations in Reserve Adjustment Screen redux state', () => {
    const testResults = ReserveAdjustmentScreen(testInitialState, setReserveLocations(mockPalletLocations));
    const changeState = { ...testInitialState, reserveLocations: mockPalletLocations };
    expect(testResults).toStrictEqual(changeState);
  });
  it('handles clearing the Reserve Adjustment Screen redux state while moving away from the screen', () => {
    const testResults = ReserveAdjustmentScreen(testInitialState, clearReserveAdjustmentScreenData());
    expect(testResults).toStrictEqual(initialState);
  });
  it('handles updating new qty for the pallet associated to the item', () => {
    const mockNewQty = 13;
    const testResults = ReserveAdjustmentScreen(mockInitialReserveState, updatePalletQty(mockPalletId, mockNewQty));
    const testLocations = mockPalletLocations;

    testLocations[0].newQty = 13;
    const changeState: ReserveAdjustmentScreenState = {
      ...initialState,
      reserveLocations: mockPalletLocations
    };
    expect(testResults).toStrictEqual(changeState);
  });
  it('handles setting the new pallet id while it got scanned', () => {
    const testNewState = {
      ...initialState,
      scannedPalletId: mockPalletId
    };
    const testResults = ReserveAdjustmentScreen(testInitialState, setScannedPalletId(mockPalletId));
    expect(testResults).toStrictEqual(testNewState);
  });
  it('handles updating the reserve location with the scanned palletId', () => {
    const mockScanned = true;
    const testLocations = mockPalletLocations;
    const testResults = ReserveAdjustmentScreen(
      mockInitialReserveState,
      updatePalletScannedStatus(mockPalletLocations[0].palletId, mockScanned)
    );
    testLocations[0].scanned = true;

    const changedState: ReserveAdjustmentScreenState = {
      ...mockInitialReserveState,
      reserveLocations: mockPalletLocations
    };
    expect(testResults).toStrictEqual(changedState);
  });
});
