export const SHOW_SNACKBAR = 'SNACKBAR/SHOW_SNACKBAR';
export const HIDE_SNACKBAR = 'SNACKBAR/HIDE_SNACKBAR';

export const showSnackBar = (text: string, duration?: number) => ({
  type: SHOW_SNACKBAR,
  payload: { text, duration }
} as const);

export const hideSnackBar = () => ({
  type: HIDE_SNACKBAR
} as const);

export type Actions =
| ReturnType<typeof showSnackBar>
| ReturnType<typeof hideSnackBar>;
