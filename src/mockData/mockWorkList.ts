import { WorklistItemI } from '../models/WorklistItem';
import { MissingPalletWorklistItemI } from '../models/PalletWorklist';
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
export enum CATEGORY_NAME {
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
  MP = 'MP',
  AU = 'AU',
  RA = 'RA'
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
    completed: false,
    completedUserId: undefined,
    completedTs: undefined,
    sectionID: 1
  },
  {
    createUserId: '12',
    createTs: '26/06/2022',
    lastKnownPalletLocationId: 2,
    lastKnownPalletLocationName: 'A1-2',
    palletDeleted: false,
    palletId: 7989,
    completed: false,
    completedUserId: undefined,
    completedTs: undefined,
    sectionID: 2
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
    completed: true,
    completedUserId: '1',
    completedTs: '2022-07-07T12:40:00.000Z',
    sectionID: 1
  },
  {
    createUserId: '14',
    createTs: '26/06/2022',
    lastKnownPalletLocationId: 4,
    lastKnownPalletLocationName: 'B1-2',
    palletDeleted: false,
    palletId: 7991,
    completed: true,
    completedUserId: '2',
    completedTs: '2022-07-07T12:40:00.000Z',
    sectionID: 2
  }
];

export const mockMPSecWiseList: MissingPalletWorklistItemI[] = [
  {
    createUserId: '',
    itemCount: 1,
    lastKnownPalletLocationId: 5,
    lastKnownPalletLocationName: '1A1-2',
    palletDeleted: false,
    palletId: 0,
    sectionID: 0,
    completed: false,
    createTs: ''
  },
  {
    completed: false,
    createUserId: '14',
    createTs: '26/06/2022',
    lastKnownPalletLocationId: 5,
    lastKnownPalletLocationName: '1A1-2',
    palletDeleted: false,
    palletId: 7777,
    sectionID: 2
  },
  {
    completed: false,
    createUserId: '',
    createTs: '',
    itemCount: 1,
    lastKnownPalletLocationId: 1,
    lastKnownPalletLocationName: 'A1-1',
    palletDeleted: false,
    palletId: 0,
    sectionID: 0
  },
  {
    completed: false,
    createUserId: '11',
    createTs: '26/06/2022',
    lastKnownPalletLocationId: 1,
    lastKnownPalletLocationName: 'A1-1',
    palletDeleted: false,
    palletId: 7988,
    sectionID: 1
  },
  {
    createUserId: '',
    createTs: '',
    itemCount: 2,
    lastKnownPalletLocationId: 2,
    lastKnownPalletLocationName: 'A1-2',
    palletDeleted: false,
    palletId: 0,
    completed: false,
    sectionID: 0
  },
  {
    completed: false,
    createUserId: '15',
    createTs: '26/06/2022',
    lastKnownPalletLocationId: 2,
    lastKnownPalletLocationName: 'A1-2',
    palletDeleted: false,
    palletId: 888,
    sectionID: 2
  },
  {
    completed: false,
    createUserId: '12',
    createTs: '26/06/2022',
    lastKnownPalletLocationId: 2,
    lastKnownPalletLocationName: 'A1-2',
    palletDeleted: false,
    palletId: 7989,
    sectionID: 2
  },
  {
    createUserId: '',
    createTs: '',
    itemCount: 1,
    lastKnownPalletLocationId: 8,
    lastKnownPalletLocationName: 'A1-11',
    palletDeleted: false,
    palletId: 0,
    sectionID: 0,
    completed: false
  },
  {
    completed: false,
    createUserId: '15',
    createTs: '26/06/2022',
    lastKnownPalletLocationId: 8,
    lastKnownPalletLocationName: 'A1-11',
    palletDeleted: false,
    palletId: 8889,
    sectionID: 11
  }
];

