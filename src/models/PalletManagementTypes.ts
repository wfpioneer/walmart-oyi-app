export interface PalletItem {
  upcNbr: string;
  itemNbr: number | string;
  price: number;
  itemDesc: string;
  category?: number;
  categoryDesc?: string;
  quantity: number;
  newQuantity?: number;
  deleted: boolean;
  added: boolean;
  categoryNbr?: number;
}

export interface CombinePallet {
  palletId: number;
  itemCount: number;
}

export interface PalletInfo {
  id: number;
  createDate?: string;
  expirationDate?: string;
  newExpirationDate?: string;
}

export interface Pallet {
  palletInfo: PalletInfo;
  items: PalletItem[];
}
