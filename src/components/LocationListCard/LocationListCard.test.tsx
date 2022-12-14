import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import LocationListCard, { LocationList } from './LocationListCard';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

const mockLocationList: LocationList[] = [{
  sectionId: 1502,
  locationName: 'A1-1',
  quantity: 22,
  palletId: 4928,
  increment: jest.fn,
  decrement: jest.fn,
  onDelete: jest.fn,
  qtyChange: jest.fn,
  onEndEditing: jest.fn,
  onCalcPress: jest.fn,
  scanned: false,
  locationType: 'floor'
}];

describe('Tests LocationListCard Component', () => {
  it('should tests redering LocationListCard with location list', async () => {
    const { toJSON } = render(
      <LocationListCard
        locationList={mockLocationList}
        locationType="floor"
        loading={false}
        error={false}
        onRetry={jest.fn}
        scanRequired={false}
        showCalculator={false}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('should tests redering LocationListCard with location list and calculator', async () => {
    const { toJSON } = render(
      <LocationListCard
        locationList={mockLocationList}
        locationType="floor"
        loading={false}
        error={false}
        onRetry={jest.fn}
        scanRequired={false}
        showCalculator={true}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('should tests rendering LocationListCard with error prop as true', async () => {
    const { toJSON } = render(
      <LocationListCard
        locationList={[]}
        locationType="floor"
        loading={false}
        error={true}
        onRetry={jest.fn}
        scanRequired={false}
        showCalculator={false}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('should tests rendering LocationListCard with loader while fetching async API data', async () => {
    const { toJSON } = render(
      <LocationListCard
        locationList={[]}
        locationType="floor"
        loading={true}
        error={false}
        onRetry={jest.fn}
        scanRequired={false}
        showCalculator={false}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('Tests add location button press functionality', () => {
    const mockAddCallbackFn = jest.fn();
    const { getByTestId } = render(
      <LocationListCard
        locationList={mockLocationList}
        locationType="floor"
        loading={false}
        add={mockAddCallbackFn}
        error={false}
        onRetry={jest.fn}
        scanRequired={false}
        showCalculator={false}
      />
    );
    const addLocationButton = getByTestId('add-location');
    fireEvent.press(addLocationButton);
    expect(mockAddCallbackFn).toBeCalledTimes(1);
  });
  it('Tests retry button press functionality while there is an error', () => {
    const mockRetryCallbackFn = jest.fn();
    const { getByTestId } = render(
      <LocationListCard
        locationList={[]}
        locationType="floor"
        loading={false}
        add={jest.fn}
        error={true}
        onRetry={mockRetryCallbackFn}
        scanRequired={false}
        showCalculator={false}
      />
    );
    const retryButton = getByTestId('retry-button');
    fireEvent.press(retryButton);
    expect(mockRetryCallbackFn).toBeCalledTimes(1);
  });
});
