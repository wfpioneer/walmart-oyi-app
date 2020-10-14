const initialState = null;

export const SessionTimeout = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SESSION/ENDTIME':
      return {
        ...action.payload
      };
    case 'SESSION/CLEAR':
      return initialState;
    default:
      return state;
  };
};
