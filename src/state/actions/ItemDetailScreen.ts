export const SETUP_SCREEN = 'ITEM_DETAILS_SCREEN/SETUP';
export const ACTION_COMPLETED = 'ITEM_DETAILS_SCREEN/ACTION_COMPLETED';

export const setupScreen = (exceptionType: string | undefined) => ({
  type: SETUP_SCREEN,
  payload: exceptionType
});

export const setActionCompleted = () => ({
  type: ACTION_COMPLETED
});