export const mockMissingPalletWorklist: MissingPalletWorklistItemI[] = [
  {
    createUserId: '11',
    createTs: '26/06/2022',
    lastKnownPalletLocationId: 1,
    lastKnownPalletLocationName: 'A1-1',
    palletDeleted: false,
    palletId: 7988,
    completed: false,
    sectionID: 1
  },
  {
    createUserId: '12',
    createTs: '26/06/2022',
    lastKnownPalletLocationId: 2,
    lastKnownPalletLocationName: 'A1-2',
    palletDeleted: false,
    palletId: 7989,
    completed: false,
    sectionID: 2
  },
  {
    createUserId: '14',
    createTs: '26/06/2022',
    lastKnownPalletLocationId: 5,
    lastKnownPalletLocationName: '1A1-2',
    palletDeleted: false,
    palletId: 7777,
    completed: false,
    sectionID: 0
  },
  {
    createUserId: '15',
    createTs: '26/06/2022',
    lastKnownPalletLocationId: 2,
    lastKnownPalletLocationName: 'A1-2',
    palletDeleted: false,
    palletId: 888,
    completed: false,
    sectionID: 0
  },
  {
    createUserId: '15',
    createTs: '26/06/2022',
    lastKnownPalletLocationId: 8,
    lastKnownPalletLocationName: 'A1-11',
    palletDeleted: false,
    palletId: 8889,
    completed: false,
    sectionID: 0
  }
];

export const mockToDoAuditWorklist = [{
  worklistType: WORKLISTTYPE.AU,
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
  worklistType: WORKLISTTYPE.AU,
  itemName: ITEM_NAME.TEST_ITEM,
  itemNbr: 1234567899,
  upcNbr: '000055559934',
  catgNbr: 93,
  catgName: CATEGORY_NAME.FOODSERVICE,
  subCatgNbr: 0,
  subCatgName: undefined,
  completedTs: undefined,
  completedUserId: undefined,
  completed: false
},
{
  worklistType: WORKLISTTYPE.AU,
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
  worklistType: WORKLISTTYPE.RA,
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
}];

export const mockCompletedAuditWorklist = [{
  worklistType: WORKLISTTYPE.AU,
  itemName: ITEM_NAME.TEST_ITEM,
  itemNbr: 1234567890,
  upcNbr: '000055559999',
  catgNbr: 93,
  catgName: CATEGORY_NAME.FOODSERVICE,
  subCatgNbr: 0,
  subCatgName: undefined,
  completedTs: '2022-09-15T13:32:41+05:30',
  completedUserId: 'vn51wu8',
  completed: true
},
{
  worklistType: WORKLISTTYPE.AU,
  itemName: ITEM_NAME.TEST_ITEM,
  itemNbr: 1234567899,
  upcNbr: '000055559934',
  catgNbr: 93,
  catgName: CATEGORY_NAME.FOODSERVICE,
  subCatgNbr: 0,
  subCatgName: undefined,
  completedTs: '2022-09-15T13:32:41+05:30',
  completedUserId: 'vn51wu8',
  completed: true
},
{
  worklistType: WORKLISTTYPE.AU,
  itemName: ITEM_NAME.ELECTRONIC_ITEM,
  itemNbr: 987654321,
  upcNbr: '777555333',
  catgNbr: 99,
  catgName: CATEGORY_NAME.ELECTRONICS,
  subCatgNbr: 0,
  subCatgName: undefined,
  completedTs: '2022-09-15T13:32:41+05:30',
  completedUserId: 'vn51wu8',
  completed: true
},
{
  worklistType: WORKLISTTYPE.RA,
  itemName: ITEM_NAME.BAKERY_ITEM,
  itemNbr: 123789456,
  upcNbr: '111122223333',
  catgNbr: 88,
  catgName: CATEGORY_NAME.FRESH_BAKERY,
  subCatgNbr: 0,
  subCatgName: undefined,
  completedTs: '2022-09-15T13:32:41+05:30',
  completedUserId: 'vn51wu8',
  completed: true
}];
