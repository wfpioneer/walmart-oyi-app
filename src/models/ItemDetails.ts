import Location from './Location';
import { approvalRequestSource, approvalStatus } from './ApprovalListItem';

export interface IOHChangeHistory {
  id : number;
  itemName : string;
  itemNbr : number;
  upcNbr : number;
  categoryNbr : number;
  categoryDescription : string;
  subCategoryNbr : number;
  subCategoryDescription : string;
  oldQuantity : number;
  newQuantity : number;
  dollarChange : number;
  daysLeft: number;
  initiatedUserId : string;
  initiatedTimestamp : string;
  approvalStatus : approvalStatus;
  approvalRequestSource : approvalRequestSource;
}

interface ItemDetails {
  itemName: string;
  itemNbr: number;
  upcNbr: string;
  status?: string;
  categoryNbr: number;
  categoryDesc: string;
  price: number;
  basePrice: number
  exceptionType?: string; // This is enumerated
  imageUrlKey?: string;
  imageBlobKey?: string;
  completed: boolean;
  onHandsQty: number;
  pendingOnHandsQty: number;
  consolidatedOnHandQty: number;
  claimsOnHandQty: number;
  backroomQty: number;
  cloudQty?: number;
  inTransitCloudQty?: number;
  replenishment: {
    onOrder: number;
  };
  location: {
    floor?: Location[];
    reserve?: Location[];
    count: number;
  };
  sales: {
    lastUpdateTs: string;
    dailyAvgSales: number;
    daily: {
      day: string;
      value: number;
    }[];
    weeklyAvgSales: number;
    weekly: {
      week: number;
      value: number;
    }[];
  };
  ohChangeHistory: IOHChangeHistory[];
}

export default ItemDetails;
