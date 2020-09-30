export interface WorklistItemI {
  worklistType : string;
  itemName? : string;
  itemNbr? : number;
  upcNbr? : string;
  catgNbr? : number;
  catgName : string;
  itemCount? : number;
  subCatgNbr? : number;
  subCatgName? : string;
  completedTs? : Date;
  completedUserId? : string;
  completed? : boolean;
  imageURLKey?: string;
  imageBlobKey?: string;
}
