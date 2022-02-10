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
}
