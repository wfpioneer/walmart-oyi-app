import {
  CLEAR_AUDIT_SCREEN_DATA,
  SET_FLOOR_LOCATIONS,
  SET_ITEM_DETAILS,
  SET_RESERVE_LOCATIONS,
  SET_SCANNED_PALLET_ID,
  UPDATE_FLOOR_LOCATION_QTY,
  UPDATE_PALLET_QTY,
  UPDATE_SCANNED_PALLET_STATUS,
  clearAuditScreenData,
  setFloorLocations,
  setItemDetails,
  setReserveLocations,
  setScannedPalletId,
  updateFloorLocationQty,
  updatePalletQty,
  updatePalletScannedStatus
} from './AuditItemScreen';
import { getMockItemDetails } from '../../mockData';
import { mockPalletLocations } from '../../mockData/getItemPallets';

describe('Audit Item Screen actions', () => {
  const mockItemDetails = getMockItemDetails('123');
  const mockPalletId = 4567;

  it('handles setting item details in AuditItemScreen redux state', () => {
    const setItemDetailsResult = setItemDetails(mockItemDetails);
    expect(setItemDetailsResult).toStrictEqual({
      type: SET_ITEM_DETAILS,
      payload: mockItemDetails
    });
  });
  it('handles setting floor locations in AuditItemScreen redux state', () => {
    const mockFloorLocations = mockItemDetails.location.floor;
    const setFloorLocationsResult = setFloorLocations(mockFloorLocations);
    expect(setFloorLocationsResult).toStrictEqual({
      type: SET_FLOOR_LOCATIONS,
      payload: mockFloorLocations
    });
  });
  it('handles setting reserve locations in AuditItemScreen redux state', () => {
    const setReserveLocationsResult = setReserveLocations(mockPalletLocations);
    expect(setReserveLocationsResult).toStrictEqual({
      type: SET_RESERVE_LOCATIONS,
      payload: mockPalletLocations
    });
  });
  it('handles clearing the AuditItemScreen data', () => {
    const clearAuditScreenDataResult = clearAuditScreenData();
    expect(clearAuditScreenDataResult).toStrictEqual({
      type: CLEAR_AUDIT_SCREEN_DATA
    });
  });
  it('handles updating the pallet quantity based on palletId', () => {
    const mockNewQty = 22;
    const updatePalletQtyResult = updatePalletQty(mockPalletId, mockNewQty);
    expect(updatePalletQtyResult).toStrictEqual({
      type: UPDATE_PALLET_QTY,
      payload: { palletId: mockPalletId, newQty: mockNewQty }
    });
  });
  it('handles setting the palletId for Audit Item Screen', () => {
    const setScannedPalletIdResult = setScannedPalletId(mockPalletId);
    expect(setScannedPalletIdResult).toStrictEqual({
      type: SET_SCANNED_PALLET_ID,
      payload: mockPalletId
    });
  });
  it('handles updating the loc quantity based on locationName', () => {
    const mockLocationName = 'A1-1';
    const mockNewQty = 22;
    const updateFloorLocationQtyResult = updateFloorLocationQty(mockLocationName, mockNewQty);
    expect(updateFloorLocationQtyResult).toStrictEqual({
      type: UPDATE_FLOOR_LOCATION_QTY,
      payload: { locationName: mockLocationName, newQty: mockNewQty }
    });
  });

  it('handles updating the scanned status for a reserve location', () => {
    const mockScanned = true;
    const updatePalletScannedStatusResult = updatePalletScannedStatus(mockPalletId, mockScanned);
    expect(updatePalletScannedStatusResult).toStrictEqual({
      type: UPDATE_SCANNED_PALLET_STATUS,
      payload: { palletId: mockPalletId, scanned: mockScanned }
    });
  });
});
