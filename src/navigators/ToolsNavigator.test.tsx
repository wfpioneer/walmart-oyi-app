import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { ToolsNavigatorStack } from './ToolsNavigator';

jest.mock('../utils/AppCenterTool.ts', () => jest.requireActual('../utils/__mocks__/AppCenterTool'));
jest.mock('../utils/sessionTimeout.ts', () => jest.requireActual('../utils/__mocks__/sessTimeout'));

describe('Tools Navigator', () => {
  it('Renders the Tools Navigator', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(
      <ToolsNavigatorStack />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
