import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  LocationManagementNavigatorStack, renderCamButton, renderScanButton, resetLocManualScan
} from './LocationManagementNavigator';
import { AsyncState } from '../models/AsyncState';
import User from '../models/User';
import { mockConfig } from '../mockData/mockConfig';

jest.mock('../utils/AppCenterTool.ts', () => jest.requireActual('../utils/__mocks__/AppCenterTool'));
jest.mock('../utils/sessionTimeout.ts', () => jest.requireActual('../utils/__mocks__/sessTimeout'));
let navigationProp: NavigationProp<any>;

describe('LocationManagement Navigator', () => {
  const defaultAsyncState: AsyncState = {
    isWaiting: false,
    error: null,
    value: null,
    result: null
  };
  const user: User = {
    userId: 'vn50pz4',
    additional: {
      clockCheckResult: 'yo',
      displayName: 'Kyle Welch',
      loginId: 'vn50pz4',
      mailId: 'vn50pz4@homeoffice.wal-mart.com'
    },
    configs: mockConfig,
    countryCode: 'CN',
    domain: 'Homeoffice',
    features: [],
    siteId: 5597,
    token: 'gibberish'
  };
  // TODO we are not able to currentlt test the navigator's headers through simple snapshot tests
  it('Renders the LocationManagement Navigator, non manager', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationManagementNavigatorStack
        isManualScanEnabled={false}
        dispatch={jest.fn()}
        navigation={navigationProp}
        user={{ ...user, features: ['location management edit'] }}
        locationPopupVisible={false}
        getSectionDetailsApi={defaultAsyncState}
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
        navigation={navigationProp}
        user={{ ...user, features: ['manager approval', 'location management edit'] }}
        locationPopupVisible={false}
        getSectionDetailsApi={defaultAsyncState}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the LocationManagement Navigator with LocationKebabMenu disabled', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationManagementNavigatorStack
        isManualScanEnabled={false}
        dispatch={jest.fn()}
        navigation={navigationProp}
        user={user}
        locationPopupVisible={false}
        getSectionDetailsApi={defaultAsyncState}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the LocationManagement Navigator with Print List Button', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationManagementNavigatorStack
        isManualScanEnabled={false}
        dispatch={jest.fn()}
        navigation={navigationProp}
        user={{ ...user, features: ['location management edit'] }}
        locationPopupVisible={false}
        getSectionDetailsApi={defaultAsyncState}
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
