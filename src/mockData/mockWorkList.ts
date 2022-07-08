import { MissingPalletWorklistItemI, WorklistItemI } from '../models/WorklistItem';
import { FilteredCategory } from '../models/FilterListItem';

// eslint-disable-next-line no-shadow
enum ITEM_NAME {
  ELECTRONIC_ITEM = 'ELECTRONIC ITEM',
  BAKERY_ITEM = 'BAKERY ITEM',
  WINE_ITEM = 'WINE ITEM',
  PHARMACY_ITEM = 'PHARMACY ITEM',
  PHARMACY_ITEM_1 = 'PHARMACY ITEM 1',
  TEST_ITEM = 'TEST ITEM'
}

// eslint-disable-next-line no-shadow
enum CATEGORY_NAME {
  FOODSERVICE = 'FOODSERVICE',
  ELECTRONICS = 'ELECTRONICS',
  FRESH_BAKERY = 'FRESH BAKERY',
  WINE = 'WINE',
  PHARMACY_RX = 'PHARMACY RX'
}

// eslint-disable-next-line no-shadow
enum WORKLISTTYPE {
  NSFL = 'NSFL',
  C = 'C',
  NO = 'NO',
  NS = 'NS',
  CATEGORY = 'CATEGORY',
  NON_EXCEPTION = 'Non-Exception',
  MP = 'MP'
}

const COMPLETED_TS = '2020-07-15T08:02:17-05:00';

export const mockWorkListToDo: WorklistItemI[] = [
  {
    worklistType: WORKLISTTYPE.NSFL,
    itemName: ITEM_NAME.TEST_ITEM,
    itemNbr: 1234567890,
    upcNbr: '000055559999',
    catgNbr: 93,
    catgName: CATEGORY_NAME.FOODSERVICE,
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: undefined,
    completedUserId: undefined,
    completed: false
  },
  {
    worklistType: WORKLISTTYPE.NO,
    itemName: ITEM_NAME.ELECTRONIC_ITEM,
    itemNbr: 987654321,
    upcNbr: '777555333',
    catgNbr: 99,
    catgName: CATEGORY_NAME.ELECTRONICS,
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: undefined,
    completedUserId: undefined,
    completed: false
  },
  {
    worklistType: WORKLISTTYPE.NO,
    itemName: ITEM_NAME.BAKERY_ITEM,
    itemNbr: 123789456,
    upcNbr: '111122223333',
    catgNbr: 88,
    catgName: CATEGORY_NAME.FRESH_BAKERY,
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: undefined,
    completedUserId: undefined,
    completed: false
  },
  {
    worklistType: WORKLISTTYPE.C,
    itemName: ITEM_NAME.WINE_ITEM,
    itemNbr: 456789123,
    upcNbr: '444455556666',
    catgNbr: 19,
    catgName: CATEGORY_NAME.WINE,
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: undefined,
    completedUserId: undefined,
    completed: false
  },
  {
    worklistType: WORKLISTTYPE.C,
    itemName: ITEM_NAME.PHARMACY_ITEM,
    itemNbr: 789123456,
    upcNbr: '777788889999',
    catgNbr: 87,
    catgName: CATEGORY_NAME.PHARMACY_RX,
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: undefined,
    completedUserId: undefined,
    completed: false
  },
  {
    worklistType: WORKLISTTYPE.NS,
    itemName: ITEM_NAME.PHARMACY_ITEM_1,
    itemNbr: 789123457,
    upcNbr: '667788889999',
    catgNbr: 199,
    catgName: CATEGORY_NAME.ELECTRONICS,
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: undefined,
    completedUserId: undefined,
    completed: false
  }
];
export const mockWorkListComplete: WorklistItemI[] = [
  {
    worklistType: WORKLISTTYPE.NSFL,
    itemName: ITEM_NAME.TEST_ITEM,
    itemNbr: 1234567890,
    upcNbr: '000055559999',
    catgNbr: 93,
    catgName: CATEGORY_NAME.FOODSERVICE,
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: COMPLETED_TS,
    completedUserId: 'SVCintlsamsops',
    completed: true
  },
  {
    worklistType: WORKLISTTYPE.NO,
    itemName: ITEM_NAME.ELECTRONIC_ITEM,
    itemNbr: 987654321,
    upcNbr: '777555333',
    catgNbr: 99,
    catgName: CATEGORY_NAME.ELECTRONICS,
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: COMPLETED_TS,
    completedUserId: 'SVCintlsamsops',
    completed: true
  },
  {
    worklistType: WORKLISTTYPE.NO,
    itemName: ITEM_NAME.BAKERY_ITEM,
    itemNbr: 123789456,
    upcNbr: '111122223333',
    catgNbr: 88,
    catgName: CATEGORY_NAME.FRESH_BAKERY,
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: COMPLETED_TS,
    completedUserId: 'SVCintlsamsops',
    completed: true
  },
  {
    worklistType: WORKLISTTYPE.C,
    itemName: ITEM_NAME.WINE_ITEM,
    itemNbr: 456789123,
    upcNbr: '444455556666',
    catgNbr: 19,
    catgName: CATEGORY_NAME.WINE,
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: COMPLETED_TS,
    completedUserId: 'SVCintlsamsops',
    completed: true
  },
  {
    worklistType: WORKLISTTYPE.C,
    itemName: ITEM_NAME.PHARMACY_ITEM,
    itemNbr: 789123456,
    upcNbr: '777788889999',
    catgNbr: 87,
    catgName: CATEGORY_NAME.PHARMACY_RX,
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: COMPLETED_TS,
    completedUserId: 'SVCintlsamsops',
    completed: true
  },
  {
    worklistType: WORKLISTTYPE.NS,
    itemName: ITEM_NAME.PHARMACY_ITEM_1,
    itemNbr: 789123457,
    upcNbr: '667788889999',
    catgNbr: 199,
    catgName: CATEGORY_NAME.ELECTRONICS,
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: undefined,
    completedUserId: undefined,
    completed: true
  }
];

