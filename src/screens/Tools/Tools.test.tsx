import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import User from '../../models/User';
import { ToolsScreen } from './Tools';

jest.mock('../../utils/AppCenterTool', () => jest.requireActual('../../utils/__mocks__/AppCenterTool'));
jest.mock('../../utils/sessionTimeout.ts', () => jest.requireActual('../../utils/__mocks__/sessTimeout'));

describe('ToolsScreen', () => {
  let navigationProp: NavigationProp<any>;
  const mockConfigs = {
    locationManagement: false,
    locationManagementEdit: false,
    palletManagement: false,
    settingsTool: false,
    printingUpdate: false
  };
  describe('Tests rendering the Tools Screen', () => {
    const testUser: User = {
      additional: {
        clockCheckResult: '',
        displayName: '',
        loginId: '',
        mailId: ''
      },
      countryCode: '',
      domain: '',
      siteId: 1,
      token: 'aFakeToken',
      userId: 'aFakeUserId',
      features: [],
      configs: {
        ...mockConfigs
      }
    };
    it('Renders Tools screen, location management enabled by fluffy', () => {
      const renderer = ShallowRenderer.createRenderer();
      const userFeatures = ['location management'];

      renderer.render(
        <ToolsScreen
          navigation={navigationProp}
          user={{ ...testUser, features: userFeatures }}
        />
      );

      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders tools screen, location management enabled by config', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <ToolsScreen
          navigation={navigationProp}
          user={{
            ...testUser,
            configs: {
              ...mockConfigs,
              locationManagement: true
            }
          }}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders tools screen, pallet management enabled by config', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <ToolsScreen
          navigation={navigationProp}
          user={{
            ...testUser,
            configs: {
              ...mockConfigs,
              palletManagement: true
            }
          }}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders tools screen, SettingsTool enabled by config', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <ToolsScreen
          navigation={navigationProp}
          user={{
            ...testUser,
            configs: {
              ...mockConfigs,
              settingsTool: true
            }
          }}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
