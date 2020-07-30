export interface WorklistItemI {
  exceptionType : string;
  itemName : string;
  itemNbr : number;
  upcNbr : string;
  catgNbr : number;
  catgName : string;
  itemCount? : number;
  subCatgNbr? : number;
  subCatgName? : string;
  completedTs? : Date;
  completedUserId? : string;
  isCompleted : boolean;
  imageURLKey?: string;
  imageBlobKey?: string;
}
