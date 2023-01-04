import {
  clearReserveAdjustmentScreenData,
  setItemDetails,
  setReserveLocations
} from '../actions/ReserveAdjustmentScreen';
import { ReserveAdjustmentScreen, ReserveAdjustmentScreenState, initialState } from './ReserveAdjustmentScreen';
import { getMockItemDetails } from '../../mockData';
import { itemPallets } from '../../mockData/getItemPallets';

describe('The Reserve Adjustment Screen Reducer', () => {
  // Intitial State
  const testInitialState = initialState;
  const mockItemDetails = getMockItemDetails('123');
  // Changed state
  const testChangedState: ReserveAdjustmentScreenState = {
    ...initialState,
    itemDetails: mockItemDetails
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
});
