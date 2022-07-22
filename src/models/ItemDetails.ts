import Location from './Location';

export interface IPickHistory {
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
}

export interface IItemHistory {
  id: number;
  date: string;
  qty: number;
}

export default ItemDetails;
