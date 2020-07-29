const initialState = {
  menuOpen: false
};

export const worklistFilter = (state = initialState, action: any) => {
  switch (action.type) {
    case 'WORKLIST_FILTER_MENU/SHOW':
      return {
        ...state,
        menuOpen: true
      };
    case 'WORKLIST_FILTER_MENU/HIDE':
      return {
        ...state,
        menuOpen: false
      };
    default:
      return state;
  }
};
