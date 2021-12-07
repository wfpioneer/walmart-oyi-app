import { ReserveDetailsPallet } from '../models/LocationItems';
import { mockLocationDetails } from './locationDetails';

export interface ReservePallet extends ReserveDetailsPallet {
  palletId: number;
}
export const mockPalletDetails: ReserveDetailsPallet[] = [
  {
    id: 1,
    items: [
      {
        itemNbr: 500252,
        itemDesc: 'Nature Valley Honey Nut Granola Bars',
        price: 0
      },
      {
        itemNbr: 123456,
        itemDesc: 'Cabbage',
        price: 0
      }
    ],
    statusCode: 200
  },
  {
    id: 123,
    items: [
      {
        itemNbr: 456789,
        itemDesc: 'Nature Valley Granola Bars',
        price: 1298.0
      }
    ],
    statusCode: 200
  },
  {
    id: 456,
    items: [
      {
        itemNbr: 123789,
        itemDesc: 'MM电池5号24粒.',
        price: 29.9
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
