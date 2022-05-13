import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ShallowRenderer from 'react-test-renderer/shallow';
import { CreatePickDialog } from './CreatePickDialog';
import { MOVE_TO_FRONT } from '../../screens/CreatePick/CreatePick';
import { strings } from '../../locales';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'mockMaterialCommunityIcons');

describe('Test createPickDialog Component', () => {
  it('Renders the createPickDialog component with location other than moveToFront selected', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <CreatePickDialog
        selectedSection=""
        setSelectedSection={jest.fn()}
        numberOfPallets={1}
        setNumberOfPallets={jest.fn()}
        isQuickPick={false}
        setIsQuickPick={jest.fn()}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
        locations={[]}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Renders the createPickDialog component with location moveToFront selected', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <CreatePickDialog
        selectedSection={MOVE_TO_FRONT}
        setSelectedSection={jest.fn()}
        numberOfPallets={1}
        setNumberOfPallets={jest.fn()}
        isQuickPick={false}
        setIsQuickPick={jest.fn()}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
        locations={[]}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('test buttons in component', () => {
    const mockClose = jest.fn();
    const mockSwitch = jest.fn();
    const mockSubmit = jest.fn();

    const { getByTestId } = render(
      <CreatePickDialog
        selectedSection={MOVE_TO_FRONT}
        setSelectedSection={jest.fn()}
        numberOfPallets={1}
        setNumberOfPallets={jest.fn()}
        isQuickPick={false}
        setIsQuickPick={mockSwitch}
        onClose={mockClose}
        onSubmit={mockSubmit}
        locations={[]}
      />,
    );

    const closeButton = getByTestId('closeButton');
    const switchButton = getByTestId('quickPickSwitch');
    const submitButton = getByTestId('submitButton');
    fireEvent.press(closeButton);
    expect(mockClose).toHaveBeenCalled();
    fireEvent(switchButton, 'onValueChange', true);
    expect(mockSwitch).toHaveBeenCalled();
    fireEvent.press(submitButton);
    expect(mockSubmit).toHaveBeenCalled();
  });
  it('should test existence of noOfpallets input element based on selectedSection other than MOVE_TO_FRONT', () => {
    const { queryAllByText } = render(
      <CreatePickDialog
        selectedSection="ABAR1-1"
        setSelectedSection={jest.fn()}
        numberOfPallets={1}
        setNumberOfPallets={jest.fn()}
        isQuickPick={false}
        setIsQuickPick={jest.fn}
        onClose={jest.fn}
        onSubmit={jest.fn}
        locations={[]}
      />,
    );
    expect(queryAllByText(strings('PICKING.NUMBER_PALLETS'))).toHaveLength(1);
  });
});
