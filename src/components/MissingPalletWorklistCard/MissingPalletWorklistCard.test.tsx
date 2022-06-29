import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import MissingPalletWorklistCard from './MissingPalletWorklistCard';

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

describe('Tests rendering MissingPalletWorklistCard', () => {
  it('Renders the MissingPalletWorklistCard', () => {
    const { toJSON } = render(
      <MissingPalletWorklistCard
        palletId="7988"
        reportedBy="vn51wu8"
        reportedDate="26/06/2022"
        lastLocation="A1-1"
        expanded={false}
        addCallback={jest.fn()}
        deleteCallback={jest.fn()}
        navigateCallback={jest.fn()}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('Renders the MissingPalletWorklistCard with expanded prop as true', () => {
    const { toJSON } = render(
      <MissingPalletWorklistCard
        palletId="7989"
        reportedBy="vn51wu8"
        reportedDate="26/06/2022"
        lastLocation="A1-3"
        expanded={true}
        addCallback={jest.fn()}
        deleteCallback={jest.fn()}
        navigateCallback={jest.fn()}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('test actions on the Missing pallet Worklist card', () => {
    const mockAddCallback = jest.fn();
    const mockDeleteCallback = jest.fn();
    const mockNavigateCallback = jest.fn();
    const { getByTestId } = render(
      <MissingPalletWorklistCard
        palletId="7989"
        reportedBy="vn51wu8"
        reportedDate="26/06/2022"
        lastLocation="A1-3"
        expanded={true}
        addCallback={mockAddCallback}
        deleteCallback={mockDeleteCallback}
        navigateCallback={mockNavigateCallback}
      />
    );
    const addLocationButton = getByTestId('addLocationButton');
    const deletePalletButton = getByTestId('deletePalletButton');
    const missingPalletCard = getByTestId('missingPalletWorklistCard');

    fireEvent.press(missingPalletCard);
    expect(mockNavigateCallback).toBeCalledTimes(1);

    fireEvent.press(addLocationButton);
    expect(mockAddCallback).toBeCalledTimes(1);

    fireEvent.press(deletePalletButton);
    expect(mockDeleteCallback).toBeCalledTimes(1);
  });
});
