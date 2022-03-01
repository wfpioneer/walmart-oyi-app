export interface BinningItem {
  itemNbr: number;
  itemDesc: string;
  price: number;
  upcNbr: string;
  quantity: number;
}
export interface BinningPallet {
  id: number;
  expirationDate: string;
  lastLocation?: string;
  firstItem: BinningItem;
}