import {
  CLEAR_RESERVE_ADJUSTMENT_SCREEN_DATA,
  SET_ITEM_DETAILS,
  SET_RESERVE_LOCATIONS,
  clearReserveAdjustmentScreenData,
  setItemDetails,
  setReserveLocations
} from './ReserveAdjustmentScreen';
import { getMockItemDetails } from '../../mockData';
import { itemPallets } from '../../mockData/getItemPallets';

describe('ReserveAdjustmentScreen actions', () => {
  const mockItemDetails = getMockItemDetails('123');
  it('handles setting item details in ReserveAdjustmentScreen redux state', () => {
    const setItemDetailsResult = setItemDetails(mockItemDetails);
    expect(setItemDetailsResult).toStrictEqual({
      type: SET_ITEM_DETAILS,
      payload: mockItemDetails
    });
  });
  it('handles setting reserve locations in ReserveAdjustmentScreen redux state', () => {
    const mockReserveLocations = itemPallets.pallets;
    const setReserveLocationsResult = setReserveLocations(mockReserveLocations);
    expect(setReserveLocationsResult).toStrictEqual({
      type: SET_RESERVE_LOCATIONS,
      payload: mockReserveLocations
    });
  });
  it('handles clearing the ReserveAdjustmentScreen data', () => {
    const clearAuditScreenDataResult = clearReserveAdjustmentScreenData();
    expect(clearAuditScreenDataResult).toStrictEqual({
      type: CLEAR_RESERVE_ADJUSTMENT_SCREEN_DATA
    });
  });
});
