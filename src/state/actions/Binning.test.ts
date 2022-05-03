import {
  ADD_PALLET,
  CLEAR_BIN_LOCATION,
  CLEAR_PALLETS,
  DELETE_PALLET,
  SET_BIN_LOCATION,
  addPallet,
  clearBinLocation,
  clearPallets,
  deletePallet,
  setBinLocation
} from './Binning';
import { BinningPallet } from '../../models/Binning';

describe('test action creators for binning', () => {
  it('test action creators for binning', () => {
    const testPallet: BinningPallet = {
      id: '1',
      expirationDate: '03/22/2022',
      items: [{
        itemNbr: 123456789,
        itemDesc: 'test',
        upcNbr: '123456789098',
        price: 10,
        quantity: 100
      }]
    };
    const addPalletResult = addPallet(testPallet);
    expect(addPalletResult).toStrictEqual({
      type: ADD_PALLET,
      payload: testPallet
    });

    const clearBinLocationResult = clearBinLocation();
    expect(clearBinLocationResult).toStrictEqual({ type: CLEAR_BIN_LOCATION });

    const clearPalletsResult = clearPallets();
    expect(clearPalletsResult).toStrictEqual({ type: CLEAR_PALLETS });

    const deletePalletResult = deletePallet('1');
    expect(deletePalletResult).toStrictEqual({
      type: DELETE_PALLET,
      payload: 1
    });

    let setBinLocationResult = setBinLocation('A1-1');
    expect(setBinLocationResult).toStrictEqual({
      type: SET_BIN_LOCATION,
      payload: 'A1-1'
    });
    setBinLocationResult = setBinLocation(1234);
    expect(setBinLocationResult).toStrictEqual({
      type: SET_BIN_LOCATION,
      payload: 1234
    });
  });
});
