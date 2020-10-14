import { combineReducers } from 'redux';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { User } from './User';
import { modal } from './Modal';
import asyncReducer from './asyncAPI';
import { Global } from './Global';
import { worklist } from './Worklist';
import { ItemDetailScreen } from './ItemDetailScreen';
import { Print } from './Print';
import { Location } from './Location';
import { SessionTimeout } from './SessionTimeout'

/**
 * This is the root reducers,this RootReducer combine all sub reducers.git
 */
const RootReducer = combineReducers({
  User,
  modal,
  async: asyncReducer,
  Global,
  Worklist: worklist,
  Print,
  ItemDetailScreen,
  Location,
  SessionTimeout
});

export default RootReducer;

// This pulls the types out of the root reducer, for typing the redux state
export type RootState = ReturnType<typeof RootReducer>;

// This cleans up the definition of the state in `useSelector(...)`
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
