import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ShallowRenderer from 'react-test-renderer/shallow';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { Tabs } from '../models/Picking.d';
import {
  PickingNavigatorStack,
  kebabMenuButton,
  renderScanButton
} from './PickingNavigator';
import store from '../state';

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
jest.mock('../utils/AppCenterTool.ts', () => ({
  ...jest.requireActual('../utils/__mocks__/AppCenterTool'),
  trackEvent: jest.fn()
}));

jest.mock('../state/actions/Modal', () => ({
  showActivityModal: jest.fn(),
  hideActivityModal: jest.fn()
}));

jest.mock('../utils/AppCenterTool.ts', () => ({
  ...jest.requireActual('../utils/__mocks__/AppCenterTool'),
  trackEvent: jest.fn()
}));

jest.mock('../utils/sessionTimeout.ts', () => ({
  ...jest.requireActual('../utils/__mocks__/sessTimeout'),
  validateSession: jest.fn().mockImplementation(() => Promise.resolve())
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
    logout: jest.fn(() => Promise.resolve())
  };
});

describe('Picking Navigator', () => {
  it('Renders the Picking Navigator', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <PickingNavigatorStack
        dispatch={jest.fn()}
        isManualScanEnabled={false}
        selectedTab={Tabs.PICK}
        pickingMenu={false}
        multiBinEnabled={false}
        multiPickEnabled={false}
        multiBin={false}
        multiPick={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the Picking Navigator with kebab menu', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <PickingNavigatorStack
        dispatch={jest.fn()}
        isManualScanEnabled={false}
        selectedTab={Tabs.PICK}
        pickingMenu={false}
        multiBinEnabled={false}
        multiPickEnabled={false}
        multiBin={true}
        multiPick={false}
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

  it('Renders and Calls the Kebab Menu button', () => {
    const mockDispatch = jest.fn();

    const { toJSON, getByTestId } = render(
      kebabMenuButton(false, mockDispatch)
    );
    const pickMenu = getByTestId('picking-menu');
    fireEvent.press(pickMenu);

    expect(mockDispatch).toHaveBeenCalled();
    expect(toJSON()).toMatchSnapshot();
  });

  it('Should render PickingNavigatorStack with mock store', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <PickingNavigatorStack
            dispatch={jest.fn()}
            isManualScanEnabled={false}
            selectedTab={Tabs.PICK}
            pickingMenu={false}
            multiBinEnabled={false}
            multiPickEnabled={false}
            multiBin={false}
            multiPick={false}
          />
        </NavigationContainer>
      </Provider>
    );
  });
});
