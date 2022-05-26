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

describe('Manager Approvals action reducer', () => {
  it('handles toggling-ON action for a item in Approvals list', () => {
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
  });
  it('handles toggling-OFF action for a item in Approvals list', () => {
    const testItemNbr = 250589;
    const testIsSelected = false;
    const testToggleItemPayload = {
      itemNbr: testItemNbr,
      isSelected: testIsSelected
    };
    const toggleItemResult = toggleItem(testItemNbr, testIsSelected);
    expect(toggleItemResult).toStrictEqual({
      type: TOGGLE_ITEM,
      payload: testToggleItemPayload
    });
  });
  it('handles toggling-ON action for a category of Approvals', () => {
    const testCategoryNbr = 2;
    const testIsSelected = true;
    const testToggleCategoryPayload = {
      categoryNbr: 2,
      isSelected: testIsSelected
    };
    const toggleCategoriesResult = toggleCategory(testCategoryNbr, testIsSelected);
    expect(toggleCategoriesResult).toStrictEqual({
      type: TOGGLE_CATEGORY,
      payload: testToggleCategoryPayload
    });
  });
  it('handles toggling-OFF action for a category of Approvals', () => {
    const testCategoryNbr = 2;
    const testIsSelected = false;
    const testToggleCategoryPayload = {
      categoryNbr: 2,
      isSelected: testIsSelected
    };
    const toggleCategoriesResult = toggleCategory(testCategoryNbr, testIsSelected);
    expect(toggleCategoriesResult).toStrictEqual({
      type: TOGGLE_CATEGORY,
      payload: testToggleCategoryPayload
    });
  });
  it('handles toggling-ON action for all items in Approvals list', () => {
    const testSelectAll = true;
    const toggleAllItemsResult = toggleAllItems(testSelectAll);
    expect(toggleAllItemsResult).toStrictEqual({
      type: TOGGLE_ALL_ITEMS,
      payload: {
        selectAll: testSelectAll
      }
    });
  });
  it('handles toggling-OFF action for all items in Approvals list', () => {
    const testSelectAll = false;
    const toggleAllItemsResult = toggleAllItems(testSelectAll);
    expect(toggleAllItemsResult).toStrictEqual({
      type: TOGGLE_ALL_ITEMS,
      payload: {
        selectAll: testSelectAll
      }
    });
  });
  it('handles setApprovalList action for showing the Approvals list in the Approval screen', () => {
    const setApprovalListResult = setApprovalList(mockApprovals, [0]);
    expect(setApprovalListResult).toStrictEqual({
      type: SET_APPROVAL_LIST,
      payload: {
        approvals: mockApprovals,
        headerIndices: [0]
      }
    });
  });
  it('handles resetApprovals action to reset the Approval list to its initial state', () => {
    const resetApprovalsResult = resetApprovals();
    expect(resetApprovalsResult).toStrictEqual({
      type: RESET_APPROVALS
    });
  });
});
