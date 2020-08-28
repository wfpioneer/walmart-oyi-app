export const SHOW_ACTIVITY_MODAL = 'MODAL/SHOW_ACTIVITY';
export const HIDE_ACTIVITY_MODAL = 'MODAL/HIDE_ACTIVITY';

export const SHOW_INFO_MODAL = 'MODAL/SHOW_INFO_MODAL';
export const HIDE_INFO_MODAL = 'MODAL/HIDE_INFO_MODAL';

export const showActivityModal = () => ({
  type: SHOW_ACTIVITY_MODAL
});

export const hideActivityModal = () => ({
  type: HIDE_ACTIVITY_MODAL
});

export const showInfoModal = (title: string, text: string) => ({
  type: SHOW_INFO_MODAL,
  payload: { title, text }
});

export const hideInfoModal = () => ({
  type: HIDE_INFO_MODAL
});
