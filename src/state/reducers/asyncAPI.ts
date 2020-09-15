import { combineReducers } from 'redux';
import { makeAsyncReducer } from './generic/makeAsyncReducer';
import * as asyncActions from '../actions/asyncAPI';

// @ts-ignore
export const asyncReducer = combineReducers({
  hitGoogle: makeAsyncReducer(asyncActions.HIT_GOOGLE),
  getItemDetails: makeAsyncReducer(asyncActions.GET_ITEM_DETAILS),
  getWorklist: makeAsyncReducer(asyncActions.GET_WORKLIST),
  editLocation: makeAsyncReducer(asyncActions.EDIT_LOCATION),
  addToPicklist: makeAsyncReducer(asyncActions.ADD_TO_PICKLIST)
});

export default asyncReducer;
