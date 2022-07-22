import ItemDetails, { OHChangeHistory } from '../models/ItemDetails';
import { approvalRequestSource, approvalStatus } from '../models/ApprovalListItem';
/* eslint-disable quote-props */

enum LOCATION_TYPES {
  SALES_FLOOR = 'Sales Floor',
  DISPLAY = 'Display',
  POD = 'Pod',
  END_CAP = 'End Cap',
  RESERVE = 'Reserve'
}

enum SALES_DAYS {
  DAY1 = '2020-07-08',
  DAY2 = '2020-07-09',
  DAY3 = '2020-07-10',
  DAY4 = '2020-07-11',
  DAY5 = '2020-07-12',
  DAY6 = '2020-07-13',
  DAY7 = '2020-07-14'
}

const SALES_LAST_UPDATE_TS = '2020-07-15T08:02:17-05:00';

export default {
  '123': {
    itemName: 'Test Item That is Really, Really Long (and has parenthesis)',
    itemNbr: 1234567890,
    upcNbr: '000055559999',
    status: 'Active',
    categoryNbr: 93,
    categoryDesc: 'Meat PI',
    price: 2000.94,
    basePrice: 1500.30,
    exceptionType: 'nsfl',
    imageUrlKey: undefined,
    imageBlobKey: undefined,
    completed: false,
    onHandsQty: 42,
    pendingOnHandsQty: -999,
    consolidatedOnHandQty: 10,
    claimsOnHandQty: 5,
    backroomQty: 6,
    cloudQty: undefined,
    replenishment: {
      onOrder: 48
    },
    location: {
      floor: [
        {
          zoneId: 0,
          aisleId: 1,
          sectionId: 1,
          zoneName: 'A',
          aisleName: '1',
          sectionName: '1',
          locationName: 'A1-1',
          type: LOCATION_TYPES.SALES_FLOOR,
          typeNbr: 8
        },
        {
          zoneId: 0,
          aisleId: 0,
          sectionId: 2,
          zoneName: 'A',
          aisleName: '1',
          sectionName: '2',
          locationName: 'A1-2',
          type: LOCATION_TYPES.END_CAP,
          typeNbr: 12
        },
        {
          zoneId: 0,
          aisleId: 1,
          sectionId: 3,
          zoneName: 'A',
          aisleName: '1',
          sectionName: '3',
          locationName: 'A1-3',
          type: LOCATION_TYPES.POD,
          typeNbr: 13
        },
        {
          zoneId: 0,
          aisleId: 1,
          sectionId: 4,
          zoneName: 'A',
          aisleName: '1',
          sectionName: '4',
          locationName: 'A1-4',
          type: LOCATION_TYPES.DISPLAY,
          typeNbr: 11
        }
      ],
      reserve: [
        {
          zoneId: 0,
          aisleId: 1,
          sectionId: 1,
          zoneName: 'A',
          aisleName: '1',
          sectionName: '1',
          locationName: 'A1-1',
          type: LOCATION_TYPES.RESERVE,
          typeNbr: 7
        }
      ],
      count: 5
    },
    sales: {
      lastUpdateTs: SALES_LAST_UPDATE_TS,
      dailyAvgSales: 15,
      daily: [
        {
          day: SALES_DAYS.DAY1,
          value: 100
        },
        {
          day: SALES_DAYS.DAY2,
          value: 0
        },
        {
          day: SALES_DAYS.DAY3,
          value: 10
        },
        {
          day: SALES_DAYS.DAY4,
          value: 10
        },
        {
          day: SALES_DAYS.DAY5,
          value: 42
        },
        {
          day: SALES_DAYS.DAY6,
          value: 5
        },
        {
          day: SALES_DAYS.DAY7,
          value: 1
        }
      ],
      weeklyAvgSales: 10,
      weekly: [
        {
          week: 51,
          value: 39
        },
        {
          week: 52,
          value: 26
        },
        {
          week: 53,
          value: 45
        },
        {
          week: 54,
          value: 34
        },
        {
          week: 55,
          value: 34
        }
      ]
    }
  } as ItemDetails,
  '456': {
    itemName: 'Small, Store Use Item',
    itemNbr: 987654321,
    upcNbr: '777555333',
    status: 'Active',
    categoryNbr: 99,
    categoryDesc: 'Store Use',
    price: 2000.94,
    basePrice: 1500.30,
    exceptionType: 'nsfl',
    imageUrlKey: undefined,
    imageBlobKey: undefined,
    completed: false,
    onHandsQty: 42,
    pendingOnHandsQty: -999,
    consolidatedOnHandQty: 0,
    claimsOnHandQty: 5,
    backroomQty: 6,
    cloudQty: 42,
    replenishment: {
      onOrder: 48
    },
    location: {
      floor: [
        {
          zoneId: 0,
          aisleId: 1,
          sectionId: 1,
          zoneName: 'A',
          aisleName: '1',
          sectionName: '1',
          locationName: 'A1-1',
          type: LOCATION_TYPES.SALES_FLOOR,
          typeNbr: 8
        },
        {
          zoneId: 0,
          aisleId: 0,
          sectionId: 2,
          zoneName: 'A',
          aisleName: '1',
          sectionName: '2',
          locationName: 'A1-2',
          type: LOCATION_TYPES.END_CAP,
          typeNbr: 12
        },
        {
          zoneId: 0,
          aisleId: 1,
          sectionId: 3,
          zoneName: 'A',
          aisleName: '1',
          sectionName: '3',
          locationName: 'A1-3',
          type: LOCATION_TYPES.POD,
          typeNbr: 13
        },
        {
          zoneId: 0,
          aisleId: 1,
          sectionId: 4,
          zoneName: 'A',
          aisleName: '1',
          sectionName: '4',
          locationName: 'A1-4',
          type: LOCATION_TYPES.DISPLAY,
          typeNbr: 11
        }
      ],
      reserve: [
        {
          zoneId: 0,
          aisleId: 1,
          sectionId: 1,
          zoneName: 'A',
          aisleName: '1',
          sectionName: '1',
          locationName: 'A1-1',
          type: LOCATION_TYPES.RESERVE,
          typeNbr: 7
        }
      ],
      count: 5
    },
    sales: {
      lastUpdateTs: SALES_LAST_UPDATE_TS,
      dailyAvgSales: 15,
      daily: [
        {
          day: SALES_DAYS.DAY1,
          value: 10
        },
        {
          day: SALES_DAYS.DAY2,
          value: 0
        },
        {
          day: SALES_DAYS.DAY3,
          value: 10
        },
        {
          day: SALES_DAYS.DAY4,
          value: 10
        },
        {
          day: SALES_DAYS.DAY5,
          value: 42
        },
        {
          day: SALES_DAYS.DAY6,
          value: 5
        },
        {
          day: SALES_DAYS.DAY7,
          value: 1
        }
      ],
      weeklyAvgSales: 10,
      weekly: [
        {
          week: 51,
          value: 0
        },
        {
          week: 1,
          value: 10
        },
        {
          week: 2,
          value: 27
        },
        {
          week: 3,
          value: 10
        }
      ]
    }
  } as ItemDetails,
  '789': {
    itemName: 'Wine Item',
    itemNbr: 987654321,
    upcNbr: '777555333',
    status: 'Active',
    categoryNbr: 19,
    categoryDesc: 'Wine',
    price: 2000.94,
    basePrice: 1500.30,
    exceptionType: 'nsfl',
    imageUrlKey: undefined,
    imageBlobKey: undefined,
    completed: false,
    onHandsQty: 42,
    consolidatedOnHandQty: 0,
    claimsOnHandQty: 0,
    backroomQty: 6,
    pendingOnHandsQty: 35,
    cloudQty: 42,
    replenishment: {
      onOrder: 48
    },
    location: {
      floor: [
        {
          zoneId: 0,
          aisleId: 1,
          sectionId: 1,
          zoneName: 'A',
          aisleName: '1',
          sectionName: '1',
          locationName: 'A1-1',
          type: LOCATION_TYPES.SALES_FLOOR,
          typeNbr: 8
        },
        {
          zoneId: 0,
          aisleId: 0,
          sectionId: 2,
          zoneName: 'A',
          aisleName: '1',
          sectionName: '2',
          locationName: 'A1-2',
          type: LOCATION_TYPES.END_CAP,
          typeNbr: 12
        },
        {
          zoneId: 0,
          aisleId: 1,
          sectionId: 3,
          zoneName: 'A',
          aisleName: '1',
          sectionName: '3',
          locationName: 'A1-3',
          type: LOCATION_TYPES.POD,
          typeNbr: 13
        },
        {
          zoneId: 0,
          aisleId: 1,
          sectionId: 4,
          zoneName: 'A',
          aisleName: '1',
          sectionName: '4',
          locationName: 'A1-4',
          type: LOCATION_TYPES.DISPLAY,
          typeNbr: 11
        }
      ],
      reserve: [
        {
          zoneId: 0,
          aisleId: 1,
          sectionId: 1,
          zoneName: 'A',
          aisleName: '1',
          sectionName: '1',
          locationName: 'A1-1',
          type: LOCATION_TYPES.RESERVE,
          typeNbr: 7
        }
      ],
      count: 5
    },
    sales: {
      lastUpdateTs: SALES_LAST_UPDATE_TS,
      dailyAvgSales: 15,
      daily: [
        {
          day: SALES_DAYS.DAY1,
          value: 10
        },
        {
          day: SALES_DAYS.DAY2,
          value: 0
        },
        {
          day: SALES_DAYS.DAY3,
          value: 10
        },
        {
          day: SALES_DAYS.DAY4,
          value: 10
        },
        {
          day: SALES_DAYS.DAY5,
          value: 42
        },
        {
          day: SALES_DAYS.DAY6,
          value: 5
        },
        {
          day: SALES_DAYS.DAY7,
          value: 1
        }
      ],
      weeklyAvgSales: 10,
      weekly: [
        {
          week: 51,
          value: 0
        },
        {
          week: 1,
          value: 10
        },
        {
          week: 2,
          value: 27
        },
        {
          week: 3,
          value: 10
        }
      ]
    }
  } as ItemDetails,
  '321': {
    itemName: 'Test Item That is Really, Really Long (and has parenthesis)',
    itemNbr: 1234567890,
    upcNbr: '000055559999',
    status: 'Active',
    categoryNbr: 93,
    categoryDesc: 'Meat PI',
    price: 2000.94,
    basePrice: 1500.30,
    exceptionType: 'nsfl',
    imageUrlKey: undefined,
    imageBlobKey: undefined,
    completed: false,
    onHandsQty: 42,
    pendingOnHandsQty: -999,
    consolidatedOnHandQty: 10,
    claimsOnHandQty: 5,
    backroomQty: 6,
    cloudQty: undefined,
    replenishment: {
      onOrder: 48
    },
    location: {
      floor: [
        {
          zoneId: 0,
          aisleId: 1,
          sectionId: 1,
          zoneName: 'A',
          aisleName: '1',
          sectionName: '1',
          locationName: 'A1-1',
          type: LOCATION_TYPES.SALES_FLOOR,
          typeNbr: 8
        },
        {
          zoneId: 0,
          aisleId: 0,
          sectionId: 2,
          zoneName: 'A',
          aisleName: '1',
          sectionName: '2',
          locationName: 'A1-2',
          type: LOCATION_TYPES.END_CAP,
          typeNbr: 12
        },
        {
          zoneId: 0,
          aisleId: 1,
          sectionId: 3,
          zoneName: 'A',
          aisleName: '1',
          sectionName: '3',
          locationName: 'A1-3',
          type: LOCATION_TYPES.POD,
          typeNbr: 13
        },
        {
          zoneId: 0,
          aisleId: 1,
          sectionId: 4,
          zoneName: 'A',
          aisleName: '1',
          sectionName: '4',
          locationName: 'A1-4',
          type: LOCATION_TYPES.DISPLAY,
          typeNbr: 11
        }
      ],
      reserve: [
        {
          zoneId: 0,
          aisleId: 1,
          sectionId: 1,
          zoneName: 'A',
          aisleName: '1',
          sectionName: '1',
          locationName: 'A1-1',
          type: LOCATION_TYPES.RESERVE,
          typeNbr: 7
        }
      ],
      count: 5
    },
    sales: {
      lastUpdateTs: SALES_LAST_UPDATE_TS,
      dailyAvgSales: 15,
      daily: [
        {
          day: SALES_DAYS.DAY1,
          value: 10
        },
        {
          day: SALES_DAYS.DAY2,
          value: 0
        },
        {
          day: SALES_DAYS.DAY3,
          value: 10
        },
        {
          day: SALES_DAYS.DAY4,
          value: 10
        },
        {
          day: SALES_DAYS.DAY5,
          value: 42
        },
        {
          day: SALES_DAYS.DAY6,
          value: 5
        },
        {
          day: SALES_DAYS.DAY7,
          value: 1
        }
      ],
      weeklyAvgSales: 10,
      weekly: [
        {
          week: 51,
          value: 0
        },
        {
          week: 1,
          value: 10
        },
        {
          week: 2,
          value: 27
        },
        {
          week: 3,
          value: 10
        }
      ]
    }
  }
};

