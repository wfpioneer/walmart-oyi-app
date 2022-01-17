import { combineReducers } from 'redux';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { UserReducer } from './User';
import { modal } from './Modal';
import asyncReducer from './asyncAPI';
import { Global } from './Global';
import { worklist } from './Worklist';
import { ItemDetailScreen } from './ItemDetailScreen';
import { Print } from './Print';
import { Pallets } from './PalletManagement';
import { Location } from './Location';
import { SessionTimeout } from './SessionTimeout';
import { Approvals } from './Approvals';
import { SnackBar } from './SnackBar';

/**
 * This is the root reducers,this RootReducer combine all sub reducers.git
 */
const RootReducer = combineReducers({
  User: UserReducer,
  modal,
  async: asyncReducer,
  Global,
  Worklist: worklist,
  Print,
  Pallets,
  ItemDetailScreen,
  Location,
  SessionTimeout,
  Approvals,
  SnackBar
});

export default RootReducer;

// This pulls the types out of the root reducer, for typing the redux state
export type RootState = ReturnType<typeof RootReducer>;

// This cleans up the definition of the state in `useSelector(...)`
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
