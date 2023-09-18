import {
  clearAuditScreenData,
  setApprovalItem,
  setFloorLocations,
  setReserveLocations,
  setScannedPalletId,
  updateFloorLocationQty,
  updatePalletQty,
  updatePalletScannedStatus
} from '../actions/AuditItemScreen';
import { AuditItemScreen, AuditItemScreenState, initialState } from './AuditItemScreen';
import { getMockItemDetails } from '../../mockData';
import { mockPalletLocations } from '../../mockData/getItemPallets';
import { ApprovalListItem, approvalRequestSource, approvalStatus } from '../../models/ApprovalListItem';

describe('The Audit Item Screen Reducer', () => {
  // Intitial State
  const testInitialState = initialState;
  const mockItemDetails = getMockItemDetails('123');
  const mockInitialReserveState: AuditItemScreenState = {
    ...initialState,
    reserveLocations: mockPalletLocations
  };
  it('handles setting the floor locations in AuditItemScreen redux state', () => {
    const mockFloorLocations = mockItemDetails.location.floor;
    const testResults = AuditItemScreen(testInitialState, setFloorLocations(mockFloorLocations));
    const changeState = { ...testInitialState, floorLocations: mockFloorLocations };
    expect(testResults).toStrictEqual(changeState);
  });
  it('handles setting the floor locations in AuditItemScreen redux state', () => {
    const testResults = AuditItemScreen(testInitialState, setReserveLocations(mockPalletLocations));
    const changeState = { ...testInitialState, reserveLocations: mockPalletLocations };
    expect(testResults).toStrictEqual(changeState);
  });
  it('handles clearing the AuditItemScreen redux state while moving away from the screen', () => {
    const testResults = AuditItemScreen(testInitialState, clearAuditScreenData());
    expect(testResults).toStrictEqual(initialState);
  });
  it('handles updating new qty for the pallet associated to the item', () => {
    const mockNewQty = 13;
    const mockPalletId = 4598;
    const testLocations = mockPalletLocations;
    const testResults = AuditItemScreen(mockInitialReserveState, updatePalletQty(mockPalletId, mockNewQty));
    testLocations[0].newQty = 13;

    const changeState = {
      ...initialState,
      reserveLocations: testLocations
    };
    expect(testResults).toStrictEqual(changeState);
  });
  it('handles setting the new pallet id while it got scanned', () => {
    const testNewState = {
      ...initialState,
      scannedPalletId: 4597
    };
    const testResults = AuditItemScreen(testInitialState, setScannedPalletId(4597));
    expect(testResults).toStrictEqual(testNewState);
  });
  it('handles updating new qty for the floor loc', () => {
    const mockFloorLocations = [{
      zoneId: 0,
      aisleId: 1,
      sectionId: 1,
      zoneName: 'A',
      aisleName: '1',
      sectionName: '1',
      locationName: 'A1-1',
      type: 'Sales Floor',
      typeNbr: 8,
      newQty: 0
    }];
    const mockInitialState: AuditItemScreenState = {
      ...initialState,
      floorLocations: mockFloorLocations
    };
    const expectedFloorLocState = [{
      zoneId: 0,
      aisleId: 1,
      sectionId: 1,
      zoneName: 'A',
      aisleName: '1',
      sectionName: '1',
      locationName: 'A1-1',
      type: 'Sales Floor',
      typeNbr: 8,
      newQty: 13
    }];

    const mockNewQty = 13;
    const mockLocName = 'A1-1';
    const testResults = AuditItemScreen(mockInitialState, updateFloorLocationQty(mockLocName, mockNewQty));
    const changeState = {
      ...initialState,
      floorLocations: expectedFloorLocState
    };
    expect(testResults).toStrictEqual(changeState);
  });

  it('handles updating the reserve location with the scanned palletId', () => {
    const mockScanned = true;
    const testLocations = mockPalletLocations;
    const testResults = AuditItemScreen(
      mockInitialReserveState,
      updatePalletScannedStatus(mockPalletLocations[0].palletId, mockScanned)
    );
    testLocations[0].scanned = true;

    const changedState: AuditItemScreenState = {
      ...mockInitialReserveState,
      reserveLocations: mockPalletLocations
    };
    expect(testResults).toStrictEqual(changedState);
  });

  it('set approval item', () => {
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

    const changedState = {
      ...testInitialState,
      approvalItem: mockApprovalItem
    };
    const testResults = AuditItemScreen(testInitialState, setApprovalItem(mockApprovalItem));
    expect(testResults).toStrictEqual(changedState);
  });
});