export const mockOHChangeHistory: OHChangeHistory[] = [
  {
    id: 1,
    itemName: 'test',
    itemNbr: 123,
    upcNbr: 234,
    categoryNbr: 45,
    categoryDescription: 'test',
    subCategoryNbr: 77,
    subCategoryDescription: '55',
    oldQuantity: 66,
    newQuantity: 33,
    dollarChange: 33.33,
    daysLeft: 4,
    initiatedUserId: '4',
    initiatedTimestamp: '2022-06-07',
    approvalStatus: approvalStatus.Approved,
    approvalRequestSource: approvalRequestSource.ItemDetails
  },
  {
    id: 4,
    initiatedTimestamp: '2022-07-12',
    newQuantity: 44,
    itemName: 'test',
    itemNbr: 123,
    upcNbr: 234,
    categoryNbr: 45,
    categoryDescription: 'test',
    subCategoryNbr: 77,
    subCategoryDescription: '55',
    oldQuantity: 66,
    dollarChange: 33.33,
    daysLeft: 4,
    initiatedUserId: '4',
    approvalStatus: approvalStatus.Approved,
    approvalRequestSource: approvalRequestSource.ItemDetails
  },
  {
    id: 5,
    initiatedTimestamp: '2022-07-23',
    newQuantity: 55,
    itemName: 'test',
    itemNbr: 123,
    upcNbr: 234,
    categoryNbr: 45,
    categoryDescription: 'test',
    subCategoryNbr: 77,
    subCategoryDescription: '55',
    oldQuantity: 66,
    dollarChange: 33.33,
    daysLeft: 4,
    initiatedUserId: '4',
    approvalStatus: approvalStatus.Approved,
    approvalRequestSource: approvalRequestSource.ItemDetails
  },
  {
    id: 6,
    initiatedTimestamp: '2022-05-13',
    newQuantity: 11,
    itemName: 'test',
    itemNbr: 123,
    upcNbr: 234,
    categoryNbr: 45,
    categoryDescription: 'test',
    subCategoryNbr: 77,
    subCategoryDescription: '55',
    oldQuantity: 66,
    dollarChange: 33.33,
    daysLeft: 4,
    initiatedUserId: '4',
    approvalStatus: approvalStatus.Approved,
    approvalRequestSource: approvalRequestSource.ItemDetails
  },
  {
    id: 8,
    initiatedTimestamp: '2022-05-15',
    newQuantity: 23,
    itemName: 'test',
    itemNbr: 123,
    upcNbr: 234,
    categoryNbr: 45,
    categoryDescription: 'test',
    subCategoryNbr: 77,
    subCategoryDescription: '55',
    oldQuantity: 66,
    dollarChange: 33.33,
    daysLeft: 4,
    initiatedUserId: '4',
    approvalStatus: approvalStatus.Approved,
    approvalRequestSource: approvalRequestSource.ItemDetails
  },
  {
    id: 7,
    initiatedTimestamp: '2022-06-28',
    newQuantity: 34,
    itemName: 'test',
    itemNbr: 123,
    upcNbr: 234,
    categoryNbr: 45,
    categoryDescription: 'test',
    subCategoryNbr: 77,
    subCategoryDescription: '55',
    oldQuantity: 66,
    dollarChange: 33.33,
    daysLeft: 4,
    initiatedUserId: '4',
    approvalStatus: approvalStatus.Approved,
    approvalRequestSource: approvalRequestSource.ItemDetails
  }
];
export const pickListMockHistory = [{
  id: 1,
  itemNbr: 123,
  upcNbr: 12,
  itemDesc: 'test',
  itemQty: 22,
  category: 'test',
  quickPick: false,
  salesFloorLocationName: 'test1-1',
  salesFloorLocationId: 123,
  moveToFront: false,
  assignedAssociate: 'test',
  palletId: 123,
  palletLocationName: 'test-1-1',
  palletLocationId: 123,
  status: 'test',
  createdBy: 'test',
  createTS: '12-05-2022'
},
{
  id: 2,
  itemNbr: 123,
  upcNbr: 12,
  itemDesc: 'test',
  itemQty: 30,
  category: 'test',
  quickPick: false,
  salesFloorLocationName: 'test1-1',
  salesFloorLocationId: 123,
  moveToFront: false,
  assignedAssociate: 'test',
  palletId: 123,
  palletLocationName: 'test-1-1',
  palletLocationId: 123,
  status: 'test',
  createdBy: 'test',
  createTS: '22-05-2022'
},
{
  id: 3,
  itemNbr: 123,
  upcNbr: 12,
  itemDesc: 'test',
  itemQty: 45,
  category: 'test',
  quickPick: false,
  salesFloorLocationName: 'test1-1',
  salesFloorLocationId: 123,
  moveToFront: false,
  assignedAssociate: 'test',
  palletId: 123,
  palletLocationName: 'test-1-1',
  palletLocationId: 123,
  status: 'test',
  createdBy: 'test',
  createTS: '12-07-2022'
},
{
  id: 4,
  itemNbr: 123,
  upcNbr: 12,
  itemDesc: 'test',
  itemQty: 66,
  category: 'test',
  quickPick: false,
  salesFloorLocationName: 'test1-1',
  salesFloorLocationId: 123,
  moveToFront: false,
  assignedAssociate: 'test',
  palletId: 123,
  palletLocationName: 'test-1-1',
  palletLocationId: 123,
  status: 'test',
  createdBy: 'test',
  createTS: '24-06-2022'
},
{
  id: 5,
  itemNbr: 123,
  upcNbr: 12,
  itemDesc: 'test',
  itemQty: 44,
  category: 'test',
  quickPick: false,
  salesFloorLocationName: 'test1-1',
  salesFloorLocationId: 123,
  moveToFront: false,
  assignedAssociate: 'test',
  palletId: 123,
  palletLocationName: 'test-1-1',
  palletLocationId: 123,
  status: 'test',
  createdBy: 'test',
  createTS: '28-05-2022'
},
{
  id: 6,
  itemNbr: 123,
  upcNbr: 12,
  itemDesc: 'test',
  itemQty: 77,
  category: 'test',
  quickPick: false,
  salesFloorLocationName: 'test1-1',
  salesFloorLocationId: 123,
  moveToFront: false,
  assignedAssociate: 'test',
  palletId: 123,
  palletLocationName: 'test-1-1',
  palletLocationId: 123,
  status: 'test',
  createdBy: 'test',
  createTS: '11-05-2022'
}];
