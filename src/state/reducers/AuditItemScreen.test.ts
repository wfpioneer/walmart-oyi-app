import {
  clearAuditScreenData,
  setFloorLocations,
  setItemDetails,
  setReserveLocations
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
});
