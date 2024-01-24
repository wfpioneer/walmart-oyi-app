import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { fireEvent, render } from '@testing-library/react-native';
import { NavigationProp } from '@react-navigation/native';
import { setLanguage } from '../locales';
import {
  HomeNavigatorComponent,
  handleLanguageChange,
  handleSignOut,
  logoutPFUser,
  renderCamButton,
  renderHomeHeader,
  renderHomeMenuButton,
  renderHomeScanButton,
  renderPrintQueueButton,
  showSignOutMenu,
  updateDefaultPrinter
} from './HomeNavigator';
import { Printer, PrinterType } from '../models/Printer';
import { mockConfig } from '../mockData/mockConfig';

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock(
  'react-native-vector-icons/MaterialCommunityIcons',
  () => 'mockMaterialCommunityIcons'
);
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
jest.mock('../locales', () => ({
  ...jest.requireActual('../locales'),
  setLanguage: jest.fn()
}));

jest.mock('appcenter-analytics', () => ({
  ...jest.requireActual('appcenter-analytics'),
  trackEvent: jest.fn()
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
  openCamera: jest.fn(),
  barcodeEmitter: {
    addListener: jest.fn(),
    remove: jest.fn()
  }
}));

jest.mock('react-native-app-auth', () => {
  const appAuthActual = jest.requireActual('react-native-app-auth');
  return {
    ...appAuthActual,
    authorize: jest.fn(() => Promise.resolve({
      accessToken: 'dummyAccessToken',
      refreshToken: 'dummyRefreshToken',
      idToken: 'dummyIdToken',
      accessTokenExpirationDate: '1970-01-01',
      tokenType: 'Bearer',
      scopes: [],
      authorizationCode: 'dummyAuthCode'
    })),
    refresh: jest.fn(() => Promise.resolve()),
    logout: jest.fn(() => Promise.resolve()),
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
    setPriceLabelPrinter: jest.fn(),
    resetPrintQueue: jest.fn(),
    clearLocationPrintQueue: jest.fn(),
    userConfig: mockConfig,
    userTokens: {
      accessToken: 'dummyAccessToken',
      refreshToken: 'dummyRefreshToken',
      idToken: 'dummyIdToken',
      accessTokenExpirationDate: '1970-01-01',
      tokenType: 'Bearer',
      scopes: [],
      authorizationCode: 'dummyAuthCode'
    }
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
    renderer.render(renderCamButton());
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Renders the printQueueButton header icon', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(renderPrintQueueButton(navigationProp));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Renders the home header when isManualScanEnabled is true', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(renderHomeHeader(componentProps, navigationProp));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the home header when isManualScanEnabled is false', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      renderHomeHeader(
        { ...componentProps, isManualScanEnabled: false },
        navigationProp
      )
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
  it('Render print queue button ', () => {
    const { toJSON, getByTestId } = render(
      renderPrintQueueButton(navigationProp)
    );
    const printButton = getByTestId('print-queue-button');
    fireEvent.press(printButton);
    expect(navigationProp.navigate).toHaveBeenCalled();
    expect(toJSON()).toMatchSnapshot();
  });
  it('Render showSignoutMenu', () => {
    const actionSheetmock = jest.requireMock('react-native-action-sheet');
    componentProps.userConfig = { ...mockConfig, showFeedback: true };
    showSignOutMenu(componentProps, navigationProp);
    expect(actionSheetmock.showActionSheetWithOptions).toHaveBeenCalledWith(
      {
        options: expect.any(Array),
        cancelButtonIndex: expect.any(Number)
      },
      expect.any(Function)
    );
  });
  it('Renders the showSignOutMenu without feedback option', () => {
    const actionSheetmock = jest.requireMock('react-native-action-sheet');
    componentProps.userConfig = { ...mockConfig, showFeedback: false };
    showSignOutMenu(componentProps, navigationProp);
    expect(actionSheetmock.showActionSheetWithOptions).toBeCalled();
  });
  it('Render updateDefaultPrinter', () => {
    updateDefaultPrinter(componentProps);
    // Verify that updatePrinterByID is called with the correct arguments
    expect(componentProps.updatePrinterByID).toHaveBeenCalledWith({
      id: '000000000000',
      printer: {
        type: PrinterType.LASER,
        name: expect.any(String),
        desc: expect.any(String),
        id: '000000000000',
        labelsAvailable: ['price']
      }
    });
  });
  it('Render logoutPFUser', async () => {
    await logoutPFUser(componentProps);
  });
  it('Render handleLanguageChange', () => {
    const navigation = {
      dispatch: jest.fn()
    };
    const languageOptions = ['en', 'es', 'zh'];
    const showFeedback = true;
    handleLanguageChange(languageOptions, showFeedback, componentProps, navigation);
    expect(componentProps.updatePrinterByID).toHaveBeenCalledWith({
      id: '000000000000',
      printer: {
        type: PrinterType.LASER,
        name: expect.any(String),
        desc: expect.any(String),
        id: '000000000000',
        labelsAvailable: ['price']
      }
    });
  });

  it('Handles language change to English', () => {
    const languageOptions = ['en', 'es', 'zh'];
    const showFeedback = true;
    const navigation = {
      dispatch: jest.fn()
    };
    const actionSheetmock = jest.requireMock('react-native-action-sheet');
    actionSheetmock.showActionSheetWithOptions.mockImplementation((options:any, callback:any) => {
      callback(0);
    });
    handleLanguageChange(languageOptions, showFeedback, componentProps, navigation);
    expect(setLanguage).toHaveBeenCalledWith('en');
  });

  it('Handles language change to Spanish', () => {
    const languageOptions = ['en', 'es', 'zh'];
    const showFeedback = true;
    const navigation = {
      dispatch: jest.fn()
    };
    const actionSheetmock = jest.requireMock('react-native-action-sheet');
    actionSheetmock.showActionSheetWithOptions.mockImplementation((options:any, callback:any) => {
      callback(1);
    });
    handleLanguageChange(languageOptions, showFeedback, componentProps, navigation);
    expect(setLanguage).toHaveBeenCalledWith('es');
  });

  it('Handles language change to Chinese', () => {
    const languageOptions = ['en', 'es', 'zh'];
    const showFeedback = true;
    const navigation = {
      dispatch: jest.fn()
    };
    const actionSheetmock = jest.requireMock('react-native-action-sheet');
    actionSheetmock.showActionSheetWithOptions.mockImplementation((options:any, callback:any) => {
      callback(2);
    });
    handleLanguageChange(languageOptions, showFeedback, componentProps, navigation);
    expect(setLanguage).toHaveBeenCalledWith('zh');
  });

  describe('Render handleSignOut', () => {
    const props = {
      logoutPFUser: jest.fn()
    };
    it('handles sign out successfully on Android', async () => {
      props.logoutPFUser.mockResolvedValueOnce(componentProps);
      await handleSignOut(componentProps);
      expect(componentProps.showActivityModal).toHaveBeenCalled();
      expect(componentProps.logoutUser).toHaveBeenCalled();
    });

    it('handles sign out failed', async () => {
      const errorMessage = 'Logout failed';
      props.logoutPFUser.mockRejectedValueOnce(new Error(errorMessage));
      await handleSignOut(componentProps);
      expect(componentProps.showActivityModal).toHaveBeenCalled();
      expect(componentProps.logoutUser).toHaveBeenCalled();
    });
  });

  it('Click action to open camera', () => {
    const { getByTestId, toJSON } = render(renderCamButton());
    const btn = getByTestId('camerabtn');
    fireEvent.press(btn);
    expect(toJSON()).toMatchSnapshot();
  });
});
