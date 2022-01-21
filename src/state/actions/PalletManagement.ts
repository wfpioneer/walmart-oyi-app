import { Pallet, PalletItem } from '../../models/PalletManagementTypes';

export const SHOW_MANAGE_PALLET_MENU = 'PALLET_MANAGEMENT/SHOW_MANAGE_PALLET_MENU';
export const SETUP_PALLET = 'PALLET_MANAGEMENT/SETUP_PALLET';
export const CLEAR_PALLET_MANAGEMENT = 'PALLET_MANAGEMENT/CLEAR_PALLET_MANAGEMENT';
export const ADD_PALLET = 'PALLET_MANAGEMENT/ADD_PALLET';

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

export const addItemToPallet = (palletItem: PalletItem) => ({
  type: ADD_PALLET,
  payload: palletItem
} as const);

export type Actions =
  ReturnType<typeof showManagePalletMenu>
  | ReturnType<typeof setupPallet>
  | ReturnType<typeof clearPalletManagement>
  | ReturnType<typeof addItemToPallet>;
