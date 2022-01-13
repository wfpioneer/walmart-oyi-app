export interface PalletItems {
  upcNbr: string,
  itemNbr: number,
  price: number,
  itemDesc: string,
  category?: number,
  categoryDesc?: string,
  quantity: number,
  newQuantity?: number,
  deleted?: boolean,
  added?: boolean
}
export interface PalletInfo {
  palletId: number;
  expirationDate?: string
}
