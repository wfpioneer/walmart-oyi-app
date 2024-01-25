import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import mockUser from '../mockData/mockUser';
import {
  TabNavigatorStack, tabBarOptions
} from './TabNavigator';

jest.mock('../locales', () => ({
  ...jest.requireActual('../locales'),
  strings: (key: string) => key
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: jest.fn(() => ({
    Navigator: jest.fn(),
    Screen: jest.fn()
  }))
}));

describe('Tab Navigator', () => {
  it('Render ReviewItemsNavigator', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <TabNavigatorStack
        user={mockUser}
        selectedAmount={0}
        dispatch={jest.fn()}
        palletWorklists={false}
        auditWorklists={false}
        isBottomTabEnabled={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Render ReviewItemsNavigator with user features', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <TabNavigatorStack
        user={mockUser}
        selectedAmount={0}
        dispatch={jest.fn()}
        palletWorklists={true}
        auditWorklists={true}
        isBottomTabEnabled={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders TabNavigatorStack with isBottomTabEnabled as true', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <TabNavigatorStack
        user={mockUser}
        selectedAmount={0}
        dispatch={jest.fn()}
        palletWorklists={true}
        auditWorklists={true}
        isBottomTabEnabled={true}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Should return the expected options from tabBarOptions', () => {
    const props = {
      selectedAmount: 0,
      user: mockUser,
      dispatch: jest.fn(),
      palletWorklists: true,
      auditWorklists: true,
      isBottomTabEnabled: true
    };
    const route = {
      key: 'Home',
      name: 'HOME.HOME'
    };
    const result = tabBarOptions(props, route);

    expect(result).toEqual({
      tabBarIcon: expect.any(Function),
      tabBarStyle: { display: 'flex' },
      tabBarActiveTintColor: expect.any(String),
      tabBarInactiveTintColor: expect.any(String),
      headerShown: false
    });
  });
});
