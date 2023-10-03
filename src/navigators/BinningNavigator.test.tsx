import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { fireEvent, render } from '@testing-library/react-native';
import {
  BinningNavigatorStack, renderScanButton, resetManualScan
} from './BinningNavigator';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

describe('Binning Navigator', () => {
  it('Renders the Binning navigator component', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <BinningNavigatorStack
        isManualScanEnabled={false}
        dispatch={jest.fn}
        managePalletMenu={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the scanButton header icon for Binning Screen when rightmost button', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      renderScanButton(jest.fn(), false, true)
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the scanButton header icon for Binning Screen when not rightmost button', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      renderScanButton(jest.fn(), false, false)
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('presses the scanButton', () => {
    const mockDispatch = jest.fn();
    const { getByTestId } = render(renderScanButton(mockDispatch, true, false));

    const scanButton = getByTestId('scanButton');
    fireEvent.press(scanButton);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('Expects dispatch to be called if isManualScanEnabled is true for "resetManualScan()"', () => {
    const mockDispatch = jest.fn();
    const manualScanEnabled = true;
    resetManualScan(manualScanEnabled, mockDispatch);
    expect(mockDispatch).toHaveBeenCalled();
  });
});
