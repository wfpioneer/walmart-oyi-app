import {
  resetApprovals,
  setApprovalList,
  toggleAllItems,
  toggleCategory,
  toggleItem
} from '../actions/Approvals';
import { ApprovalState, Approvals, initialState } from './Approvals';
import { mockApprovals } from '../../mockData/mockApprovalList';
import { convertApprovalListData } from '../../screens/ApprovalList/ApprovalList';

describe('The Manager Approvals Reducer', () => {
  // Intitial State
  const testInitialState = initialState;
  const { filteredData, headerIndices } = convertApprovalListData(mockApprovals);
  // Changed state
  const testChangedState: ApprovalState = {
    ...initialState,
    categories: {
      1: {
        checkedItemQty: 0,
        totalItemQty: 1
      },
      2: {
        checkedItemQty: 0,
        totalItemQty: 3
      }
    },
    approvalList: filteredData,
    categoryIndices: headerIndices
  };
  it('handles setting the Approval list for the Manager', () => {
    const testResults = Approvals(testInitialState, setApprovalList(filteredData, headerIndices));
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handles toggling-ON a category of approvals', () => {
    const testResults = Approvals(testChangedState, toggleCategory(1, true));
    const mockIsSelected = true;
    testChangedState.selectedItemQty = 1;
    testChangedState.categories[1].checkedItemQty = 1;
    testChangedState.approvalList[0].isChecked = mockIsSelected;
    testChangedState.approvalList[1].isChecked = mockIsSelected;
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handles toggling-OFF a category of approvals', () => {
    const mockIsSelected = false;
    const testResults = Approvals(testChangedState, toggleCategory(1, false));
    testChangedState.selectedItemQty = 0;
    testChangedState.categories[1].checkedItemQty = 0;
    testChangedState.approvalList[0].isChecked = mockIsSelected;
    testChangedState.approvalList[1].isChecked = mockIsSelected;
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('hndles toggling-ON a item available in Approvals list', () => {
    const mockItemNumber = 123;
    const mockIsSelected = true;
    const testResults = Approvals(testChangedState, toggleItem(mockItemNumber, mockIsSelected));
    testChangedState.selectedItemQty = 1;
    testChangedState.categories[1].checkedItemQty = 1;
    testChangedState.approvalList[0].isChecked = true;
    testChangedState.approvalList[1].isChecked = true;
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handles toggling-OFF a item available in Approvals list', () => {
    const mockItemNumber = 123;
    const mockIsSelected = false;
    const testResults = Approvals(testChangedState, toggleItem(mockItemNumber, mockIsSelected));
    testChangedState.selectedItemQty = 0;
    testChangedState.categories[1].checkedItemQty = 0;
    testChangedState.approvalList[0].isChecked = mockIsSelected;
    testChangedState.approvalList[1].isChecked = mockIsSelected;
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handles Maintaining the previously selected items State on page refresh', () => {
    // setting the state with few items as selected for Approval
    testChangedState.selectedItemQty = 1;
    testChangedState.categories[1].checkedItemQty = 1;
    testChangedState.approvalList[0].isChecked = true;
    testChangedState.approvalList[1].isChecked = true;
    const testResults = Approvals(testChangedState, setApprovalList(filteredData, headerIndices));
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handles toggling-ON all items available in the Approvals list', () => {
    const mockIsSelectedAllItems = true;
    const testResults = Approvals(testChangedState, toggleAllItems(mockIsSelectedAllItems));
    testChangedState.isAllSelected = mockIsSelectedAllItems;
    testChangedState.selectedItemQty = 4;
    testChangedState.categories[1].checkedItemQty = testChangedState.categories[1].totalItemQty;
    testChangedState.categories[2].checkedItemQty = testChangedState.categories[2].totalItemQty;
    testChangedState.approvalList = testChangedState.approvalList.map(list => {
      list.isChecked = mockIsSelectedAllItems;
      return list;
    });
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handles toggling-OFF all items available in the Approvals list', () => {
    const mockIsSelectedAllItems = false;
    const testResults = Approvals(testChangedState, toggleAllItems(mockIsSelectedAllItems));
    testChangedState.isAllSelected = mockIsSelectedAllItems;
    testChangedState.selectedItemQty = 0;
    testChangedState.categories[1].checkedItemQty = 0;
    testChangedState.categories[2].checkedItemQty = 0;
    testChangedState.approvalList = testChangedState.approvalList.map(list => {
      list.isChecked = mockIsSelectedAllItems;
      return list;
    });
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handle reset Approvals to bring the Approvals state to initial State', () => {
    const testResults = Approvals(testChangedState, resetApprovals());
    expect(testResults).toStrictEqual(testInitialState);
  });
});
