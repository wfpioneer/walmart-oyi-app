export interface ItemPalletInfo {
  palletId: number,
  quantity: number,
  sectionId: number,
  locationName: string,
  mixedPallet: boolean,
  newQty: number,
  scanned?: boolean
}
