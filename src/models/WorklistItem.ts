export interface WorklistItemI {
  worklistType: string;
  itemName? : string;
  itemNbr? : number;
  upcNbr? : string;
  catgNbr? : number;
  catgName: string;
  itemCount? : number;
  subCatgNbr? : number;
  subCatgName? : string;
  completedTs? : string;
  completedUserId? : string;
  completed? : boolean;
  imageURLKey?: string;
  imageBlobKey?: string;
}

export type PalletWorklistType = 'MP';

export interface MissingPalletWorklistItemI {
  worklistType?: PalletWorklistType;
  palletId: number;
  lastKnownPalletLocationId: number;
  lastKnownPalletLocationName: string;
  createUserId: string;
  createTs: string;
  palletDeleted: boolean;
  completed: boolean;
  completedTs?: string;
  completedUserId?: string;
}
