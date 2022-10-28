import {
  clearAuditScreenData,
  setFloorLocations,
  setItemDetails,
  setReserveLocations,
  setScannedPalletId,
  updateFloorLocationQty,
  updatePalletQty
} from '../actions/AuditItemScreen';
import { AuditItemScreen, AuditItemScreenState, initialState } from './AuditItemScreen';
import { getMockItemDetails } from '../../mockData';
import { itemPallets } from '../../mockData/getItemPallets';

describe('The Audit Item Screen Reducer', () => {
  // Intitial State
  const testInitialState = initialState;
  const mockItemDetails = getMockItemDetails('123');
  // Changed state
  const testChangedState: AuditItemScreenState = {
    ...initialState,
    itemDetails: mockItemDetails
  };
  it('handles setting the item details in AuditItemScreen redux state', () => {
    const testResults = AuditItemScreen(testInitialState, setItemDetails(mockItemDetails));
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handles setting the floor locations in AuditItemScreen redux state', () => {
    const mockFloorLocations = mockItemDetails.location.floor;
    const testResults = AuditItemScreen(testInitialState, setFloorLocations(mockFloorLocations));
    const changeState = { ...testInitialState, floorLocations: mockFloorLocations };
    expect(testResults).toStrictEqual(changeState);
  });
  it('handles setting the floor locations in AuditItemScreen redux state', () => {
    const mockReserveLocations = itemPallets.pallets;
    const testResults = AuditItemScreen(testInitialState, setReserveLocations(mockReserveLocations));
    const changeState = { ...testInitialState, reserveLocations: mockReserveLocations };
    expect(testResults).toStrictEqual(changeState);
  });
  it('handles clearing the AuditItemScreen redux state while moving away from the screen', () => {
    const testResults = AuditItemScreen(testInitialState, clearAuditScreenData());
    expect(testResults).toStrictEqual(initialState);
  });
  it('handles updating new qty for the pallet associated to the item', () => {
    const mockInitialState: AuditItemScreenState = {
      ...initialState,
      reserveLocations: itemPallets.pallets
    };
    const mockNewQty = 13;
    const mockPalletId = 4598;
    const mockScanned = true;
    const testResults = AuditItemScreen(mockInitialState, updatePalletQty(mockPalletId, mockNewQty, mockScanned));
    const changeState = {
      ...initialState,
      reserveLocations: [{
        palletId: 4598,
        quantity: 22,
        newQty: 13,
        scanned: true,
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
});
