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
  items: {
    sectionItems: [
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
    ]
  },
  pallets: {
    palletData: [
      {
        palletId: 1,
        palletCreateTS: '2021-01-01'
      },
      {
        palletId: 123,
        palletCreateTS: '2021-01-10'
      },
      {
        palletId: 456,
        palletCreateTS: '1999-10-10'
      }
    ]
  }
};

export const mockLocationDetailsEmpty : LocationItem = {
  ...mockLocationDetails,
  items: { sectionItems: [] },
  pallets: { palletData: [] }
};

export const mockLocationDetailsLargeLocationCount : LocationItem = {
  ...mockLocationDetails,
  items: { sectionItems: Array.from({ length: 100 }, () => mockLocationDetails.items.sectionItems[0]) },
  pallets: { palletData: Array.from({ length: 100 }, () => mockLocationDetails.pallets.palletData[0]) }
};
