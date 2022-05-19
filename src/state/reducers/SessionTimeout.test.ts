import {
  clearEndTime,
  setEndTime
} from '../actions/SessionTimeout';
import { SessionTimeout } from './SessionTimeout';

describe('testing SessionTimeout reducer', () => {
  it('testing SessionTimeout reducer', () => {
    const testSessionId = 1652349922;
    // Intitial State
    const testInitialState = null;
    // Changed state
    const testChangedState = testSessionId;
    // setEndTime action
    let testResults = SessionTimeout(testInitialState, setEndTime(testSessionId));
    expect(testResults).toStrictEqual(testChangedState);
    // clearEndTime action
    testResults = SessionTimeout(testInitialState, clearEndTime());
    expect(testResults).toStrictEqual(testInitialState);
  });
});
