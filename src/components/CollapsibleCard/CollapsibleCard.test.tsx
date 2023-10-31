import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import CollapsibleCard, { CollapsibleHeaderCard } from './CollapsibleCard';
import { TrackEventSource } from '../../models/Generics';

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('../../utils/AppCenterTool.ts', () => ({
  ...jest.requireActual('../../utils/__mocks__/AppCenterTool'),
  trackEvent: jest.fn()
}));

describe('Tests CollapsibleCard Component', () => {
  it('should tests CollapsibleCard when the card is opened', () => {
    const { toJSON } = render(
      <CollapsibleCard
        isOpened={true}
        title="History"
      >{`ABC`}</CollapsibleCard>
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('should tests CollapsibleCard when the card is closed', () => {
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
  const mockTrackEventSource: TrackEventSource = {
    action: 'test',
    screen: 'testScreen'
  }
  it('should test CollapsibleHeaderCard onPress', () => {
    const mockToggleOpen = jest.fn();
    const { getByTestId } = render(
      <CollapsibleHeaderCard
        toggleIsOpened={mockToggleOpen}
        isOpened={false}
        title="ABAR-1"
        icon="" 
        titleStyle={undefined} 
        trackEventSource={mockTrackEventSource}
        />
    );
    const collapsibleCard = getByTestId('collapsible-card');
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
        titleStyle={undefined} 
        trackEventSource={mockTrackEventSource}
        />
    );
    expect(findByText('ABAR-1')).toBeTruthy();
  });
});
