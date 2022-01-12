import { PalletInfo, PalletItems } from '../../models/PalletItem';

export const SET_PALLET_INFO = 'PALLET/SET_PALLET_INFO';
export const SET_PALLET_ITEMS = 'PALLET/SET_PALLET_ITEMS';

export const setPalletInfo = (palletInfo: PalletInfo) => ({
  type: SET_PALLET_INFO,
  payload: palletInfo
} as const);

export const setPalletItems = (palletItems: PalletItems[]) => ({
  type: SET_PALLET_ITEMS,
  payload: palletItems
} as const);

export type Actions =
  ReturnType<typeof setPalletInfo>
  | ReturnType<typeof setPalletItems>
