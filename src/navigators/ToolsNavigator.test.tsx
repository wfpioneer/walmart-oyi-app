import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { ToolsNavigatorStack } from './ToolsNavigator';

jest.mock('../utils/AppCenterTool.ts', () => jest.requireActual('../utils/__mocks__/AppCenterTool'));
jest.mock('../utils/sessionTimeout.ts', () => jest.requireActual('../utils/__mocks__/sessTimeout'));

let navigationProp: NavigationProp<any>;
describe('Tools Navigator', () => {
  it('Renders the Tools Navigator', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(
      <ToolsNavigatorStack dispatch={jest.fn()} isToolBarNavigation={true} navigation={navigationProp} />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
