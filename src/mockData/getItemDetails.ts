import ItemDetails from '../models/ItemDetails';
/* eslint-disable quote-props */

const floorType = 'Sales Floor';
const salesLastUpdateTs = '2020-07-15T08:02:17-05:00';
const salesDay1 = '2020-07-08';
const salesDay2 = '2020-07-09';
const salesDay3 = '2020-07-10';
const salesDay4 = '2020-07-11';
const salesDay5 = '2020-07-12';
const salesDay6 = '2020-07-13';
const salesDay7 = '2020-07-14';

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
          type: floorType,
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
          type: 'End Cap',
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
          type: 'Pod',
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
          type: 'Display',
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
          type: 'Reserve',
          typeNbr: 7
        }
      ],
      count: 5
    },
    sales: {
      lastUpdateTs: salesLastUpdateTs,
      dailyAvgSales: 15,
      daily: [
        {
          day: salesDay1,
          value: 100
        },
        {
          day: salesDay2,
          value: 0
        },
        {
          day: salesDay3,
          value: 10
        },
        {
          day: salesDay4,
          value: 10
        },
        {
          day: salesDay5,
          value: 42
        },
        {
          day: salesDay6,
          value: 5
        },
        {
          day: salesDay7,
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
          type: floorType,
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
          type: 'End Cap',
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
          type: 'Pod',
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
          type: 'Display',
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
          type: 'Reserve',
          typeNbr: 7
        }
      ],
      count: 5
    },
    sales: {
      lastUpdateTs: salesLastUpdateTs,
      dailyAvgSales: 15,
      daily: [
        {
          day: salesDay1,
          value: 10
        },
        {
          day: salesDay2,
          value: 0
        },
        {
          day: salesDay3,
          value: 10
        },
        {
          day: salesDay4,
          value: 10
        },
        {
          day: salesDay5,
          value: 42
        },
        {
          day: salesDay6,
          value: 5
        },
        {
          day: salesDay7,
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
          type: floorType,
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
          type: 'End Cap',
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
          type: 'Pod',
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
          type: 'Display',
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
          type: 'Reserve',
          typeNbr: 7
        }
      ],
      count: 5
    },
    sales: {
      lastUpdateTs: salesLastUpdateTs,
      dailyAvgSales: 15,
      daily: [
        {
          day: salesDay1,
          value: 10
        },
        {
          day: salesDay2,
          value: 0
        },
        {
          day: salesDay3,
          value: 10
        },
        {
          day: salesDay4,
          value: 10
        },
        {
          day: salesDay5,
          value: 42
        },
        {
          day: salesDay6,
          value: 5
        },
        {
          day: salesDay7,
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
  } as ItemDetails
};
