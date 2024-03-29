export interface BinningItem {
  itemNbr: number;
  itemDesc: string;
  price?: number;
  upcNbr: string;
  quantity?: number;
}
export interface BinningPallet {
  id: string;
  expirationDate?: string;
  lastLocation?: string;
  createDate?: string;
  items: BinningItem[];
}
