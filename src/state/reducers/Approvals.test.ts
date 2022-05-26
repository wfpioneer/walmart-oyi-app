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

describe('testing Worklist reducer', () => {
  it('testing Worklist reducer', () => {
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
    let testResults = Approvals(testInitialState, setApprovalList(filteredData, headerIndices));
    expect(testResults).toStrictEqual(testChangedState);
    testResults = Approvals(testChangedState, toggleCategory(1, true));
    testChangedState.selectedItemQty = 1;
    testChangedState.categories[1].checkedItemQty = 1;
    testChangedState.approvalList[0].isChecked = true;
    testChangedState.approvalList[1].isChecked = true;
    expect(testResults).toStrictEqual(testChangedState);
    testResults = Approvals(testChangedState, toggleCategory(1, false));
    testChangedState.selectedItemQty = 0;
    testChangedState.categories[1].checkedItemQty = 0;
    testChangedState.approvalList[0].isChecked = false;
    testChangedState.approvalList[1].isChecked = false;
    expect(testResults).toStrictEqual(testChangedState);
    const mockItemNumber = 123;
    const mockIsSelected = true;
    testResults = Approvals(testChangedState, toggleItem(mockItemNumber, mockIsSelected));
    testChangedState.selectedItemQty = 1;
    testChangedState.categories[1].checkedItemQty = 1;
    testChangedState.approvalList[0].isChecked = true;
    testChangedState.approvalList[1].isChecked = true;
    expect(testResults).toStrictEqual(testChangedState);
    const mockIsSelectedAllItems = true;
    testResults = Approvals(testChangedState, toggleAllItems(mockIsSelectedAllItems));
    testChangedState.isAllSelected = true;
    testChangedState.selectedItemQty = 4;
    testChangedState.categories[1].checkedItemQty = testChangedState.categories[1].totalItemQty;
    testChangedState.categories[2].checkedItemQty = testChangedState.categories[2].totalItemQty;
    testChangedState.approvalList = testChangedState.approvalList.map(list => {
      list.isChecked = true;
      return list;
    });
    expect(testResults).toStrictEqual(testChangedState);
    testResults = Approvals(testChangedState, setApprovalList(filteredData, headerIndices));
    expect(testResults).toStrictEqual(testChangedState);
    testResults = Approvals(testChangedState, resetApprovals());
    expect(testResults).toStrictEqual(testInitialState);
  });
});
