import { AsyncState } from '../models/AsyncState';
import { ItemPalletInfo } from '../models/AuditItem';
import { GetItemPalletsResponse } from '../models/ItemPallets';

export const itemPallets: GetItemPalletsResponse = {
  itemNbr: 987654321,
  upcNbr: '777555333',
  category: 99,
  pallets: [{
    palletId: 4598,
    quantity: 22,
    sectionId: 5578,
    locationName: 'D1-4',
    mixedPallet: false,
    upcNbr: '777555333'
  }]
};

export const mockPalletLocations: ItemPalletInfo[] = [{
  palletId: 6775,
  quantity: 1,
  sectionId: 3,
  locationName: 'A1-8',
  mixedPallet: true,
  newQty: 1,
  upcNbr: '000055559999'
},
{
  palletId: 6776,
  quantity: 1,
  sectionId: 3,
  locationName: 'C1-2',
  mixedPallet: true,
  newQty: 1,
  upcNbr: '000055559999'
},
{
  palletId: 6777,
  quantity: 1,
  sectionId: 3,
  locationName: 'B1-1',
  mixedPallet: true,
  newQty: 1,
  upcNbr: '000055559999'
},
{
  palletId: 6778,
  quantity: 1,
  sectionId: 3,
  locationName: 'A1-1',
  mixedPallet: true,
  newQty: 1,
  upcNbr: '000055559999'
}];

export const mockSortedLocations: ItemPalletInfo[] = [{
  palletId: 6778,
  quantity: 1,
  sectionId: 3,
  locationName: 'A1-1',
  mixedPallet: true,
  newQty: 1,
  upcNbr: '000055559999'
},
{
  palletId: 6775,
  quantity: 1,
  sectionId: 3,
  locationName: 'A1-8',
  mixedPallet: true,
  newQty: 1,
  upcNbr: '000055559999'
},
{
  palletId: 6777,
  quantity: 1,
  sectionId: 3,
  locationName: 'B1-1',
  mixedPallet: true,
  newQty: 1,
  upcNbr: '000055559999'
},
{
  palletId: 6776,
  quantity: 1,
  sectionId: 3,
  locationName: 'C1-2',
  mixedPallet: true,
  newQty: 1,
  upcNbr: '000055559999'
}];

export const mockGetItemPalletsAsyncState : AsyncState = {
  isWaiting: false,
  value: null,
  result: {
    status: 200,
    data: itemPallets
  },
  error: null
};
