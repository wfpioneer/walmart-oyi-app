import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  LocationManagementNavigatorStack, renderCamButton, renderScanButton, resetLocManualScan
} from './LocationManagementNavigator';

jest.mock('../utils/AppCenterTool.ts', () => jest.requireActual('../utils/__mocks__/AppCenterTool'));
jest.mock('../utils/sessionTimeout.ts', () => jest.requireActual('../utils/__mocks__/sessTimeout'));

describe('LocationManagement Navigator', () => {
  it('Renders the LocationManagement Navigator, non manager', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationManagementNavigatorStack
        isManualScanEnabled={false}
        dispatch={jest.fn()}
        userFeatures={[]}
        locationPopupVisible={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the LocationManagement Navigator, manager', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationManagementNavigatorStack
        isManualScanEnabled={false}
        dispatch={jest.fn()}
        userFeatures={['manager approval']}
        locationPopupVisible={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the cameraButton header icon', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      renderCamButton()
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the scanButton header icon', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      renderScanButton(jest.fn(), false)
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Expects dispatch to be called if isManualScanEnabled is true for "resetLocManualScan()"', () => {
    const mockDispatch = jest.fn();
    const manualScanEnabled = true;
    resetLocManualScan(manualScanEnabled, mockDispatch);
    expect(mockDispatch).toHaveBeenCalled();
  });
});
