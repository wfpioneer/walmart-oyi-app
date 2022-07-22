import React from 'react';
import { Provider } from 'react-redux';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  NavigationContainer, NavigationContext
} from '@react-navigation/native';
import store from '../state/index';
import HistoryNavigator from './ItemHistoryNavigator';

describe('render History Navigator', () => {
  it('Renders the History Navigator', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    const navContextValue = {
      ...actualNav.navigation,
      isFocused: () => false,
      addListener: jest.fn(() => jest.fn())
    };
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(
      <Provider store={store}>
        <NavigationContainer>
          <NavigationContext.Provider value={navContextValue}>
            <HistoryNavigator />
          </NavigationContext.Provider>
        </NavigationContainer>
      </Provider>
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
