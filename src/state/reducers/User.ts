import User from '../../models/User';
import {
  ASSIGN_FLUFFY_FEATURES, Actions, SET_CONFIGS, USER_LOGIN, USER_LOGOUT
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
  features: [],
  configs: {
    locationManagement: false,
    locationManagementEdit: false,
    palletManagement: false
  }
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
    case SET_CONFIGS:
      return {
        ...state,
        configs: {
          locationManagement: action.payload.locationManagement || false,
          locationManagementEdit: action.payload.locMgmtEdit || false,
          palletManagement: action.payload.palletManagement || false
        }
      };
    default:
      return state;
  }
};
