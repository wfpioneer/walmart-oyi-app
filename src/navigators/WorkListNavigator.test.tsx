import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { Provider } from 'react-redux';
import {
  WorklistNavigatorStack, onFilterMenuPress, worklistTabs
} from './WorklistNavigator';
import store from '../state';

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
        inProgress={false}
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
      <Provider store={store}>
        <NavigationContainer>
          {worklistTabs(false)}
        </NavigationContainer>
      </Provider>
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the worklist Tabs with Pending tab enabled', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(
      <Provider store={store}>
        <NavigationContainer>
          {worklistTabs(true)}
        </NavigationContainer>
      </Provider>
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
