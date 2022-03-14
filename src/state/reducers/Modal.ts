import {
  Actions,
  HIDE_ACTIVITY_MODAL,
  HIDE_INFO_MODAL,
  SHOW_ACTIVITY_MODAL,
  SHOW_INFO_MODAL
} from '../actions/Modal';

interface ModalState {
  showModal: boolean;
  showActivity: boolean;
  content: { title: string; text: string } | null;
}
const initialState: ModalState = {
  showModal: false,
  showActivity: false,
  content: null
};

export const modal = (state = initialState, action: Actions): ModalState => {
  switch (action.type) {
    case SHOW_ACTIVITY_MODAL:
      return { ...state, showModal: true, showActivity: true };
    case HIDE_ACTIVITY_MODAL:
      return initialState;
    case SHOW_INFO_MODAL:
      return {
        ...state,
        showModal: true,
        showActivity: false,
        content: action.payload
      };
    case HIDE_INFO_MODAL:
      return initialState;
    default:
      return state;
  }
};
