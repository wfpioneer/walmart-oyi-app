import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { Provider } from 'react-redux';
import {
  WorklistNavigatorStack,
  WorklistTabs,
  onFilterMenuPress
} from './WorklistNavigator';
import store from '../state';
import { mockConfig } from '../mockData/mockConfig';

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

describe('Worklist Navigator', () => {
  it('Renders the worklist Navigator', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(
      <WorklistNavigatorStack
        dispatch={jest.fn()}
        menuOpen={true}
        navigation={navigationProp}
        userConfig={mockConfig}
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
          <WorklistTabs />
        </NavigationContainer>
      </Provider>
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
