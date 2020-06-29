const initialState = {
  additional: {
    clockCheckResult: null,
    displayName: null,
    loginId: null,
    mailId: null
  },
  countryCode: null,
  domain: null,
  siteId: null,
  token: null,
  userId: null
};

export const User = (state = initialState, action: any) => {
  switch (action.type) {
    case 'USER/LOGIN':
      return {
        ...action.payload
      };
    case 'USER/LOGOUT':
      return initialState;
    default:
      return state;
  }
};
