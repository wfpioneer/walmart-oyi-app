import {
  RESET_APPROVALS,
  SET_APPROVAL_LIST,
  TOGGLE_ALL_ITEMS,
  TOGGLE_CATEGORY,
  TOGGLE_ITEM,
  resetApprovals,
  setApprovalList,
  toggleAllItems,
  toggleCategory,
  toggleItem
} from './Approvals';
import { mockApprovals } from '../../mockData/mockApprovalList';

describe('test action creators for Worklist', () => {
  it('test action creators for Worklist', () => {
    // toggleItem action
    const testItemNbr = 250589;
    const testIsSelected = true;
    const testToggleItemPayload = {
      itemNbr: testItemNbr,
      isSelected: testIsSelected
    };
    const toggleItemResult = toggleItem(testItemNbr, testIsSelected);
    expect(toggleItemResult).toStrictEqual({
      type: TOGGLE_ITEM,
      payload: testToggleItemPayload
    });
    // toggleCategory action
    const testCategoryNbr = 2;
    const testToggleCategoryPayload = {
      categoryNbr: 2,
      isSelected: false
    };
    const toggleCategoriesResult = toggleCategory(testCategoryNbr, false);
    expect(toggleCategoriesResult).toStrictEqual({
      type: TOGGLE_CATEGORY,
      payload: testToggleCategoryPayload
    });
    // toggleAllItems action
    const testSelectAll = true;
    const toggleAllItemsResult = toggleAllItems(testSelectAll);
    expect(toggleAllItemsResult).toStrictEqual({
      type: TOGGLE_ALL_ITEMS,
      payload: {
        selectAll: testSelectAll
      }
    });
    // setApprovalList action
    const setApprovalListResult = setApprovalList(mockApprovals, [0]);
    expect(setApprovalListResult).toStrictEqual({
      type: SET_APPROVAL_LIST,
      payload: {
        approvals: mockApprovals,
        headerIndices: [0]
      }
    });
    // resetApprovals action
    const resetApprovalsResult = resetApprovals();
    expect(resetApprovalsResult).toStrictEqual({
      type: RESET_APPROVALS
    });
  });
});
