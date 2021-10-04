import { LocationItem } from '../models/LocationItems';

export const mockLocationDetails : LocationItem = {
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
      palletCreateTS: '2021-01-01',
      items: [
        {
          itemNbr: 500252,
          itemDesc: 'Nature Valley Honey Nut Granola Bars'
        },
        {
          itemNbr: 123456,
          itemDesc: 'Cabbage'
        }
      ]
    },
    {
      palletId: 123,
      palletCreateTS: '2021-01-10',
      items: [
        {
          itemNbr: 555555,
          itemDesc: 'Nature Valley Granola Bars'
        }
      ]
    },
    {
      palletId: 456,
      palletCreateTS: '1999-10-10',
      items: [
        {
          itemNbr: 980012,
          itemDesc: 'Cabbage'
        }
      ]
    }
  ]
};

export const mockLocationDetailsEmpty : LocationItem = {
  ...mockLocationDetails,
  floor: [],
  reserve: []
};

export const mockLocationDetailsLargeLocationCount : LocationItem = {
  ...mockLocationDetails,
  floor: Array.from({ length: 100 }, () => mockLocationDetails.floor[0]),
  reserve: Array.from({ length: 100 }, () => mockLocationDetails.reserve[0])
};
