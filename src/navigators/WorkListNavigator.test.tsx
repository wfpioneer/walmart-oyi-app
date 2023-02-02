import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  WorklistNavigatorStack, WorklistTabs, onFilterMenuPress
} from './WorklistNavigator';

const navigationProp: NavigationProp<any> = {
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  dispatch: jest.fn(),
  goBack: jest.fn(),
  isFocused: jest.fn(),
  removeListener: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
  navigate: jest.fn(),
  getId: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn()
};

describe('worklist Navigator', () => {
  it('Renders the worklist Navigator', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(
      <WorklistNavigatorStack
        dispatch={jest.fn()}
        menuOpen={true}
        navigation={navigationProp}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('render onfilter menuPress', () => {
    const mockDispatch = jest.fn();
    onFilterMenuPress(mockDispatch, true);
    expect(mockDispatch).toHaveBeenCalled();
    onFilterMenuPress(mockDispatch, false);
    expect(mockDispatch).toHaveBeenCalled();
  });
  it('Renders the worklist Tabs', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(
      <WorklistTabs />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
