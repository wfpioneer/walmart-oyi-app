export default {
  '123': {
    itemName: 'Test Item That is Really, Really Long (and has parenthesis)',
    itemNbr: 1234567890,
    upcNbr: '000055559999',
    status: 'Active',
    category: '93 - Meat PI',
    price: 2000.94,
    exceptionType: 'po',
    onHandsQty: 42,
    isOnHandsPending: true,
    replenishment: {
      onOrder: 48
    },
    location: {
      floor: [
        {
          id: '1',
          type: 'pod',
          name: 'F15-4'
        }
      ],
      reserve: [
        {
          id: '2',
          type: 'reserve',
          name: 'F15-4'
        }
      ],
      count: 10
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
          value: 0
        },
        {
          week: 1,
          value: 10
        },
        {
          week: 2,
          value: 100
        },
        {
          week: 3,
          value: 10
        }
      ]
    }
  },
  '456': {
    itemName: 'Small, Store Use Item',
    itemNbr: 987654321,
    upcNbr: '777555333',
    status: 'Active',
    category: '99 - Store Use',
    price: 2000.94,
    onHandsQty: 42,
    isOnHandsPending: false,
    replenishment: {
      onOrder: 48
    },
    location: {
      floor: [
        {
          id: '1',
          type: 'pod',
          name: 'F15-4'
        }
      ],
      reserve: [],
      count: 10
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
  },
  '789': {
    itemName: 'Wine Item',
    itemNbr: 987654321,
    upcNbr: '777555333',
    status: 'Active',
    category: '19 - Wine',
    price: 2000.94,
    onHandsQty: 42,
    isOnHandsPending: false,
    replenishment: {
      onOrder: 48
    },
    location: {
      floor: [
        {
          id: '1',
          type: 'pod',
          name: 'F15-4'
        }
      ],
      reserve: [],
      count: 10
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
  }
}
