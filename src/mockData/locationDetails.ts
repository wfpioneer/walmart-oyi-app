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
      itemDesc: 'Nature Valley Sweet and Salty Granola Bars',
      price: 2.40
    },
    {
      itemNbr: 980011111,
      itemDesc: 'Nature Valley Honey Bars',
      price: 5.80
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
