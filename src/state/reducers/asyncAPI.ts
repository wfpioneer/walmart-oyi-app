import { combineReducers } from 'redux';
import { makeAsyncReducer } from './generic/makeAsyncReducer';
import * as asyncActions from '../actions/asyncAPI';

// @ts-ignore
export const asyncReducer = combineReducers({
  hitGoogle: makeAsyncReducer(asyncActions.HIT_GOOGLE)
});

export default asyncReducer;
