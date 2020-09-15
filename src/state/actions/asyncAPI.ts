import { makeAsyncActionCreators, makeAsyncActionTypes } from './generic/makeAsyncActions';

export const HIT_GOOGLE = makeAsyncActionTypes('API/HIT_GOOGLE');
export const hitGoogle = makeAsyncActionCreators(HIT_GOOGLE);

export const GET_ITEM_DETAILS = makeAsyncActionTypes('API/GET_ITEM_DETAILS');
export const getItemDetails = makeAsyncActionCreators(GET_ITEM_DETAILS);

export const GET_WORKLIST = makeAsyncActionTypes('API/GET_WORKLIST');
export const getWorklist = makeAsyncActionCreators(GET_WORKLIST);

export const UPDATE_OH_QTY = makeAsyncActionTypes('API/UPDATE_OH_QTY');
export const updateOHQty = makeAsyncActionCreators(UPDATE_OH_QTY);

export const ADD_TO_PICKLIST = makeAsyncActionTypes('API/ADD_TO_PICKLIST');
export const addToPicklist = makeAsyncActionCreators(ADD_TO_PICKLIST);
