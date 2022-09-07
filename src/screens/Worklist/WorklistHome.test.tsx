import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import { fireEvent, render } from '@testing-library/react-native';
import ShallowRenderer from 'react-test-renderer/shallow';
import { WorklistHomeScreen } from './WorklistHome';
import { mockConfig } from '../../mockData/mockConfig';

const navigationProp: NavigationProp<any> = {
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  getId: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn(),
  dispatch: jest.fn(),
  goBack: jest.fn(),
  isFocused: jest.fn(() => true),
  removeListener: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
  navigate: jest.fn()
};
const mockDispatch = jest.fn();

describe('WorkListHome', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Renders WorkListHome screen', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <WorklistHomeScreen
        navigation={navigationProp}
        dispatch={mockDispatch}
        configs={mockConfig}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders WorkListHome screen with Configs all configs enabled', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <WorklistHomeScreen
        navigation={navigationProp}
        dispatch={mockDispatch}
        configs={{ ...mockConfig, palletWorklists: true, auditWorklists: true }}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('test item worklist button functionality', () => {
    const { getByTestId } = render(
      <WorklistHomeScreen
        navigation={navigationProp}
        dispatch={mockDispatch}
        configs={mockConfig}
      />
    );
    const itemWorklistButton = getByTestId('itemWorkListButton');
    fireEvent.press(itemWorklistButton);
    expect(navigationProp.navigate).toBeCalledTimes(1);
  });

  it('test pallet worklist button functionality', () => {
    const { getByTestId } = render(
      <WorklistHomeScreen
        navigation={navigationProp}
        dispatch={mockDispatch}
        configs={{ ...mockConfig, palletWorklists: true }}
      />
    );
    const palletWorkListButton = getByTestId('palletWorkListButton');
    fireEvent.press(palletWorkListButton);
    expect(navigationProp.navigate).toBeCalledTimes(1);
  });

  it('test audit worklist button functionality', () => {
    const { getByTestId } = render(
      <WorklistHomeScreen
        navigation={navigationProp}
        dispatch={mockDispatch}
        configs={{ ...mockConfig, auditWorklists: true }}
      />
    );
    const palletWorkListButton = getByTestId('auditWorkListButton');
    fireEvent.press(palletWorkListButton);
    expect(navigationProp.navigate).toBeCalledTimes(1);
  });
});
