import {
  CLEAR_WORKLIST_ITEMS,
  SET_WORKLIST_ITEMS,
  clearWorklistItems,
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
  it('handles resetting the worklist items from the state', () => {
    const resetApprovalsResult = clearWorklistItems();
    expect(resetApprovalsResult).toStrictEqual({
      type: CLEAR_WORKLIST_ITEMS
    });
  });
});
