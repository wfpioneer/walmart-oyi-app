import { WorklistType } from './WorklistSummary';

// eslint-disable-next-line no-shadow
export enum WorkListStatus {
  TODO = 'TODO',
  INPROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}
export type ActionTaken = 'QTY_UPDATE' | 'ADD_TO_PICKLIST';

export interface WorklistItemI {
  worklistType: WorklistType;
  itemName?: string;
  itemNbr?: number;
  upcNbr?: string;
  catgNbr?: number;
  catgName: string;
  itemCount?: number;
  subCatgNbr?: number;
  subCatgName?: string;
  completedTs?: string;
  completedUserId?: string;
// TODO REMOVE COMPLETED WHEN IMPLEMENTING NEW WORKLIST API CALLS https://jira.walmart.com/browse/INTLSAOPS-9156
  completed?: boolean;
  imageURLKey?: string;
  imageBlobKey?: string;
  worklistStatus?: WorkListStatus;
  actionTaken?: ActionTaken;
}
