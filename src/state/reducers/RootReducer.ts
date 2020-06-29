import { combineReducers } from 'redux';
import { User } from './User';
import { activityModal } from './ActivityModal';
import asyncReducer from './asyncAPI';

/**
 * This is the root reducers,this RootReducer combine all sub reducers.git
 */
const RootReducer = combineReducers({
  User,
  activityModal,
  async: asyncReducer
});

export default RootReducer;
