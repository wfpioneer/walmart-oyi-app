import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { fireEvent, render } from '@testing-library/react-native';
import { NavigationProp } from '@react-navigation/native';
import {
  HomeNavigatorComponent, renderCamButton, renderHomeHeader, renderHomeMenuButton, renderHomeScanButton
} from './HomeNavigator';
import { Printer, PrinterType } from '../models/Printer';

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'mockMaterialCommunityIcons');
jest.mock('../utils/AppCenterTool', () => ({
  ...jest.requireActual('../utils/AppCenterTool'),
  initialize: jest.fn(),
  trackEvent: jest.fn(() => Promise.resolve()),
  setUserId: jest.fn(() => Promise.resolve())
}));
jest.mock('../utils/sessionTimeout.ts', () => ({
  ...jest.requireActual('../utils/sessionTimeout.ts'),
  validateSession: jest.fn(() => Promise.resolve())
}));

jest.mock('react-native-config', () => {
  const config = jest.requireActual('react-native-config');
  return {
    ...config,
    ENVIRONMENT: ' DEV'
  };
});

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

describe('Home Navigator', () => {
  const defPrinter = {
    type: PrinterType.LASER,
    name: 'PRINT.FRONT_DESK',
    desc: 'GENERICS.DEFAULT',
    id: '000000000000',
    labelsAvailable: ['price']
  };

  const componentProps = {
    logoutUser: jest.fn(),
    showActivityModal: jest.fn(),
    hideActivityModal: jest.fn(),
    navigation: navigationProp,
    isManualScanEnabled: true,
    setManualScan: jest.fn(),
    clubNbr: 1234,
    updatePrinterByID: jest.fn(),
    priceLabelPrinter: defPrinter as Printer,
    setPriceLabelPrinter: jest.fn()
  };

  it('Renders the Home navigator component', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(
      <HomeNavigatorComponent
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...componentProps}
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

  it('Renders the home header when isManualScanEnabled is true', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      renderHomeHeader(componentProps, navigationProp)
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the home header when isManualScanEnabled is false', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      renderHomeHeader({ ...componentProps, isManualScanEnabled: false }, navigationProp)
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the scanButton header icon when manual scan set to false', () => {
    const mockAppCenter = jest.requireMock('../utils/AppCenterTool.ts');
    const mockSetManualFunc = jest.fn();
    const { toJSON, getByTestId } = render(
      renderHomeScanButton(false, mockSetManualFunc)
    );
    expect(toJSON()).toMatchSnapshot();

    const btnScan = getByTestId('btnScan');
    fireEvent.press(btnScan);
    expect(mockAppCenter.trackEvent).toBeCalledWith('enable_manual_scan');
    expect(mockSetManualFunc).toBeCalledWith(true);
  });

  it('Renders the scanButton header icon when manual scan set to true', () => {
    const mockAppCenter = jest.requireMock('../utils/AppCenterTool.ts');
    const mockSetManualFunc = jest.fn();
    const { toJSON, getByTestId } = render(
      renderHomeScanButton(true, mockSetManualFunc)
    );
    expect(toJSON()).toMatchSnapshot();

    const btnScan = getByTestId('btnScan');
    fireEvent.press(btnScan);
    expect(mockAppCenter.trackEvent).toBeCalledWith('disable_manual_scan');
    expect(mockSetManualFunc).toBeCalledWith(false);
  });

  it('Renders the home menu button and onclick call track event', () => {
    const { toJSON } = render(
      renderHomeMenuButton(componentProps, navigationProp)
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
