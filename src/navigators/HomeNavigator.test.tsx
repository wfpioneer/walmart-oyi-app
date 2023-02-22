import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { fireEvent, render } from '@testing-library/react-native';
import { NavigationProp } from '@react-navigation/native';
import {
  HomeNavigatorComponent, renderCamButton, renderHomeHeader, renderHomeMenuButton,
  renderHomeScanButton, showSignOutMenu
} from './HomeNavigator';
import { Printer, PrinterType } from '../models/Printer';
import { mockConfig } from '../mockData/mockConfig';

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

jest.mock('react-native-action-sheet', () => {
  const config = jest.requireActual('react-native-action-sheet');
  return {
    ...config,
    ActionSheet: jest.fn(),
    showActionSheetWithOptions: jest.fn()
  };
});

jest.mock('../utils/scannerUtils', () => ({
  openCamera: jest.fn()
}));

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
    setPriceLabelPrinter: jest.fn(),
    resetPrintQueue: jest.fn(),
    clearLocationPrintQueue: jest.fn(),
    userConfig: mockConfig
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
  it('Render homeMenu Button onclick ', () => {
    const mockAppCenter = jest.requireMock('../utils/AppCenterTool.ts');
    const { getByTestId } = render(
      renderHomeMenuButton(componentProps, navigationProp)
    );
    const btnScan = getByTestId('btnShowMenu');
    fireEvent.press(btnScan);
    expect(mockAppCenter.trackEvent).toBeCalledWith('menu_button_click');
  });
  it('Render showSignoutMenu', () => {
    const actionSheetmock = jest.requireMock('react-native-action-sheet');
    componentProps.userConfig={...mockConfig, showFeedback: true};
    showSignOutMenu(componentProps, navigationProp);
    expect(actionSheetmock.showActionSheetWithOptions).toBeCalled();
  });
  it('Click action to open camera', () => {
    const { getByTestId, toJSON } = render(
      renderCamButton()
    );
    const btn = getByTestId('camerabtn');
    fireEvent.press(btn);

    expect(toJSON()).toMatchSnapshot();
  });
});
