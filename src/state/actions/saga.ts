export const HIT_GOOGLE = 'SAGA/HIT_GOOGLE';
export const GET_ITEM_DETAILS = 'SAGA/GET_ITEM_DETAILS'
export const GET_WORKLIST = 'SAGA/GET_WORKLIST';
export const UPDATE_OH_QTY = 'SAGA/UPDATE_OH_QTY';

export const hitGoogle = (payload: any) => ({ type: HIT_GOOGLE, payload });
export const getItemDetails = (payload: any) => ({ type: GET_ITEM_DETAILS, payload });
export const getWorklist = () => ({ type: GET_WORKLIST });
export const updateOHQty = (payload: any) => ({ type: UPDATE_OH_QTY, payload });
