import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { ToolsScreen } from './Tools';

jest.mock('../../utils/AppCenterTool', () => jest.requireActual('../../utils/__mocks__/AppCenterTool'));
jest.mock('../../utils/sessionTimeout.ts', () => jest.requireActual('../../utils/__mocks__/sessTimeout'));

describe('ToolsScreen', () => {
  let navigationProp: NavigationProp<any>;

  describe('Tests rendering the Tools Screen', () => {
    it('Renders Tools screen', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <ToolsScreen
          navigation={navigationProp}
        />
      );

      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
