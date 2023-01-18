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
import { itemPallets } from '../../mockData/getItemPallets';

describe('The Reserve Adjustment Screen Reducer', () => {
  // Intitial State
  const testInitialState = initialState;
  const mockItemDetails = getMockItemDetails('123');
  const mockPalletId = 4598;
  // Changed state
  const testChangedState: ReserveAdjustmentScreenState = {
    ...initialState,
    itemDetails: mockItemDetails
  };
  const mockInitialReserveState: ReserveAdjustmentScreenState = {
    ...initialState,
    reserveLocations: itemPallets.pallets
  };
  it('handles setting the item details in Reserve Adjustment Screen redux state', () => {
    const testResults = ReserveAdjustmentScreen(testInitialState, setItemDetails(mockItemDetails));
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handles setting the reserve locations in Reserve Adjustment Screen redux state', () => {
    const mockReserveLocations = itemPallets.pallets;
    const testResults = ReserveAdjustmentScreen(testInitialState, setReserveLocations(mockReserveLocations));
    const changeState = { ...testInitialState, reserveLocations: mockReserveLocations };
    expect(testResults).toStrictEqual(changeState);
  });
  it('handles clearing the Reserve Adjustment Screen redux state while moving away from the screen', () => {
    const testResults = ReserveAdjustmentScreen(testInitialState, clearReserveAdjustmentScreenData());
    expect(testResults).toStrictEqual(initialState);
  });
  it('handles updating new qty for the pallet associated to the item', () => {
    const mockNewQty = 13;
    const testResults = ReserveAdjustmentScreen(mockInitialReserveState, updatePalletQty(mockPalletId, mockNewQty));
    const changeState = {
      ...initialState,
      reserveLocations: [{
        palletId: mockPalletId,
        quantity: 22,
        newQty: 13,
        sectionId: 5578,
        locationName: 'D1-4',
        mixedPallet: false
      }]
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
    const testResults = ReserveAdjustmentScreen(
      mockInitialReserveState,
      updatePalletScannedStatus(itemPallets.pallets[0].palletId, mockScanned)
    );
    const changedState: ReserveAdjustmentScreenState = {
      ...mockInitialReserveState,
      reserveLocations: [{ ...itemPallets.pallets[0], scanned: true }]
    };
    expect(testResults).toStrictEqual(changedState);
  });
});
