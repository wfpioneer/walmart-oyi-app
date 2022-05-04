import { Binning, StateType } from './Binning';
import {
  addPallet,
  clearBinLocation,
  clearPallets,
  deletePallet,
  setBinLocation
} from '../actions/Binning';
import { BinningPallet } from '../../models/Binning';

describe('testing binning reducer', () => {
  it('testing binning reducer', () => {
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

    const testInitialState: StateType = {
      pallets: [],
      binLocation: null
    };

    const testChangedState: StateType = {
      pallets: [],
      binLocation: null
    };

    testChangedState.pallets = [testPallet];
    let testResults = Binning(testInitialState, addPallet(testPallet));
    expect(testResults).toStrictEqual(testChangedState);

    testInitialState.binLocation = 1234;
    testChangedState.pallets = [];
    testChangedState.binLocation = null;
    testResults = Binning(testInitialState, clearBinLocation());
    expect(testResults).toStrictEqual(testChangedState);

    testInitialState.pallets = [testPallet];
    testInitialState.binLocation = null;
    testChangedState.pallets = [];
    testChangedState.binLocation = null;
    testResults = Binning(testInitialState, clearPallets());
    expect(testResults).toStrictEqual(testChangedState);

    testResults = Binning(testInitialState, deletePallet('1'));
    expect(testResults).toStrictEqual(testChangedState);

    testInitialState.pallets = [];
    testInitialState.binLocation = null;
    testChangedState.pallets = [];
    testChangedState.binLocation = 1234;
    testResults = Binning(testInitialState, setBinLocation(1234));
    expect(testResults).toStrictEqual(testChangedState);
  });
});
