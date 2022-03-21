export interface PalletItem {
  upcNbr: string;
  itemNbr: number | string;
  price: number;
  itemDesc: string;
  categoryNbr?: number;
  categoryDesc?: string;
  quantity: number;
  newQuantity?: number;
  deleted: boolean;
  added: boolean;
}

export interface CombinePallet {
  palletId: number;
  itemCount: number;
}

export interface PalletInfo {
  id: number;
  createDate?: string;
  expirationDate?: string;
}

export interface Pallet {
  palletInfo: PalletInfo;
  items: PalletItem[];
}
