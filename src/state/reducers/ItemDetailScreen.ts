import { ACTION_COMPLETED, SETUP_SCREEN, UPDATE_PENDING_OH_QTY } from '../actions/ItemDetailScreen';

const initialState = {
  pendingOnHandsQty: null,
  exceptionType: null,
  actionCompleted: false
};

export const ItemDetailScreen = (
  state = initialState,
  action: { type: string; payload: { exceptionType?: string; pendingOHQty?: number; completed: boolean } }
) => {
  switch (action.type) {
    case SETUP_SCREEN:
      return {
        exceptionType: action.payload.exceptionType,
        pendingOnHandsQty: action.payload.pendingOHQty,
        actionCompleted: action.payload.completed
      };
    case UPDATE_PENDING_OH_QTY:
      return {
        ...state,
        pendingOnHandsQty: action.payload
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
