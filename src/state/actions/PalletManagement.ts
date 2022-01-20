import { Pallet } from '../../models/PalletManagementTypes';

export const TOGGLE_PALLET_MANAGEMENT_POPUP = 'PALLET_MANAGEMENT/TOGGLE_POPUP';
export const SHOW_MANAGE_PALLET_MENU = 'PALLET_MANAGEMENT/SHOW_MANAGE_PALLET_MENU';
export const SETUP_PALLET = 'PALLET_MANAGEMENT/SETUP_PALLET';
export const CLEAR_PALLET_MANAGEMENT = 'PALLET_MANAGEMENT/CLEAR_PALLET_MANAGEMENT';

export const togglePalletPopup = () => ({
  type: TOGGLE_PALLET_MANAGEMENT_POPUP
} as const);

export const showManagePalletMenu = (show: boolean) => ({
  type: SHOW_MANAGE_PALLET_MENU,
  payload: show
} as const);

export const setupPallet = (pallet: Pallet) => ({
  type: SETUP_PALLET,
  payload: pallet
} as const);

export const clearPalletManagement = () => ({
  type: CLEAR_PALLET_MANAGEMENT
} as const);

export type Actions =
ReturnType<typeof showManagePalletMenu>
  | ReturnType<typeof setupPallet>
  | ReturnType<typeof togglePalletPopup>
  | ReturnType<typeof clearPalletManagement>;
