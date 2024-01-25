import { NavigationContainer, NavigationProp, RouteProp } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react-native';
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

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useRoute: () => ({
      key: 'test',
      name: 'test'
    })
  };
});

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

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

  it('Render onfilter menuPress', () => {
    const mockDispatch = jest.fn();
    onFilterMenuPress(mockDispatch, true);
    expect(mockDispatch).toHaveBeenCalled();
    onFilterMenuPress(mockDispatch, false);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('Opens the menu when filter button is pressed', () => {
    const mockDispatch = jest.fn();
    const { getByTestId } = render(
      <Provider store={store}>
        <NavigationContainer>
          <WorklistNavigatorStack
            dispatch={mockDispatch}
            menuOpen={false}
            navigation={navigationProp}
            userConfig={mockConfig}
          />
        </NavigationContainer>
      </Provider>
    );
    const filterButton = getByTestId('header-right');
    fireEvent.press(filterButton);
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'WORKLIST_FILTER/TOGGLE_MENU',
        payload: true
      })
    );
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
