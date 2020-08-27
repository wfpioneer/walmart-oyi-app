import { HIDE_ACTIVITY_MODAL, SHOW_ACTIVITY_MODAL } from '../actions/Modal';

const initialState = {
  showModal: false,
  showActivity: false
};

export const modal = (state = initialState, action: any) => {
  switch (action.type) {
    case SHOW_ACTIVITY_MODAL:
      return { ...state, showModal: true, showActivity: true };
    case HIDE_ACTIVITY_MODAL:
      return { ...state, showModal: false, showActivity: false };
    default:
      return state;
  }
};
