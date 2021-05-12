import { WorklistItemI } from '../models/WorklistItem';

export const mockWorkListToDo: WorklistItemI[] = [
  {
    worklistType: 'NSFL',
    itemName: 'TEST ITEM',
    itemNbr: 1234567890,
    upcNbr: '000055559999',
    catgNbr: 93,
    catgName: 'FOODSERVICE',
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: undefined,
    completedUserId: undefined,
    completed: false
  },
  {
    worklistType: 'NO',
    itemName: 'ELECTRONIC ITEM',
    itemNbr: 987654321,
    upcNbr: '777555333',
    catgNbr: 99,
    catgName: 'ELECTRONICS',
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: undefined,
    completedUserId: undefined,
    completed: false
  },
  {
    worklistType: 'NO',
    itemName: 'BAKERY ITEM',
    itemNbr: 123789456,
    upcNbr: '111122223333',
    catgNbr: 88,
    catgName: 'FRESH BAKERY',
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: undefined,
    completedUserId: undefined,
    completed: false
  },
  {
    worklistType: 'C',
    itemName: 'WINE ITEM',
    itemNbr: 456789123,
    upcNbr: '444455556666',
    catgNbr: 19,
    catgName: 'WINE',
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: undefined,
    completedUserId: undefined,
    completed: false
  },
  {
    worklistType: 'C',
    itemName: 'PHARMACY ITEM',
    itemNbr: 789123456,
    upcNbr: '777788889999',
    catgNbr: 87,
    catgName: 'PHARMACY RX',
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: undefined,
    completedUserId: undefined,
    completed: false
  }
];
export const mockWorkListComplete: WorklistItemI[] = [
  {
    worklistType: 'NSFL',
    itemName: 'TEST ITEM',
    itemNbr: 1234567890,
    upcNbr: '000055559999',
    catgNbr: 93,
    catgName: 'FOODSERVICE',
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: '2020-07-15T08:02:17-05:00',
    completedUserId: 'SVCintlsamsops',
    completed: true
  },
  {
    worklistType: 'NO',
    itemName: 'ELECTRONIC ITEM',
    itemNbr: 987654321,
    upcNbr: '777555333',
    catgNbr: 99,
    catgName: 'ELECTRONICS',
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: '2020-07-15T08:02:17-05:00',
    completedUserId: 'SVCintlsamsops',
    completed: true
  },
  {
    worklistType: 'NO',
    itemName: 'BAKERY ITEM',
    itemNbr: 123789456,
    upcNbr: '111122223333',
    catgNbr: 88,
    catgName: 'FRESH BAKERY',
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: '2020-07-15T08:02:17-05:00',
    completedUserId: 'SVCintlsamsops',
    completed: true
  },
  {
    worklistType: 'C',
    itemName: 'WINE ITEM',
    itemNbr: 456789123,
    upcNbr: '444455556666',
    catgNbr: 19,
    catgName: 'WINE',
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: '2020-07-15T08:02:17-05:00',
    completedUserId: 'SVCintlsamsops',
    completed: true
  },
  {
    worklistType: 'C',
    itemName: 'PHARMACY ITEM',
    itemNbr: 789123456,
    upcNbr: '777788889999',
    catgNbr: 87,
    catgName: 'PHARMACY RX',
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: '2020-07-15T08:02:17-05:00',
    completedUserId: 'SVCintlsamsops',
    completed: true
  }
];

export const mockCategoryList: WorklistItemI[] = [
  {
    worklistType: 'CATEGORY',
    catgName: 'WINE',
    catgNbr: 19,
    itemCount: 1
  },
  {
    worklistType: 'C',
    itemName: 'WINE ITEM',
    itemNbr: 456789123,
    upcNbr: '444455556666',
    catgNbr: 19,
    catgName: 'WINE',
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: undefined,
    completedUserId: undefined,
    completed: false
  },
  {
    worklistType: 'CATEGORY',
    catgName: 'PHARMACY RX',
    catgNbr: 87,
    itemCount: 1
  },
  {
    worklistType: 'C',
    itemName: 'PHARMACY ITEM',
    itemNbr: 789123456,
    upcNbr: '777788889999',
    catgNbr: 87,
    catgName: 'PHARMACY RX',
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: undefined,
    completedUserId: undefined,
    completed: false
  },
  {
    worklistType: 'CATEGORY',
    catgName: 'FRESH BAKERY',
    catgNbr: 88,
    itemCount: 1
  },
  {
    worklistType: 'NO',
    itemName: 'BAKERY ITEM',
    itemNbr: 123789456,
    upcNbr: '111122223333',
    catgNbr: 88,
    catgName: 'FRESH BAKERY',
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: undefined,
    completedUserId: undefined,
    completed: false
  },
  {
    worklistType: 'CATEGORY',
    catgName: 'FOODSERVICE',
    catgNbr: 93,
    itemCount: 1
  },
  {
    worklistType: 'NSFL',
    itemName: 'TEST ITEM',
    itemNbr: 1234567890,
    upcNbr: '000055559999',
    catgNbr: 93,
    catgName: 'FOODSERVICE',
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: undefined,
    completedUserId: undefined,
    completed: false
  },
  {
    worklistType: 'CATEGORY',
    catgName: 'ELECTRONICS',
    catgNbr: 99,
    itemCount: 1
  },
  {
    worklistType: 'NO',
    itemName: 'ELECTRONIC ITEM',
    itemNbr: 987654321,
    upcNbr: '777555333',
    catgNbr: 99,
    catgName: 'ELECTRONICS',
    subCatgNbr: 0,
    subCatgName: undefined,
    completedTs: undefined,
    completedUserId: undefined,
    completed: false
  }
];
