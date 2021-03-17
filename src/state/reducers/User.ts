const initialState = {
  isManager: false,
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
        ...action.payload,
        isManager: false
      };
    case 'USER/LOGOUT':
      return initialState;
    case 'USER/ASSIGN_FLUFFY_ROLES':
      return {
        ...state,
        isManager: action.payload.contains('manager approval')
      };
    default:
      return state;
  }
};
