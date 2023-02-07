import { WorklistType } from './WorklistSummary';

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
  completed?: boolean;
  imageURLKey?: string;
  imageBlobKey?: string;
}
