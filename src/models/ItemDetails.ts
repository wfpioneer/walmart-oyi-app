import Location from './Location';
import { approvalRequestSource, approvalStatus } from './ApprovalListItem';

export interface OHChangeHistory {
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

export interface PickHistory {
  id:number,
  itemNbr: number,
  upcNbr: number,
  itemDesc: string,
  itemQty: number,
  category: string,
  quickPick: boolean,
  salesFloorLocationName: string,
  salesFloorLocationId: number,
  moveToFront: boolean,
  assignedAssociate: string,
  palletId: number,
  palletLocationName: string,
  palletLocationId: number,
  status: string,
  createdBy: string,
  createTS: string
}

interface ItemDetails {
  code: number;
  message?: string;
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
  size: number;
  color: string;
  grossProfit: number;
  vendorPackQty: number;
  margin: number;
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
    error?: string
  };
  deliveryHistory: {
    deliveries: {
      date: string;
      qty: number;
    }[];
    error?: string;
  }
}
export interface ItemOHChangeHistory {
  code: number;
  message?: string;
  ohChangeHistory?: OHChangeHistory[];
}

export interface PicklistHistory {
  code: number;
  message?: string;
  picklists?: PickHistory[]
}

export interface ItemHistoryI {
  id: number;
  date: string;
  qty: number;
}

export default ItemDetails;
