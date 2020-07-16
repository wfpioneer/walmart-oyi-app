import { combineReducers } from 'redux';
import { User } from './User';
import { activityModal } from './ActivityModal';
import asyncReducer from './asyncAPI';
import { Global } from './Global';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

/**
 * This is the root reducers,this RootReducer combine all sub reducers.git
 */
const RootReducer = combineReducers({
  User,
  activityModal,
  async: asyncReducer,
  Global
});

export default RootReducer;

// This pulls the types out of the root reducer, for typing the redux state
export type RootState = ReturnType<typeof RootReducer>;

// This cleans up the definition of the state in `useSelector(...)`
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
