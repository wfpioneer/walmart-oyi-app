import { ApprovalListItem } from '../models/ApprovalListItem';

// Temporary Test Data until we connect with the BackEnd for the Approval API
export const mockApprovals: ApprovalListItem[] = [{
  imageUrl: undefined,
  itemName: 'Nature Valley Crunchy Cereal Bars ',
  itemNbr: 123,
  upcNbr: '40000000123',
  categoryNbr: 1,
  subCategoryNbr: 1,
  userId: 'Associate Employee',
  newQuantity: 20,
  oldQuantity: 5,
  dollarChange: 150.50,
  approvalStatus: 'Pending',
  approvalRequestSource: '',
  daysLeft: 3
}, {
  imageUrl: undefined,
  itemName: 'Red Apples',
  itemNbr: 456,
  upcNbr: '40000000456',
  userId: 'Associate Worker',
  categoryNbr: 1,
  subCategoryNbr: 1,
  newQuantity: 10,
  oldQuantity: 30,
  dollarChange: 50.00,
  approvalStatus: 'Pending',
  approvalRequestSource: '',
  daysLeft: 2
}];
