import {
  CLEAR_AUDIT_SCREEN_DATA,
  SET_APPROVAL_ITEM,
  SET_FLOOR_LOCATIONS,
  SET_ITEM_DETAILS,
  SET_RESERVE_LOCATIONS,
  SET_SCANNED_PALLET_ID,
  UPDATE_FLOOR_LOCATION_QTY,
  UPDATE_PALLET_QTY,
  UPDATE_SCANNED_PALLET_STATUS,
  clearAuditScreenData,
  setApprovalItem,
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
import { ApprovalListItem, approvalRequestSource, approvalStatus } from '../../models/ApprovalListItem';

const mockApprovalItem: ApprovalListItem = {
  imageUrl: undefined,
  itemName: 'Nature Valley Crunchy Cereal Bars ',
  itemNbr: 123,
  upcNbr: 40000000123,
  categoryNbr: 1,
  categoryDescription: 'SNACKS',
  subCategoryNbr: 1,
  subCategoryDescription: '',
  newQuantity: 20,
  oldQuantity: 5,
  dollarChange: 150.50,
  initiatedUserId: 'Associate Employee',
  initiatedTimestamp: '2021-03-27T00:00:00.000Z',
  approvalStatus: approvalStatus.Pending,
  approvalRequestSource: approvalRequestSource.ItemDetails,
  isChecked: false,
  daysLeft: 3
};

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

  it('test setApproval', () => {
    const setApprovalItemResult = setApprovalItem(mockApprovalItem);
    expect(setApprovalItemResult).toStrictEqual({
      type: SET_APPROVAL_ITEM,
      payload: mockApprovalItem
    });
  });
});
