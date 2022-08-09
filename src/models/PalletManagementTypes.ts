export interface PalletItem {
  upcNbr: string;
  itemNbr: number | string;
  price: number;
  itemDesc: string;
  categoryNbr?: number;
  categoryDesc?: string;
  quantity: number;
  newQuantity: number;
  deleted: boolean;
  added: boolean;
  locationName?: string;
}

export interface CombinePallet {
  palletId: string;
  itemCount: number;
}

export interface PalletInfo {
  id: string;
  createDate?: string;
  expirationDate?: string;
  newExpirationDate?: string;
}

export interface Pallet {
  palletInfo: PalletInfo;
  items: PalletItem[];
}

export interface PalletItemDetails extends PalletInfo {
  items: PalletItem[]
}
