export interface PalletItem {
  upc: string;
  itemNbr: number | string;
  price: number;
  description: string;
  category: number;
  categoryDesc: string;
  quantity: number;
  newQuantity: number;
  deleted: boolean;
  added: boolean;
}

export interface CombinePallet {
  palletId: number;
  itemCount: number;
}

export interface PalletInfo {
  palletId: number;
  expirationDate?: string;
}

export interface Pallet {
  palletInfo: PalletInfo;
  items: PalletItem[];
}