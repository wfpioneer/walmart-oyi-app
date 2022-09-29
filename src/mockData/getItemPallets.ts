import { AsyncState } from '../models/AsyncState';

export const itemPallets = {
  itemNbr: 987654321,
  upcNbr: '777555333',
  category: 99,
  pallets: [{
    palletId: '4598',
    quantity: 22,
    sectionId: 5578,
    locationName: 'D1-4',
    mixedPallet: false
  }]
};

export const mockGetItemPalletsAsyncState : AsyncState = {
  isWaiting: false,
  value: null,
  result: {
    status: 200,
    data: itemPallets
  },
  error: null
};