export const mockCategoryList: WorklistItemI[] = [
  {
    worklistType: WORKLISTTYPE.CATEGORY,
    catgName: CATEGORY_NAME.WINE,
    catgNbr: 19,
    itemCount: 1
  },
  {
    worklistType: WORKLISTTYPE.C,
    itemName: ITEM_NAME.WINE_ITEM,
    itemNbr: 456789123,
    upcNbr: '444455556666',
    catgNbr: 19,
    catgName: CATEGORY_NAME.WINE,
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: undefined,
    completedUserId: undefined,
    completed: false
  },
  {
    worklistType: WORKLISTTYPE.CATEGORY,
    catgName: CATEGORY_NAME.PHARMACY_RX,
    catgNbr: 87,
    itemCount: 1
  },
  {
    worklistType: WORKLISTTYPE.C,
    itemName: ITEM_NAME.PHARMACY_ITEM,
    itemNbr: 789123456,
    upcNbr: '777788889999',
    catgNbr: 87,
    catgName: CATEGORY_NAME.PHARMACY_RX,
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: undefined,
    completedUserId: undefined,
    completed: false
  },
  {
    worklistType: WORKLISTTYPE.CATEGORY,
    catgName: CATEGORY_NAME.FRESH_BAKERY,
    catgNbr: 88,
    itemCount: 1
  },
  {
    worklistType: WORKLISTTYPE.NO,
    itemName: ITEM_NAME.BAKERY_ITEM,
    itemNbr: 123789456,
    upcNbr: '111122223333',
    catgNbr: 88,
    catgName: CATEGORY_NAME.FRESH_BAKERY,
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: undefined,
    completedUserId: undefined,
    completed: false
  },
  {
    worklistType: WORKLISTTYPE.CATEGORY,
    catgName: CATEGORY_NAME.FOODSERVICE,
    catgNbr: 93,
    itemCount: 1
  },
  {
    worklistType: WORKLISTTYPE.NSFL,
    itemName: ITEM_NAME.TEST_ITEM,
    itemNbr: 1234567890,
    upcNbr: '000055559999',
    catgNbr: 93,
    catgName: CATEGORY_NAME.FOODSERVICE,
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: undefined,
    completedUserId: undefined,
    completed: false
  },
  {
    worklistType: WORKLISTTYPE.CATEGORY,
    catgName: CATEGORY_NAME.ELECTRONICS,
    catgNbr: 99,
    itemCount: 1
  },
  {
    worklistType: WORKLISTTYPE.NO,
    itemName: ITEM_NAME.ELECTRONIC_ITEM,
    itemNbr: 987654321,
    upcNbr: '777555333',
    catgNbr: 99,
    catgName: CATEGORY_NAME.ELECTRONICS,
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: undefined,
    completedUserId: undefined,
    completed: false
  },
  {
    worklistType: WORKLISTTYPE.CATEGORY,
    catgName: CATEGORY_NAME.ELECTRONICS,
    catgNbr: 199,
    itemCount: 1
  },
  {
    worklistType: WORKLISTTYPE.NS,
    itemName: ITEM_NAME.PHARMACY_ITEM_1,
    itemNbr: 789123457,
    upcNbr: '667788889999',
    catgNbr: 199,
    catgName: CATEGORY_NAME.ELECTRONICS,
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: undefined,
    completedUserId: undefined,
    completed: false
  }
];

