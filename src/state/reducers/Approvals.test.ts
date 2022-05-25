import {
  resetApprovals,
  setApprovalList,
  toggleAllItems,
  toggleCategory,
  toggleItem
} from '../actions/Approvals';
import { ApprovalState, Approvals, initialState } from './Approvals';

describe('testing Worklist reducer', () => {
  it('testing Worklist reducer', () => {
    // Intitial State
    const testInitialState = initialState;
    // Changed state
    let testChangedState: ApprovalState = {
      ...initialState,
      
    };
    // toggleMenu action
    let testResults = toggleItem(testInitialState, toggleMenu(true));
    expect(testResults).toStrictEqual(testChangedState);
    testChangedState = { ...initialState, menuOpen: false };
    testResults = worklist(testInitialState, toggleMenu(false));
    expect(testResults).toStrictEqual(testChangedState);
    // toggleCategories action
    testChangedState = { ...initialState, categoryOpen: false };
    testResults = worklist(testInitialState, toggleCategories(false));
    expect(testResults).toStrictEqual(testChangedState);
    testChangedState = { ...initialState, categoryOpen: true };
    testResults = worklist(testInitialState, toggleCategories(true));
    expect(testResults).toStrictEqual(testChangedState);
    // toggleExceptions action
    testChangedState = { ...initialState, exceptionOpen: false };
    testResults = worklist(testInitialState, toggleExceptions(false));
    expect(testResults).toStrictEqual(testChangedState);
    testChangedState = { ...initialState, exceptionOpen: true };
    testResults = worklist(testInitialState, toggleExceptions(true));
    expect(testResults).toStrictEqual(testChangedState);
    // updateFilterCategories action
    const testFilterCategories = ['3 - OFFICE SUPPLIES', '31 - OFFICE ELECTRONICS'];
    testChangedState = { ...initialState, filterCategories: testFilterCategories };
    testResults = worklist(testInitialState, updateFilterCategories(testFilterCategories));
    expect(testResults).toStrictEqual(testChangedState);
    // updateFilterExceptions action
    const testFilterExceptions = ['PO'];
    testChangedState = { ...initialState, filterExceptions: testFilterExceptions };
    testResults = worklist(testInitialState, updateFilterExceptions(testFilterExceptions));
    expect(testResults).toStrictEqual(testChangedState);
    // clearFilter action
    testResults = worklist(testInitialState, clearFilter());
    expect(testResults).toStrictEqual(testInitialState);
  });
});
