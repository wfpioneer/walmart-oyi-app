export const HIT_GOOGLE = 'SAGA/HIT_GOOGLE';
export const GET_ITEM_DETAILS = 'SAGA/GET_ITEM_DETAILS';
export const GET_WORKLIST = 'SAGA/GET_WORKLIST';
export const ADD_TO_PICKLIST = 'SAGA/ADD_TO_PICKLIST';
export const GET_WORKLIST_SUMMARY = 'SAGA/GET_WORKLIST_SUMMARY';

export const hitGoogle = (payload: any) => ({ type: HIT_GOOGLE, payload });
export const getItemDetails = (payload: any) => ({ type: GET_ITEM_DETAILS, payload });
export const getWorklist = () => ({ type: GET_WORKLIST });
export const addToPicklist = (payload: any) => ({ type: ADD_TO_PICKLIST, payload });
export const getWorklistSummary = (payload: any) => ({ type: GET_WORKLIST_SUMMARY, payload });
