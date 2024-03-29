import { BinningPallet } from '../models/Binning';

export const mockPallets: BinningPallet[] = [{
  id: '123456',
  expirationDate: '10/3/2022',
  items: [{
    itemDesc: 'itemDesc',
    price: 123,
    upcNbr: '12343534',
    itemNbr: 351231,
    quantity: 2
  }]
}, {
  id: '345345',
  expirationDate: '10/3/2022',
  items: [{
    itemDesc: 'itemDesc',
    price: 123,
    upcNbr: '345345',
    itemNbr: 351231,
    quantity: 2
  }]
}];
