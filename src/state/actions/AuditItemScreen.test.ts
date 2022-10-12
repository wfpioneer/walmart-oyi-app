import {
  CLEAR_AUDIT_SCREEN_DATA,
  SET_FLOOR_LOCATIONS,
  SET_ITEM_DETAILS,
  SET_RESERVE_LOCATIONS,
  UPDATE_PALLET_QTY,
  clearAuditScreenData,
  setFloorLocations,
  setItemDetails,
  setReserveLocations,
  updatePalletQty
} from './AuditItemScreen';
import { getMockItemDetails } from '../../mockData';
import { itemPallets } from '../../mockData/getItemPallets';

describe('Audit Item Screen actions', () => {
  const mockItemDetails = getMockItemDetails('123');
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
    const mockReserveLocations = itemPallets.pallets;
    const setReserveLocationsResult = setReserveLocations(mockReserveLocations);
    expect(setReserveLocationsResult).toStrictEqual({
      type: SET_RESERVE_LOCATIONS,
      payload: mockReserveLocations
    });
  });
  it('handles clearing the AuditItemScreen data', () => {
    const clearAuditScreenDataResult = clearAuditScreenData();
    expect(clearAuditScreenDataResult).toStrictEqual({
      type: CLEAR_AUDIT_SCREEN_DATA
    });
  });
  it('handles updating the pallet quantity based on palletId', () => {
    const mockPalletId = '4567';
    const mockNewQty = 22;
    const updatePalletQtyResult = updatePalletQty(mockPalletId, mockNewQty);
    expect(updatePalletQtyResult).toStrictEqual({
      type: UPDATE_PALLET_QTY,
      payload: { palletId: mockPalletId, newQty: mockNewQty }
    });
  });
});
