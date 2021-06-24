import { ApprovalListItem, approvalRequestSource, approvalStatus } from '../models/ApprovalListItem';

export const mockApprovals: ApprovalListItem[] = [{
  imageUrl: undefined,
  itemName: 'Nature Valley Crunchy Cereal Bars ',
  itemNbr: 123,
  upcNbr: 40000000123,
  categoryNbr: 1,
  categoryDescription: 'SNACKS',
  subCategoryNbr: 1,
  subCategoryDescription: '',
  newQuantity: 20,
  oldQuantity: 5,
  dollarChange: 150.50,
  initiatedUserId: 'Associate Employee',
  initiatedTimestamp: '2021-03-27T00:00:00.000Z',
  approvalStatus: approvalStatus.Pending,
  approvalRequestSource: approvalRequestSource.ItemDetails,
  isChecked: false,
  daysLeft: 3
}, {
  imageUrl: undefined,
  itemName: 'Red Apples',
  itemNbr: 456,
  upcNbr: 40000000456,
  categoryNbr: 2,
  categoryDescription: 'FRUITS/VEGETABLES',
  subCategoryNbr: 1,
  subCategoryDescription: '',
  newQuantity: 10,
  oldQuantity: 30,
  dollarChange: 50.00,
  initiatedUserId: 'Associate Worker',
  initiatedTimestamp: '2021-03-28T00:00:00.000Z',
  approvalStatus: approvalStatus.Pending,
  approvalRequestSource: approvalRequestSource.ItemDetails,
  isChecked: false,
  daysLeft: 2
}, {
  imageUrl: undefined,
  itemName: 'Cabbage',
  itemNbr: 457,
  upcNbr: 40000000457,
  categoryNbr: 2,
  categoryDescription: 'FRUITS/VEGETABLES',
  subCategoryNbr: 1,
  subCategoryDescription: '',
  newQuantity: 15,
  oldQuantity: 30,
  dollarChange: 40.00,
  initiatedUserId: 'Associate Worker',
  initiatedTimestamp: '2021-03-28T00:00:00.000Z',
  approvalStatus: approvalStatus.Pending,
  approvalRequestSource: approvalRequestSource.ItemDetails,
  isChecked: false,
  daysLeft: 2
}, {
  imageUrl: undefined,
  itemName: 'Strawberries',
  itemNbr: 458,
  upcNbr: 40000000458,
  categoryNbr: 2,
  categoryDescription: 'FRUITS/VEGETABLES',
  subCategoryNbr: 1,
  subCategoryDescription: '',
  newQuantity: 40,
  oldQuantity: 20,
  dollarChange: 80.00,
  initiatedUserId: 'Associate Worker',
  initiatedTimestamp: '2021-03-28T00:00:00.000Z',
  approvalStatus: approvalStatus.Pending,
  approvalRequestSource: approvalRequestSource.ItemDetails,
  isChecked: false,
  daysLeft: 2
}];

export const mockSelectedApprovals: ApprovalListItem[] = [{
  imageUrl: undefined,
  itemName: 'Nature Valley Crunchy Cereal Bars ',
  itemNbr: 123,
  upcNbr: 40000000123,
  categoryNbr: 1,
  categoryDescription: 'SNACKS',
  subCategoryNbr: 1,
  subCategoryDescription: '',
  newQuantity: 20,
  oldQuantity: 5,
  dollarChange: 150.50,
  initiatedUserId: 'Associate Employee',
  initiatedTimestamp: '2021-03-27T00:00:00.000Z',
  approvalStatus: approvalStatus.Pending,
  approvalRequestSource: approvalRequestSource.ItemDetails,
  isChecked: true
}, {
  imageUrl: undefined,
  itemName: 'Red Apples',
  itemNbr: 456,
  upcNbr: 40000000456,
  categoryNbr: 2,
  categoryDescription: 'FRUITS/VEGETABLES',
  subCategoryNbr: 1,
  subCategoryDescription: '',
  newQuantity: 10,
  oldQuantity: 30,
  dollarChange: 50.00,
  initiatedUserId: 'Associate Worker',
  initiatedTimestamp: '2021-03-28T00:00:00.000Z',
  approvalStatus: approvalStatus.Pending,
  approvalRequestSource: approvalRequestSource.ItemDetails,
  isChecked: true
}, {
  imageUrl: undefined,
  itemName: 'Cabbage',
  itemNbr: 457,
  upcNbr: 40000000457,
  categoryNbr: 2,
  categoryDescription: 'FRUITS/VEGETABLES',
  subCategoryNbr: 1,
  subCategoryDescription: '',
  newQuantity: 15,
  oldQuantity: 30,
  dollarChange: 40.00,
  initiatedUserId: 'Associate Worker',
  initiatedTimestamp: '2021-03-28T00:00:00.000Z',
  approvalStatus: approvalStatus.Pending,
  approvalRequestSource: approvalRequestSource.ItemDetails,
  isChecked: true
}, {
  imageUrl: undefined,
  itemName: 'Strawberries',
  itemNbr: 458,
  upcNbr: 40000000458,
  categoryNbr: 2,
  categoryDescription: 'FRUITS/VEGETABLES',
  subCategoryNbr: 1,
  subCategoryDescription: '',
  newQuantity: 40,
  oldQuantity: 20,
  dollarChange: 80.00,
  initiatedUserId: 'Associate Worker',
  initiatedTimestamp: '2021-03-28T00:00:00.000Z',
  approvalStatus: approvalStatus.Pending,
  approvalRequestSource: approvalRequestSource.ItemDetails,
  isChecked: true
}];

export const mockFailedData = {
  isWaiting: false,
  value: null,
  error: null,
  result: {
    status: 207,
    data: {
      skippedItems: [],
      data: [{
        message: 'failure', id: 4785, itemNbr: 125, statusCode: 500
      }],
      metadata: {
        skipped: 0,
        failure: 1,
        success: 0,
        total: 1
      }
    }
  }
};
export const mockMixedData = {
  isWaiting: false,
  value: null,
  error: null,
  result: {
    status: 207,
    data: {
      skippedItems: [],
      data: [{
        message: 'failure', id: 4785, itemNbr: 125, statusCode: 500
      }, {
        message: 'success', id: 4786, itemNbr: 126, statusCode: 200
      }, {
        message: 'success', id: 4787, itemNbr: 127, statusCode: 200
      }],
      metadata: {
        skipped: 0,
        failure: 1,
        success: 2,
        total: 3
      }
    }
  }
};
export const mockLargeFailedData = {
  isWaiting: false,
  value: null,
  error: null,
  result: {
    status: 207,
    data: {
      skippedItems: [],
      data: [{
        message: 'failure', id: 4785, itemNbr: 125, statusCode: 500
      },
      {
        message: 'failure', id: 4786, itemNbr: 126, statusCode: 500
      },
      {
        message: 'failure', id: 4787, itemNbr: 127, statusCode: 500
      },
      {
        message: 'failure', id: 4788, itemNbr: 128, statusCode: 500
      },
      {
        message: 'failure', id: 4789, itemNbr: 129, statusCode: 500
      },
      {
        message: 'failure', id: 4790, itemNbr: 130, statusCode: 500
      }
      ],
      metadata: {
        skipped: 0,
        failure: 6,
        success: 0,
        total: 6
      }
    }
  }
};
