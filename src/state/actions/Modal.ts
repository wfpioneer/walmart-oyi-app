export const SHOW_ACTIVITY_MODAL = 'MODAL/SHOW_ACTIVITY';
export const HIDE_ACTIVITY_MODAL = 'MODAL/HIDE_ACTIVITY';

export const SHOW_INFO_MODAL = 'MODAL/SHOW_INFO_MODAL';
export const HIDE_INFO_MODAL = 'MODAL/HIDE_INFO_MODAL';

export const showActivityModal = () => ({
  type: SHOW_ACTIVITY_MODAL
} as const);

export const hideActivityModal = () => ({
  type: HIDE_ACTIVITY_MODAL
} as const);

export const showInfoModal = (title: string, text: string) => ({
  type: SHOW_INFO_MODAL,
  payload: { title, text }
} as const);

export const hideInfoModal = () => ({
  type: HIDE_INFO_MODAL
} as const);

export type Actions =
  | ReturnType<typeof showActivityModal>
  | ReturnType<typeof hideActivityModal>
  | ReturnType<typeof showInfoModal>
  | ReturnType<typeof hideInfoModal>;
