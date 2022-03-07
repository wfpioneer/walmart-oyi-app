import { ReserveDetailsPallet } from '../models/LocationItems';
import { mockLocationDetails } from './locationDetails';

export interface ReservePallet extends ReserveDetailsPallet {
  palletId: number;
}
const CREATION_DATE = '2022-01-05T12:04:50.000Z';
const EXPIRATION_DATE = '12/31/2022';
export const mockPalletDetails: ReserveDetailsPallet[] = [
  {
    id: 1,
    createDate: CREATION_DATE,
    expirationDate: EXPIRATION_DATE,
    items: [
      {
        itemNbr: 500252,
        itemDesc: 'Nature Valley Honey Nut Granola Bars',
        price: 0,
        upcNbr: '750500252570',
        locationType: 8
      },
      {
        itemNbr: 123456,
        itemDesc: 'Cabbage',
        price: 0,
        upcNbr: '123456000789',
        locationType: 8
      }
    ],
    statusCode: 200
  },
  {
    id: 123,
    createDate: CREATION_DATE,
    expirationDate: EXPIRATION_DATE,
    items: [
      {
        itemNbr: 456789,
        itemDesc: 'Nature Valley Granola Bars',
        price: 1298.0,
        upcNbr: '456789000123',
        locationType: 8
      }
    ],
    statusCode: 200
  },
  {
    id: 456,
    createDate: CREATION_DATE,
    expirationDate: EXPIRATION_DATE,
    items: [
      {
        itemNbr: 123789,
        itemDesc: 'MM电池5号24粒.',
        price: 29.9,
        upcNbr: '123789000456',
        locationType: 8
      }
    ],
    statusCode: 200
  }
];

export const mockCombinedReserveData: ReservePallet[] = [
  { ...mockPalletDetails[0], ...mockLocationDetails.pallets.palletData[0] },
  { ...mockPalletDetails[1], ...mockLocationDetails.pallets.palletData[1] },
  { ...mockPalletDetails[2], ...mockLocationDetails.pallets.palletData[2] }
];
