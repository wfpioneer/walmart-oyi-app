export interface ApprovalListItem {
  imageUrl?: string;
  itemName: string;
  itemNbr: number;
  upcNbr: string;
  userId: string;
  categoryNbr: number;
  subCategoryNbr: number;
  oldQuantity: number;
  newQuantity: number;
  dollarChange: number;
  approvalRequestSource: string;
  approvalStatus: string;
  daysLeft: number;
}
