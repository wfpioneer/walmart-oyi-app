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

export type MissingPalletWorklistType = 'MP';

export interface MissingPalletWorklistItemI {
  worklistType: MissingPalletWorklistType;
  palletId: number;
  lastKnownLocationId: number;
  lastKnownLocationName: string;
  createId: string;
  createTS: string;
  palletDeleted: boolean;
  completed?: boolean;
  completedTS?: string;
  completedId?: string;
}
