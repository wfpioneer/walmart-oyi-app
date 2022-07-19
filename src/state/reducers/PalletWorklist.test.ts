import {
  clearSelectedWorklistPalletId,
  setSelectedTab,
  setSelectedWorklistPalletId
} from '../actions/PalletWorklist';
import { PalletWorklist, PalletWorklistState, initialState } from './PalletWorklist';
import { Tabs } from '../../models/PalletWorklist';

describe('testing PalletWorklist reducer', () => {
  it('testing setSelectedTab action', () => {
    const testInitialState = initialState;
    let testChangedState: PalletWorklistState = { ...testInitialState, selectedTab: Tabs.COMPLETED };
    let testResults = PalletWorklist(testInitialState, setSelectedTab(Tabs.COMPLETED));
    expect(testResults).toStrictEqual(testChangedState);
    testChangedState = { ...testInitialState, selectedTab: Tabs.TODO };
    testResults = PalletWorklist(testInitialState, setSelectedTab(Tabs.TODO));
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('testing setSelectedWorklistPalletId action', () => {
    const testPalletId = '4988';
    const testInitialState = initialState;
    const testChangedState: PalletWorklistState = { ...testInitialState, selectedWorklistPalletId: testPalletId };
    const testResults = PalletWorklist(testInitialState, setSelectedWorklistPalletId(testPalletId));
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('testing setSelectedTab action', () => {
    const testInitialState = { ...initialState, selectedWorklistPalletId: '4444' };
    const testChangedState: PalletWorklistState = { ...testInitialState, selectedWorklistPalletId: '' };
    const testResults = PalletWorklist(testInitialState, clearSelectedWorklistPalletId());
    expect(testResults).toStrictEqual(testChangedState);
  });
});
