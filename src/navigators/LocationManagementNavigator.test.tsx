import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { LocationManagementNavigatorStack } from './LocationManagementNavigator';

jest.mock('../utils/AppCenterTool.ts', () => jest.requireActual('../utils/__mocks__/AppCenterTool'));
jest.mock('../utils/sessionTimeout.ts', () => jest.requireActual('../utils/__mocks__/sessTimeout'));

describe('LocationManagement Navigator', () => {
  it('Renders the LocationManagement Navigator, non manager', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(<LocationManagementNavigatorStack dispatch={jest.fn()} userFeatures={[]} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the LocationManagement Navigator, manager', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(<LocationManagementNavigatorStack dispatch={jest.fn()} userFeatures={['manager approval']} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