export const missingCategoryNbrList = [{
  worklistType: WORKLISTTYPE.NSFL,
  itemName: ITEM_NAME.TEST_ITEM,
  itemNbr: 1234567890,
  upcNbr: '000055559999',
  catgNbr: undefined,
  catgName: CATEGORY_NAME.FOODSERVICE,
  subCatgNbr: 0,
  subCatgName: undefined,
  completedTs: undefined,
  completedUserId: undefined,
  completed: false
},
{
  worklistType: WORKLISTTYPE.NO,
  itemName: ITEM_NAME.ELECTRONIC_ITEM,
  itemNbr: 987654321,
  upcNbr: '777555333',
  catgNbr: undefined,
  catgName: CATEGORY_NAME.ELECTRONICS,
  subCatgNbr: 0,
  subCatgName: undefined,
  completedTs: undefined,
  completedUserId: undefined,
  completed: false
},
{
  worklistType: WORKLISTTYPE.NO,
  itemName: ITEM_NAME.BAKERY_ITEM,
  itemNbr: 123789456,
  upcNbr: '111122223333',
  catgNbr: undefined,
  catgName: CATEGORY_NAME.FRESH_BAKERY,
  subCatgNbr: 0,
  subCatgName: undefined,
  completedTs: undefined,
  completedUserId: undefined,
  completed: false
},
{
  worklistType: WORKLISTTYPE.C,
  itemName: ITEM_NAME.WINE_ITEM,
  itemNbr: 456789123,
  upcNbr: '444455556666',
  catgNbr: undefined,
  catgName: CATEGORY_NAME.WINE,
  subCatgNbr: 0,
  subCatgName: undefined,
  completedTs: undefined,
  completedUserId: undefined,
  completed: false
},
{
  worklistType: WORKLISTTYPE.C,
  itemName: ITEM_NAME.PHARMACY_ITEM,
  itemNbr: 789123456,
  upcNbr: '777788889999',
  catgNbr: undefined,
  catgName: CATEGORY_NAME.PHARMACY_RX,
  subCatgNbr: 0,
  subCatgName: undefined,
  completedTs: undefined,
  completedUserId: undefined,
  completed: false
}];

