import { BinningPallet } from '../../models/Binning';

export const ADD_PALLET = 'BINNING/ADD_PALLET';
export const DELETE_PALLET = 'BINNING/DELETE_PALLET';
export const CLEAR_PALLETS = 'BINNING/CLEAR_PALLETS';
export const SET_BIN_LOCATION = 'BINNING/SET_BIN_LOCATION';
export const CLEAR_BIN_LOCATION = 'BINNING/CLEAR_BIN_LOCATION';

export const addPallet = (pallet: BinningPallet) => ({
  type: ADD_PALLET,
  payload: pallet
} as const);

export const deletePallet = (palletId: string) => ({
  type: DELETE_PALLET,
  payload: palletId
} as const);

export const clearPallets = () => ({
  type: CLEAR_PALLETS
} as const);

export const setBinLocation = (location: number | string) => ({
  type: SET_BIN_LOCATION,
  payload: location
} as const);

export const clearBinLocation = () => ({
  type: CLEAR_BIN_LOCATION
} as const);

export type Actions =
  | ReturnType<typeof addPallet>
  | ReturnType<typeof deletePallet>
  | ReturnType<typeof clearPallets>
  | ReturnType<typeof setBinLocation>
  | ReturnType<typeof clearBinLocation>
