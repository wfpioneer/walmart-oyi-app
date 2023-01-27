import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp } from '@react-navigation/native';
import LocationItemCard from './LocationItemCard';
import { LocationType } from '../../models/LocationType';

jest.mock('../../utils/AppCenterTool.ts', () => ({
  ...jest.requireActual('../../utils/__mocks__/AppCenterTool'),
  trackEvent: jest.fn()
}));

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'mockMaterialCommunityIcons');

// const mockDispatch = jest.fn();
// jest.mock('react-redux', () => {
//   const ActualReactRedux = jest.requireActual('react-redux');
//   return {
//     ...ActualReactRedux,
//     useDispatch: () => mockDispatch
//   };
// });

const navigationProp: NavigationProp<any> = {
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  dispatch: jest.fn(),
  goBack: jest.fn(),
  isFocused: jest.fn(() => true),
  removeListener: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
  navigate: jest.fn(),
  getState: jest.fn(),
  getParent: jest.fn(),
  getId: jest.fn()
};

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
      isFocused: jest.fn().mockReturnValue(true),
      goBack: jest.fn()
    }),
    useRoute: () => ({
      key: 'test',
      name: 'test'
    })
  };
});

const mockZoneItem = {
  zoneId: 1,
  zoneName: 'G - Grocery',
  aisleCount: 4
};

const mockAisleItem = {
  aisleId: 1,
  aisleName: 'Aisle G1',
  sectionCount: 10
};

const mockSectionItem = {
  sectionId: 1,
  sectionName: 'Section G1-1',
  itemCount: 2,
  palletCount: 4
};

describe('Test Location Item Card', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('Renders Location Item Card with mock Zone data with card button disabled', () => {
    const { toJSON } = render(
      <LocationItemCard
        location={mockZoneItem.zoneName}
        locationId={mockZoneItem.zoneId}
        locationType={LocationType.ZONE}
        locationName={mockZoneItem.zoneName}
        dispatch={jest.fn()}
        locationDetails={`${mockZoneItem.aisleCount} Aisles`}
        navigator={navigationProp}
        destinationScreen={LocationType.AISLE}
        locationPopupVisible={true}
        trackEventCall={jest.fn()}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('Renders Location Item Card with mock Zone data with card click', () => {
    const mockDispatch = jest.fn();
    const mockTrackEvent = jest.fn();
    const { getByTestId, toJSON } = render(
      <LocationItemCard
        location={mockZoneItem.zoneName}
        locationId={mockZoneItem.zoneId}
        locationType={LocationType.ZONE}
        locationName={mockZoneItem.zoneName}
        dispatch={mockDispatch}
        locationDetails={`${mockZoneItem.aisleCount} Aisles`}
        navigator={navigationProp}
        destinationScreen={LocationType.AISLE}
        locationPopupVisible={false}
        trackEventCall={mockTrackEvent}
      />
    );

    const btnCard = getByTestId('btnCard');
    fireEvent.press(btnCard);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith({ payload: { id: 1, name: 'G - Grocery' }, type: 'LOCATION/SELECT_ZONE' });
    expect(mockTrackEvent).toBeCalledWith(
      'Zone_List', { action: 'location_item_card_clicked', destinationScreen: 'Aisles', locationName: 'G - Grocery' }
    );
    expect(navigationProp.navigate).toHaveBeenCalledWith('Aisles');
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('Test Location Item Card', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('Renders Location Item Card with mock Aisle data', () => {
    const mockDispatch = jest.fn();
    const mockTrackEvent = jest.fn();
    const { getByTestId, toJSON } = render(
      <LocationItemCard
        location={mockAisleItem.aisleName}
        locationId={mockAisleItem.aisleId}
        locationType={LocationType.AISLE}
        locationName={mockAisleItem.aisleName}
        dispatch={mockDispatch}
        locationDetails={`${mockAisleItem.sectionCount} Sections`}
        navigator={navigationProp}
        destinationScreen={LocationType.SECTION}
        locationPopupVisible={false}
        trackEventCall={mockTrackEvent}
      />
    );

    const btnCard = getByTestId('btnCard');
    fireEvent.press(btnCard);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith({ payload: { id: 1, name: 'Aisle G1' }, type: 'LOCATION/SELECT_AISLE' });
    expect(mockTrackEvent).toBeCalledWith(
      'Aisle_List', { action: 'location_item_card_clicked', destinationScreen: 'Sections', locationName: 'Aisle G1' }
    );
    expect(navigationProp.navigate).toHaveBeenCalledWith('Sections');
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('Test Location Item Card', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('Renders Location Item Card with mock Section data', () => {
    const mockDispatch = jest.fn();
    const mockTrackEvent = jest.fn();
    const { getByTestId, toJSON } = render(
      <LocationItemCard
        location={mockSectionItem.sectionName}
        locationId={mockSectionItem.sectionId}
        locationType={LocationType.SECTION}
        locationName={mockSectionItem.sectionName}
        dispatch={mockDispatch}
        locationDetails={`${mockSectionItem.itemCount} Items, ${mockSectionItem.palletCount} Pallets`}
        navigator={navigationProp}
        destinationScreen={LocationType.SECTION_DETAILS}
        locationPopupVisible={false}
        trackEventCall={mockTrackEvent}
      />
    );

    const btnCard = getByTestId('btnCard');
    fireEvent.press(btnCard);
    expect(mockDispatch).toBeCalledTimes(2);
    expect(mockDispatch).toBeCalledWith(
      { payload: { id: 1, name: 'Section G1-1' }, type: 'LOCATION/SELECT_SECTION' }
    );
    expect(mockDispatch).toBeCalledWith({ type: 'GLOBAL/RESET_SCANNED_EVENT' });
    expect(mockTrackEvent).toBeCalledWith(
      'Section_List',
      { action: 'location_item_card_clicked', destinationScreen: 'SectionDetails', locationName: 'Section G1-1' }
    );
    expect(navigationProp.navigate).toHaveBeenCalledWith('SectionDetails');
    expect(toJSON()).toMatchSnapshot();
  });
});
