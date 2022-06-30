import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  MissingPalletWorklistNavigatorStack,
  renderScanButton
} from './MissingPalletWorklistNavigator';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

describe('MissingPalletWorklist Navigator', () => {
  it('Renders the MissingPalletWorklist Navigator', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <MissingPalletWorklistNavigatorStack
        dispatch={jest.fn()}
        isManualScanEnabled={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders and Calls the Manual Scan Button', () => {
    const mockDispatch = jest.fn();

    const { toJSON, getByTestId } = render(
      renderScanButton(mockDispatch, false)
    );
    const scanButton = getByTestId('manual-scan');
    fireEvent.press(scanButton);

    expect(mockDispatch).toHaveBeenCalled();
    expect(toJSON()).toMatchSnapshot();
  });
});
