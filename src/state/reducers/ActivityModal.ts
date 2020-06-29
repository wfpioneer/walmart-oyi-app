const initialState = false;

export const activityModal = (state = initialState, action: any) => {
  switch (action.type) {
    case 'ACTIVITY_MODAL/SHOW':
      return true;
    case 'ACTIVITY_MODAL/HIDE':
      return false;
    default:
      return state;
  }
};
