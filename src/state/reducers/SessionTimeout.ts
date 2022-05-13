import { Actions, SESSION_CLEAR, SESSION_ENDTIME } from '../actions/SessionTimeout';

const initialState = null;

export const SessionTimeout = (state = initialState, action: Actions): number | null => {
  switch (action.type) {
    case SESSION_ENDTIME:
      return action.payload;
    case SESSION_CLEAR:
      return initialState;
    default:
      return state;
  }
};
