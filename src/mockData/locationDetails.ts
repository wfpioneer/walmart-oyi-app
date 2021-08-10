import { LocationItem } from '../models/LocationItems';

export const mockLocationDetails : LocationItem[] = [
  {
    zone: {
      id: 1,
      name: 'G - Grocery'
    },
    aisle: {
      id: 1,
      name: 'Aisle 1'
    },
    section: {
      id: 1,
      name: 'Section 1'
    },
    floor: [
      {
        itemNbr: 980078597,
        itemDesc: 'Cabbage',
        price: 2.40
      }
    ],
    reserve: [
      {
        palletId: 1,
        palletCreateTS: '2021-1-1',
        items: [
          {
            itemNbr: 1,
            itemDesc: 'Cabbage',
            price: 2.40
          }
        ]
      }
    ]
  }
];
