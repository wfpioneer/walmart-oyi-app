import {
  Actions, HIDE_SNACKBAR, SHOW_SNACKBAR
} from '../actions/SnackBar';

interface SnackBarState {
  showSnackBar: boolean;
  messageContent: string;
  duration: number;
}
export const initialState: SnackBarState = {
  showSnackBar: false,
  messageContent: '',
  duration: 5000
};

export const SnackBar = (state = initialState, action: Actions): SnackBarState => {
  switch (action.type) {
    case SHOW_SNACKBAR: {
      return {
        ...state,
        showSnackBar: true,
        messageContent: action.payload.text,
        duration: action.payload.duration
      };
    }
    case HIDE_SNACKBAR: {
      return {
        ...state,
        showSnackBar: false
      };
    }
    default:
      return state;
  }
};
