/* eslint-disable no-shadow */
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
  resolvedTimestamp?: string; // This is used in the request body for the approve/reject API call
}

export interface ApprovalCategory extends ApprovalListItem {
  categoryHeader?: boolean;
}

export enum approvalStatus {
  'Pending' = 'Pending',
  'Approved' = 'Approved',
  'Rejected' = 'Rejected',
  'Expired' = 'Expired',
  'Outdated' = 'Outdated'
}
export enum approvalRequestSource {
  'ItemDetails' = 'itemdetails',
  'Audits' = 'audits',
}

export enum approvalAction {
  'Approve' = 'Aprv',
  'Reject' = 'Rejc',
  'Expired' = 'Exp'
}
