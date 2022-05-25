import { PrintQueueItem } from '../models/Printer';

export const mockPrintQueue: PrintQueueItem[] = [{
  itemName: 'Test item',
  itemNbr: 123456,
  upcNbr: '123456',
  catgNbr: 2,
  signQty: 1,
  paperSize: 'Small',
  worklistType: 'NSFL'
}];

export const mockLocationPrintQueue: PrintQueueItem[] = [
  {
    itemName: 'A1-1',
    signQty: 1,
    locationId: 1234,
    paperSize: 'Small'
  },
  {
    itemName: 'A1-2',
    signQty: 1,
    locationId: 4321,
    paperSize: 'Small',
  },
  {
    itemName: 'A1-3',
    signQty: 1,
    locationId: 9876,
    paperSize: 'Small'
  }
];

export const mockLargePrintQueue: PrintQueueItem[] = [{
  itemName: 'Test item',
  itemNbr: 123456,
  upcNbr: '123456',
  catgNbr: 2,
  signQty: 1,
  paperSize: 'XSmall',
  worklistType: 'NSFL'
}, {
  itemName: 'Test item',
  itemNbr: 123456,
  upcNbr: '123456',
  catgNbr: 2,
  signQty: 1,
  paperSize: 'Small',
  worklistType: 'NSFL'
}, {
  itemName: 'Test item',
  itemNbr: 123456,
  upcNbr: '123456',
  catgNbr: 2,
  signQty: 1,
  paperSize: 'Medium',
  worklistType: 'NSFL'
}, {
  itemName: 'Test item',
  itemNbr: 123456,
  upcNbr: '123456',
  catgNbr: 2,
  signQty: 1,
  paperSize: 'Large',
  worklistType: 'NSFL'
}, {
  itemName: 'Test item',
  itemNbr: 123456,
  upcNbr: '123456',
  catgNbr: 2,
  signQty: 1,
  paperSize: 'Wine',
  worklistType: 'NSFL'
}, {
  itemName: 'Store Use Item',
  itemNbr: 789012,
  upcNbr: '789012',
  catgNbr: 2,
  signQty: 1,
  paperSize: 'XSmall',
  worklistType: 'NSFL'
}, {
  itemName: 'Store Use Item',
  itemNbr: 789012,
  upcNbr: '789012',
  catgNbr: 2,
  signQty: 1,
  paperSize: 'Small',
  worklistType: 'NSFL'
}, {
  itemName: 'Store Use Item',
  itemNbr: 789012,
  upcNbr: '789012',
  catgNbr: 2,
  signQty: 1,
  paperSize: 'Medium',
  worklistType: 'NSFL'
}, {
  itemName: 'Store Use Item',
  itemNbr: 789012,
  upcNbr: '789012',
  catgNbr: 2,
  signQty: 1,
  paperSize: 'Large',
  worklistType: 'NSFL'
}, {
  itemName: 'Store Use Item',
  itemNbr: 789012,
  upcNbr: '789012',
  catgNbr: 2,
  signQty: 1,
  paperSize: 'Wine',
  worklistType: 'NSFL'
}];
