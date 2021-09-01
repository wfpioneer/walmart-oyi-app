import ItemDetails from '../models/ItemDetails';
/* eslint-disable quote-props */
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
    completed: false,
    onHandsQty: 42,
    pendingOnHandsQty: -999,
    cloudQty: 0,
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
          type: 'Sales Floor',
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
      lastUpdateTs: '2020-07-15T08:02:17-05:00',
      dailyAvgSales: 15,
      daily: [
        {
          day: '2020-07-08',
          value: 100
        },
        {
          day: '2020-07-09',
          value: 0
        },
        {
          day: '2020-07-10',
          value: 10
        },
        {
          day: '2020-07-11',
          value: 10
        },
        {
          day: '2020-07-12',
          value: 42
        },
        {
          day: '2020-07-13',
          value: 5
        },
        {
          day: '2020-07-14',
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
    completed: false,
    onHandsQty: 42,
    pendingOnHandsQty: -999,
    cloudQty: 0,
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
          type: 'Sales Floor',
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
      lastUpdateTs: '2020-07-15T08:02:17-05:00',
      dailyAvgSales: 15,
      daily: [
        {
          day: '2020-07-08',
          value: 10
        },
        {
          day: '2020-07-09',
          value: 0
        },
        {
          day: '2020-07-10',
          value: 10
        },
        {
          day: '2020-07-11',
          value: 10
        },
        {
          day: '2020-07-12',
          value: 42
        },
        {
          day: '2020-07-13',
          value: 5
        },
        {
          day: '2020-07-14',
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
    completed: false,
    onHandsQty: 42,
    pendingOnHandsQty: -999,
    cloudQty: 0,
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
          type: 'Sales Floor',
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
      lastUpdateTs: '2020-07-15T08:02:17-05:00',
      dailyAvgSales: 15,
      daily: [
        {
          day: '2020-07-08',
          value: 10
        },
        {
          day: '2020-07-09',
          value: 0
        },
        {
          day: '2020-07-10',
          value: 10
        },
        {
          day: '2020-07-11',
          value: 10
        },
        {
          day: '2020-07-12',
          value: 42
        },
        {
          day: '2020-07-13',
          value: 5
        },
        {
          day: '2020-07-14',
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
