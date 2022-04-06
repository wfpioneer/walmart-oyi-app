import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import ItemDetails from '../../models/ItemDetails';
import Location from '../../models/Location';
import { CreatePickScreen, MOVE_TO_FRONT, UseStateType } from './CreatePick';

const mockLocations: Location[] = [
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
const mockItem: ItemDetails = {
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
  const selectedSectionState: UseStateType<string> = [
    '',
    mockSetSelectedSection
  ];
  const palletNumberState: UseStateType<number> = [
    1,
    mockSetPalletNumber
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the screen with item with floor locations', () => {
    const renderer = ShallowRenderer.createRenderer();

    const itemWithFloor: ItemDetails = {
      ...mockItem,
      location: {
        ...mockItem.location,
        floor: mockLocations
      }
    }

    const defaultSelectedSectionState: UseStateType<string> = [...selectedSectionState];
    defaultSelectedSectionState[0] = mockLocations[0].locationName;

    renderer.render(
      <CreatePickScreen
        item={itemWithFloor}
        selectedSectionState={defaultSelectedSectionState}
        palletNumberState={palletNumberState}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the screen without floor locations', () => {
    const renderer = ShallowRenderer.createRenderer();

    const itemWithoutFloor: ItemDetails = { ...mockItem };

    renderer.render(
      <CreatePickScreen
        item={itemWithoutFloor}
        selectedSectionState={selectedSectionState}
        palletNumberState={palletNumberState}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the screen with no reserve location', () => {
    const renderer = ShallowRenderer.createRenderer();

    const itemWithoutReserve: ItemDetails = {
      ...mockItem,
      location: {
        ...mockItem.location,
        reserve: undefined,
        floor: mockLocations
      }
    };

    renderer.render(
      <CreatePickScreen
        item={itemWithoutReserve}
        selectedSectionState={selectedSectionState}
        palletNumberState={palletNumberState}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the screen when items are move to front', () => {
    const renderer = ShallowRenderer.createRenderer();

    const itemWithFloor: ItemDetails = {
      ...mockItem,
      location: {
        ...mockItem.location,
        floor: mockLocations
      }
    }

    const moveToFrontSectionState: UseStateType<string> = [...selectedSectionState];
    moveToFrontSectionState[0] = MOVE_TO_FRONT;

    renderer.render(
      <CreatePickScreen
        item={itemWithFloor}
        selectedSectionState={moveToFrontSectionState}
        palletNumberState={palletNumberState}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  })
});
