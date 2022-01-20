import { CombinePallet, Pallet } from '../../models/PalletManagementTypes';

export const SHOW_MANAGE_PALLET_MENU = 'PALLET_MANAGEMENT/SHOW_MANAGE_PALLET_MENU';
export const SETUP_PALLET = 'PALLET_MANAGEMENT/SETUP_PALLET';
export const CLEAR_PALLET_MANAGEMENT = 'PALLET_MANAGEMENT/CLEAR_PALLET_MANAGEMENT';
export const ADD_COMBINE_PALLET = 'PALLET_MANAGEMENT/ADD_COMBINE_PALLET';
export const CLEAR_COMBINE_PALLET = 'PALLET_MANAGEMENT/CLEAR_COMBINE_PALLET';
export const REMOVE_COMBINE_PALLET = 'PALLET_MANAGEMENT/REMOVE_COMBINE_PALLET';

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

export const addCombinePallet = (pallet: CombinePallet) => ({
  type: ADD_COMBINE_PALLET,
  payload: pallet
} as const);

export const clearCombinePallet = () => ({
  type: CLEAR_COMBINE_PALLET
} as const);

export const removeCombinePallet = (palletId: number) => ({
  type: REMOVE_COMBINE_PALLET,
  payload: palletId
} as const);

export type Actions =
ReturnType<typeof showManagePalletMenu>
  | ReturnType<typeof setupPallet>
  | ReturnType<typeof clearPalletManagement>
  | ReturnType<typeof addCombinePallet>
  | ReturnType<typeof clearCombinePallet>
  | ReturnType<typeof removeCombinePallet>;
