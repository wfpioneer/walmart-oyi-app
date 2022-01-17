export const SHOW_PALLET_MANAGEMENT_POPUP = 'PALLET_MANAGEMENT/SHOW_POPUP';
export const HIDE_PALLET_MANAGEMENT_POPUP = 'PALLET_MANAGEMENT/HIDE_POPUP';
export const TOGGLE_PALLET_MANAGEMENT_POPUP = 'PALLET_MANAGEMENT/TOGGLE_POPUP';

export const showPalletPopup = () => ({
  type: SHOW_PALLET_MANAGEMENT_POPUP
} as const);

export const hidePalletPopup = () => ({
  type: HIDE_PALLET_MANAGEMENT_POPUP
} as const);

export const togglePalletPopup = () => ({
  type: TOGGLE_PALLET_MANAGEMENT_POPUP
} as const);

export type Actions =
  | ReturnType<typeof showPalletPopup>
  | ReturnType<typeof hidePalletPopup>
  | ReturnType<typeof togglePalletPopup>
