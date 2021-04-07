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
}

export enum approvalStatus {
  'Pending' = 'pending',
  'Approved' = 'approved',
  'Rejected' = 'rejected',
  'Expired' = 'expired'
}
export enum approvalRequestSource {
  'ItemDetails' = 'itemdetails',
  'Audits' = 'audits',

}
