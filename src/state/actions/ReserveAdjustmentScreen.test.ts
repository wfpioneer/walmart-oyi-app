import {
  CLEAR_RESERVE_ADJUSTMENT_SCREEN_DATA,
  SET_ITEM_DETAILS,
  SET_RESERVE_LOCATIONS,
  SET_SCANNED_PALLET_ID,
  UPDATE_PALLET_QTY,
  UPDATE_SCANNED_PALLET_STATUS,
  clearReserveAdjustmentScreenData,
  setItemDetails,
  setReserveLocations,
  setScannedPalletId,
  updatePalletQty,
  updatePalletScannedStatus
} from './ReserveAdjustmentScreen';
import { getMockItemDetails } from '../../mockData';
import { mockPalletLocations } from '../../mockData/getItemPallets';

describe('ReserveAdjustmentScreen actions', () => {
  const mockItemDetails = getMockItemDetails('123');
  const mockPalletId = 99;
  it('handles setting item details in ReserveAdjustmentScreen redux state', () => {
    const setItemDetailsResult = setItemDetails(mockItemDetails);
    expect(setItemDetailsResult).toStrictEqual({
      type: SET_ITEM_DETAILS,
      payload: mockItemDetails
    });
  });
  it('handles setting reserve locations in ReserveAdjustmentScreen redux state', () => {
    const setReserveLocationsResult = setReserveLocations(mockPalletLocations);
    expect(setReserveLocationsResult).toStrictEqual({
      type: SET_RESERVE_LOCATIONS,
      payload: mockPalletLocations
    });
  });
  it('handles clearing the ReserveAdjustmentScreen data', () => {
    const clearReserveAdjustmentScreenDataResult = clearReserveAdjustmentScreenData();
    expect(clearReserveAdjustmentScreenDataResult).toStrictEqual({
      type: CLEAR_RESERVE_ADJUSTMENT_SCREEN_DATA
    });
  });
  it('handles updating the pallet quantity based on palletId in ReserveAdjustment', () => {
    const mockNewQty = 22;
    const updatePalletQtyResult = updatePalletQty(mockPalletId, mockNewQty);
    expect(updatePalletQtyResult).toStrictEqual({
      type: UPDATE_PALLET_QTY,
      payload: { palletId: mockPalletId, newQty: mockNewQty }
    });
  });
  it('handles setting the palletId for ReserveAdjustment Screen', () => {
    const setScannedPalletIdResult = setScannedPalletId(mockPalletId);
    expect(setScannedPalletIdResult).toStrictEqual({
      type: SET_SCANNED_PALLET_ID,
      payload: mockPalletId
    });
  });
  it('handles updating the scanned status for a reserve location', () => {
    const mockScanned = true;
    const updatePalletScannedStatusResult = updatePalletScannedStatus(
      mockPalletId,
      mockScanned
    );
    expect(updatePalletScannedStatusResult).toStrictEqual({
      type: UPDATE_SCANNED_PALLET_STATUS,
      payload: { palletId: mockPalletId, scanned: mockScanned }
    });
  });
});
