export interface ApprovalListItem {
  imageUrl?: string;
  itemName: string;
  itemNbr: number;
  upcNbr: number;
  categoryNbr: number;
  categoryDescription: string;
  subCategoryNbr: number;
  subCategoryDescription: string;
  oldQuantity: number;
  newQuantity: number;
  dollarChange: number;
  initiatedUserId: string;
  initiatedTimestamp: string;
  approvalStatus: approvalStatus;
  approvalRequestSource: approvalRequestSource;
  isChecked?: boolean;
  daysLeft?: number;
}

export interface ApprovalCategory extends ApprovalListItem {
  categoryHeader?: boolean;
}

export enum approvalStatus {
  'Pending' = 'Pending',
  'Approved' = 'Approved',
  'Rejected' = 'Rejected',
  'Expired' = 'Expired'
}
export enum approvalRequestSource {
  'ItemDetails' = 'itemdetails',
  'Audits' = 'audits',

}
