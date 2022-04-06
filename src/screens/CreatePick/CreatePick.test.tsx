import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { fireEvent, render } from '@testing-library/react-native';
import ItemDetails from '../../models/ItemDetails';
import Location from '../../models/Location';
import { CreatePickScreen } from './CreatePick';

export const mockLocations: Location[] = [
  {
    aisleId: 2,
    aisleName: '1',
    locationName: 'ABAR1-1',
    sectionId: 3,
    sectionName: '1',
    type: 'floor',
    typeNbr: 2,
    zoneId: 1,
    zoneName: 'ABAR'
  },
  {
    aisleId: 2,
    aisleName: '2',
    locationName: 'ABAR1-2',
    sectionId: 4,
    sectionName: '2',
    type: 'floor',
    typeNbr: 2,
    zoneId: 1,
    zoneName: 'ABAR'
  }
];

// May need to use api call results as not all item details are stored in item details redux
export const mockItem: ItemDetails = {
  categoryNbr: 73,
  itemName: 'treacle tart',
  itemNbr: 2,
  upcNbr: '8675309',
  backroomQty: 765432,
  basePrice: 4.92,
  categoryDesc: 'Deli',
  claimsOnHandQty: 765457,
  completed: false,
  consolidatedOnHandQty: 65346,
  location: {
    reserve: [
      {
        aisleId: 5018,
        aisleName: '1',
        locationName: 'ABAR1-1',
        sectionId: 5019,
        sectionName: '1',
        type: 'reserve',
        typeNbr: 1,
        zoneId: 3632,
        zoneName: 'ABAR'
      }
    ],
    count: 1
  },
  onHandsQty: 76543234,
  pendingOnHandsQty: 2984328947,
  price: 4.92,
  replenishment: {
    onOrder: 100000
  },
  sales: {
    daily: [{
      day: 'Thursday',
      value: 3
    }],
    dailyAvgSales: 500,
    lastUpdateTs: 'right now',
    weekly: [{
      week: 34,
      value: 654
    }],
    weeklyAvgSales: 3500
  }
};

describe('Create Pick screen render tests', () => {
  const mockSetSelectedSection = jest.fn();
  const mockSetPalletNumber = jest.fn();
  const selectedSectionState: [string, React.Dispatch<React.SetStateAction<string>>] = [
    '',
    mockSetSelectedSection
  ];
  const palletNumberState: [number, React.Dispatch<React.SetStateAction<number>>] = [
    1,
    mockSetPalletNumber
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the screen with an item', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(
      <CreatePickScreen
        item={mockItem}
        selectedSectionState={selectedSectionState}
        palletNumberState={palletNumberState}
        floorLocations={mockLocations}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('tests the testable inputs', () => {
    const { getByTestId } = render(
      <CreatePickScreen
        item={mockItem}
        selectedSectionState={selectedSectionState}
        palletNumberState={palletNumberState}
        floorLocations={mockLocations}
      />
    );

    const createButton = getByTestId('createButton');
  });
});
