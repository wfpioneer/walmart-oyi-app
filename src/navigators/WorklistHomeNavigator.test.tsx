import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { WorklistHomeNavigatorStack } from './WorklistHomeNavigator';

jest.mock('../utils/AppCenterTool.ts', () => jest.requireActual('../utils/__mocks__/AppCenterTool'));
jest.mock('../utils/sessionTimeout.ts', () => jest.requireActual('../utils/__mocks__/sessTimeout'));

describe('WorklistHome Navigator', () => {
  it('Renders the WorklistHome Navigator', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(
      <WorklistHomeNavigatorStack />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
