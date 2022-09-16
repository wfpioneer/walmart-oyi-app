import {
  clearWorklistItems,
  setWorklistItems
} from '../actions/AuditWorklist';
import { AuditWorklist, AuditWorklistState, initialState } from './AuditWorklist';
import { mockToDoAuditWorklist } from '../../mockData/mockWorkList';

describe('The Manager Approvals Reducer', () => {
  // Intitial State
  const testInitialState = initialState;
  // Changed state
  const testChangedState: AuditWorklistState = {
    ...initialState,
    items: mockToDoAuditWorklist
  };
  it('handles setting the audit worklist items in state', () => {
    const testResults = AuditWorklist(testInitialState, setWorklistItems(mockToDoAuditWorklist));
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handle reset audit worklist items to initial State', () => {
    const testResults = AuditWorklist(testChangedState, clearWorklistItems());
    expect(testResults).toStrictEqual(testInitialState);
  });
});
