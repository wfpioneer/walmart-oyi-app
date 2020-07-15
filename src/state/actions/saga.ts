export const HIT_GOOGLE = 'SAGA/HIT_GOOGLE';
export const GET_ITEM_DETAILS = 'SAGA/GET_ITEM_DETAILS'

export const hitGoogle = (payload: any) => ({ type: HIT_GOOGLE, payload });
export const getItemDetails = (payload: any) => ({ type: GET_ITEM_DETAILS, payload })
