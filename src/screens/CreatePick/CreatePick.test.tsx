import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import Toast from 'react-native-toast-message';
import { UseStateType } from '../../models/Generics.d';
import Location from '../../models/Location';
import { addLocationHandler, CreatePickScreen, getLocationsApiHook, MOVE_TO_FRONT } from './CreatePick';
import { NavigationProp } from '@react-navigation/native';
import { AsyncState } from '../../models/AsyncState';
import { PickCreateItem } from '../../models/Picking.d';

const defaultAsyncState: AsyncState = {
  isWaiting: false,
  value: null,
  error: null,
  result: null
};
const navigationProp: NavigationProp<any> = {
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  dangerouslyGetParent: jest.fn(),
  dangerouslyGetState: jest.fn(),
  dispatch: jest.fn(),
  goBack: jest.fn(),
  isFocused: jest.fn(() => true),
  removeListener: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
  navigate: jest.fn()
};

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

const mockReserveLocations: Location[] = [
  {
    aisleId: 3,
    aisleName: '2',
    locationName: 'ABAR2-2',
    sectionId: 3,
    sectionName: '1',
    type: 'floor',
    typeNbr: 2,
    zoneId: 1,
    zoneName: 'ABAR'
  },
  {
    aisleId: 3,
    aisleName: '2',
    locationName: 'ABAR2-2',
    sectionId: 4,
    sectionName: '2',
    type: 'floor',
    typeNbr: 2,
    zoneId: 1,
    zoneName: 'ABAR'
  }
];

const mockItem: PickCreateItem = {
  itemName: 'treacle tart',
  itemNbr: 2,
  upcNbr: '8675309',
  categoryNbr: 72,
  categoryDesc: 'Deli',
  price: 4.92
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

    const defaultSelectedSectionState: UseStateType<string> = [...selectedSectionState];
    defaultSelectedSectionState[0] = mockLocations[0].locationName;

    renderer.render(
      <CreatePickScreen
        item={mockItem}
        selectedSectionState={defaultSelectedSectionState}
        palletNumberState={palletNumberState}
        floorLocations={mockLocations}
        reserveLocations={mockReserveLocations}
        dispatch={jest.fn()}
        navigation={navigationProp}
        getLocationApi={defaultAsyncState}
        useEffectHook={jest.fn()}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the screen without floor locations', () => {
    const renderer = ShallowRenderer.createRenderer();

    const defaultSelectedSectionState: UseStateType<string> = [...selectedSectionState];
    defaultSelectedSectionState[0] = mockLocations[0].locationName;

    renderer.render(
      <CreatePickScreen
        item={mockItem}
        selectedSectionState={defaultSelectedSectionState}
        palletNumberState={palletNumberState}
        floorLocations={[]}
        reserveLocations={mockReserveLocations}
        dispatch={jest.fn()}
        navigation={navigationProp}
        getLocationApi={defaultAsyncState}
        useEffectHook={jest.fn()}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the screen with no reserve location', () => {
    const renderer = ShallowRenderer.createRenderer();

    const defaultSelectedSectionState: UseStateType<string> = [...selectedSectionState];
    defaultSelectedSectionState[0] = mockLocations[0].locationName;

    renderer.render(
      <CreatePickScreen
        item={mockItem}
        selectedSectionState={defaultSelectedSectionState}
        palletNumberState={palletNumberState}
        floorLocations={mockLocations}
        reserveLocations={[]}
        dispatch={jest.fn()}
        navigation={navigationProp}
        getLocationApi={defaultAsyncState}
        useEffectHook={jest.fn()}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the screen when items are move to front', () => {
    const renderer = ShallowRenderer.createRenderer();

    const moveToFrontSectionState: UseStateType<string> = [...selectedSectionState];
    moveToFrontSectionState[0] = MOVE_TO_FRONT;

    renderer.render(
      <CreatePickScreen
        item={mockItem}
        selectedSectionState={moveToFrontSectionState}
        palletNumberState={palletNumberState}
        floorLocations={mockLocations}
        reserveLocations={[]}
        dispatch={jest.fn()}
        navigation={navigationProp}
        getLocationApi={defaultAsyncState}
        useEffectHook={jest.fn()}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('createPick function tests', () => {
  it('addLocationHandler', () => {
    const mockDispatch = jest.fn();
    const mockNavigate = jest.fn();
    navigationProp.navigate = mockNavigate;
    addLocationHandler(mockItem, [], [], mockDispatch, navigationProp);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledTimes(1);
  });

  it('getLocationsApiHook', () => {
    const mockDispatch = jest.fn();

    // success
    const successAsyncState = {
      ...defaultAsyncState,
      result: {
        data: {
          location: {
            floor: mockLocations,
            reserve: mockReserveLocations
          }
        }
      }
    };
    getLocationsApiHook(successAsyncState, mockDispatch, true);
    expect(mockDispatch).toBeCalledTimes(4);
    expect(Toast.show).toBeCalledTimes(1);

    // failure
    mockDispatch.mockReset();
    // @ts-ignore
    Toast.show.mockReset();
    const failureAsyncState = {
      ...defaultAsyncState,
      error: 'test'
    };
    getLocationsApiHook(failureAsyncState, mockDispatch, true);
    expect(mockDispatch).toBeCalledTimes(2);
    expect(Toast.show).toBeCalledTimes(1);

    // waiting
    mockDispatch.mockReset();
    const waitingAsyncState = {
      ...defaultAsyncState,
      isWaiting: true
    };
    getLocationsApiHook(waitingAsyncState, mockDispatch, true);
    expect(mockDispatch).toBeCalledTimes(1);
  });
});
