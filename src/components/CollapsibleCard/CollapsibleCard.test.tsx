import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import CollapsibleCard, { CollapsibleHeaderCard } from './CollapsibleCard';
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

describe('Tests CollapsibleCard Component', () => {
  it('should tests CollapsibleCard when the card is opened', async () => {
    const { toJSON } = render(
      <CollapsibleCard
        isOpened={true}
        title="History"
      >{`ABC`}</CollapsibleCard>
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('should tests CollapsibleCard when the card is closed', async () => {
    const { toJSON } = render(
      <CollapsibleCard
        title="History"
      >{`ABC`}</CollapsibleCard>
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('should test children of the card when it is opened', async () => {
    const { findByText } = render(
      <CollapsibleCard
        title="History"
      >{`ABC`}</CollapsibleCard>
    );
    expect(findByText('ABC')).toBeTruthy();
  });
});

describe('Tests CollapsibleHeaderCard Component', () => {
  it('should test CollapsibleHeaderCard onPress', async () => {
    const mockToggleOpen = jest.fn();
    const { findByTestId } = render(
      <CollapsibleHeaderCard
        toggleIsOpened={mockToggleOpen}
        isOpened={false}
        title="ABAR-1"
        icon=""
      />
    );
    const collapsibleCard = await findByTestId('collapsible-card');
    fireEvent.press(collapsibleCard);
    expect(mockToggleOpen).toHaveBeenCalledTimes(1);
    expect(mockToggleOpen).toHaveBeenCalledWith(true);
  });
  it('should test title of the card', () => {
    const { findByText } = render(
      <CollapsibleHeaderCard
        toggleIsOpened={jest.fn}
        isOpened={false}
        title="ABAR-1"
        icon=""
      />
    );
    expect(findByText('ABAR-1')).toBeTruthy();
  });
});
