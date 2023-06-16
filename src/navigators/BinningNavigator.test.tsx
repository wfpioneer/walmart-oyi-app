import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  BinningNavigatorStack, renderKebabButton, renderScanButton, resetManualScan
} from './BinningNavigator';

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

  it('renders the kebab button for the binning screen', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(
      renderKebabButton(jest.fn(), jest.fn())
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Expects dispatch to be called if isManualScanEnabled is true for "resetManualScan()"', () => {
    const mockDispatch = jest.fn();
    const manualScanEnabled = true;
    resetManualScan(manualScanEnabled, mockDispatch);
    expect(mockDispatch).toHaveBeenCalled();
  });
});