export const missingExceptionsWorklist: WorklistItemI[] = [
  {
    worklistType: WORKLISTTYPE.NON_EXCEPTION,
    itemName: ITEM_NAME.TEST_ITEM,
    itemNbr: 1234567890,
    upcNbr: '000055559999',
    catgNbr: 93,
    catgName: CATEGORY_NAME.FOODSERVICE,
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: COMPLETED_TS,
    completedUserId: 'SVCintlsamsops',
    completed: true
  },
  {
    worklistType: WORKLISTTYPE.NON_EXCEPTION,
    itemName: ITEM_NAME.ELECTRONIC_ITEM,
    itemNbr: 987654321,
    upcNbr: '777555333',
    catgNbr: 99,
    catgName: CATEGORY_NAME.ELECTRONICS,
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: COMPLETED_TS,
    completedUserId: 'SVCintlsamsops',
    completed: true
  },
  {
    worklistType: WORKLISTTYPE.NON_EXCEPTION,
    itemName: ITEM_NAME.BAKERY_ITEM,
    itemNbr: 123789456,
    upcNbr: '111122223333',
    catgNbr: 88,
    catgName: CATEGORY_NAME.FRESH_BAKERY,
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: COMPLETED_TS,
    completedUserId: 'SVCintlsamsops',
    completed: true
  },
  {
    worklistType: WORKLISTTYPE.NON_EXCEPTION,
    itemName: ITEM_NAME.PHARMACY_ITEM_1,
    itemNbr: 789123457,
    upcNbr: '667788889999',
    catgNbr: 199,
    catgName: CATEGORY_NAME.ELECTRONICS,
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: undefined,
    completedUserId: undefined,
    completed: true
  }
];

export const mockCategoryMap: FilteredCategory[] = [
  {
    catgName: CATEGORY_NAME.WINE,
    catgNbr: 19,
    selected: false
  },
  {
    catgName: CATEGORY_NAME.PHARMACY_RX,
    catgNbr: 87,
    selected: false
  },
  {
    catgName: CATEGORY_NAME.FRESH_BAKERY,
    catgNbr: 88,
    selected: false
  },
  {
    catgName: CATEGORY_NAME.FOODSERVICE,
    catgNbr: 93,
    selected: false
  },
  {
    catgName: CATEGORY_NAME.ELECTRONICS,
    catgNbr: 99,
    selected: false
  },
  {
    catgName: CATEGORY_NAME.ELECTRONICS,
    catgNbr: 199,
    selected: false
  }
];

export const mockMissingPalletWorklistTodo: MissingPalletWorklistItemI[] = [
  {
    createUserId: '11',
    createTs: '26/06/2022',
    lastKnownPalletLocationId: 1,
    lastKnownPalletLocationName: 'A1-1',
    palletDeleted: false,
    palletId: 7988,
    worklistType: 'MP',
    completed: false,
    completedUserId: undefined,
    completedTs: undefined
  },
  {
    createUserId: '12',
    createTs: '26/06/2022',
    lastKnownPalletLocationId: 2,
    lastKnownPalletLocationName: 'A1-2',
    palletDeleted: false,
    palletId: 7989,
    worklistType: 'MP',
    completed: false,
    completedUserId: undefined,
    completedTs: undefined
  }
];

export const mockMissingPalletWorklistComplete: MissingPalletWorklistItemI[] = [
  {
    createUserId: '13',
    createTs: '26/06/2022',
    lastKnownPalletLocationId: 3,
    lastKnownPalletLocationName: 'B1-1',
    palletDeleted: false,
    palletId: 7990,
    worklistType: 'MP',
    completed: true,
    completedUserId: '1',
    completedTs: '2022-07-07T12:40:00.000Z'
  },
  {
    createUserId: '14',
    createTs: '26/06/2022',
    lastKnownPalletLocationId: 4,
    lastKnownPalletLocationName: 'B1-2',
    palletDeleted: false,
    palletId: 7991,
    worklistType: 'MP',
    completed: true,
    completedUserId: '2',
    completedTs: '2022-07-07T12:40:00.000Z'
  }
];
