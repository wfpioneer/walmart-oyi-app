import Location from './Location';

export default interface ItemDetails {
  image?: any;
  itemName: string;
  itemNbr: number;
  upcNbr: string;
  status: string;
  category: string;
  price: number;
  exceptionType?: string; // This is enumerated
  onHandsQty: number;
  isOnHandsPending: boolean;
  replenishment: {
    onOrder: number;
  };
  location: {
    floor?: [Location];
    reserve?: [Location];
    count: number;
  };
  sales: {
    lastUpdateTs: string;
    dailyAvgSales: number;
    daily: [
      {
        day: string;
        value: number
      }
    ];
    weeklyAvgSales: number;
    weekly: [
      {
        week: number;
        value: number
      }
    ];
  };
}
