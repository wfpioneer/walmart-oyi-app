import Location from './Location';

interface ItemDetails {
  image?: any;
  itemName: string;
  itemNbr: number;
  upcNbr: string;
  status: string;
  categoryNbr: number;
  categoryDesc: string;
  price: number;
  exceptionType?: string; // This is enumerated
  completed: boolean;
  onHandsQty: number;
  pendingOnHandsQty: number;
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

export default ItemDetails;
