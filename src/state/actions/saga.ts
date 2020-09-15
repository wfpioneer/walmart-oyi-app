export const HIT_GOOGLE = 'SAGA/HIT_GOOGLE';
export const GET_ITEM_DETAILS = 'SAGA/GET_ITEM_DETAILS';
export const GET_WORKLIST = 'SAGA/GET_WORKLIST';
export const EDIT_LOCATION = 'SAGA/EDIT_LOCATION';

export const hitGoogle = (payload: any) => ({ type: HIT_GOOGLE, payload });
export const getItemDetails = (payload: any) => ({ type: GET_ITEM_DETAILS, payload });
export const getWorklist = () => ({ type: GET_WORKLIST });
export const editLocation = (payload: any) => ({type: EDIT_LOCATION});
