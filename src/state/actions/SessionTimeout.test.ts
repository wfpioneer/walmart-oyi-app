import {
  SESSION_CLEAR,
  SESSION_ENDTIME,
  clearEndTime,
  setEndTime
} from './SessionTimeout';

describe('test action creators for SessionTimeout', () => {
  it('test action creators for SessionTimeout', () => {
    const testSessionId = 1652345022;
    // setEndTime action
    const setEndTimeResult = setEndTime(testSessionId);
    expect(setEndTimeResult).toStrictEqual({
      type: SESSION_ENDTIME,
      payload: testSessionId
    });
    // clearEndTime action
    const clearEndTimeResult = clearEndTime();
    expect(clearEndTimeResult).toStrictEqual({ type: SESSION_CLEAR });
  });
});
