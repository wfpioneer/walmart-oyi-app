import { ACTION_COMPLETED, SETUP_SCREEN } from '../actions/ItemDetailScreen';

const initialState = {
  exceptionType: null,
  actionCompleted: false
};

export const ItemDetailScreen = (
  state = initialState,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case SETUP_SCREEN:
      return {
        exceptionType: action.payload,
        actionCompleted: !action.payload
      };
    case ACTION_COMPLETED:
      return {
        ...state,
        actionCompleted: true
      };
    default:
      return state;
  }
};
