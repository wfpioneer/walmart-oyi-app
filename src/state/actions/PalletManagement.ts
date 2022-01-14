export const SHOW_MANAGE_PALLET_MENU = 'PALLET_MANAGEMENT/SHOW_MANAGE_PALLET_MENU';

export const showManagePalletMenu = (show: boolean) => ({
  type: SHOW_MANAGE_PALLET_MENU,
  payload: show
} as const);

export type Actions = ReturnType<typeof showManagePalletMenu>;
