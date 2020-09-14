export const SETUP_SCREEN = 'ITEM_DETAILS_SCREEN/SETUP';
export const ACTION_COMPLETED = 'ITEM_DETAILS_SCREEN/ACTION_COMPLETED';
export const UPDATE_PENDING_OH_QTY = 'ITEM_DETAILS_SCREEN/UPDATE_PENDING_OH_QTY';

export const setupScreen = (exceptionType: string | undefined, pendingOHQty: number | undefined) => ({
  type: SETUP_SCREEN,
  payload: {
    exceptionType,
    pendingOHQty
  }
});

export const updatePendingOHQty = (pendingOHQty: number) => ({
  type: UPDATE_PENDING_OH_QTY,
  payload: pendingOHQty
});

export const setActionCompleted = () => ({
  type: ACTION_COMPLETED
});
