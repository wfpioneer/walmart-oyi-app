import { Actions } from '../actions/SessionTimeout';

const initialState = null;

export const SessionTimeout = (state = initialState, action: Actions): number | null => {
  switch (action.type) {
    case 'SESSION/ENDTIME':
      return action.payload;
    case 'SESSION/CLEAR':
      return initialState;
    default:
      return state;
  }
};
