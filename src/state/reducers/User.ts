import User from '../../models/User';
import {
  ASSIGN_FLUFFY_FEATURES, Actions, USER_LOGIN, USER_LOGOUT
} from '../actions/User';

const initialState: User = {
  additional: {
    clockCheckResult: '',
    displayName: '',
    loginId: '',
    mailId: ''
  },
  countryCode: '',
  domain: '',
  siteId: 0,
  token: '',
  userId: '',
  features: []
};

export const UserReducer = (state = initialState, action: Actions): User => {
  switch (action.type) {
    case USER_LOGIN:
      return {
        ...action.payload,
        features: []
      };
    case USER_LOGOUT:
      return initialState;
    case ASSIGN_FLUFFY_FEATURES:
      return {
        ...state,
        features: action.payload
      };
    default:
      return state;
  }
};
