import {
  CLEAR_WORKLIST_ITEMS,
  SET_AUDIT_ITEM_NUMBER,
  SET_WORKLIST_ITEMS,
  clearWorklistItems,
  setAuditItemNumber,
  setWorklistItems
} from './AuditWorklist';
import { mockToDoAuditWorklist } from '../../mockData/mockWorkList';

describe('Audit Worklist actions', () => {
  it('handles setting audit worklist items i redux state', () => {
    const testData = mockToDoAuditWorklist;
    const setWorklistItemsResult = setWorklistItems(testData);
    expect(setWorklistItemsResult).toStrictEqual({
      type: SET_WORKLIST_ITEMS,
      payload: testData
    });
  });
  it('handles setting audit item number in redux state', () => {
    const setAuditItemNumberResult = setAuditItemNumber(1234);
    expect(setAuditItemNumberResult).toStrictEqual({
      type: SET_AUDIT_ITEM_NUMBER,
      payload: 1234
    });
  });
  it('handles resetting the worklist items from the state', () => {
    const resetApprovalsResult = clearWorklistItems();
    expect(resetApprovalsResult).toStrictEqual({
      type: CLEAR_WORKLIST_ITEMS
    });
  });
});
