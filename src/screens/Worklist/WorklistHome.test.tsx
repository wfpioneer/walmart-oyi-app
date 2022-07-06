import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import { fireEvent, render } from '@testing-library/react-native';
import ShallowRenderer from 'react-test-renderer/shallow';
import { WorklistHomeScreen } from './WorklistHome';

const navigationProp: NavigationProp<any> = {
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  dangerouslyGetParent: jest.fn(),
  dangerouslyGetState: jest.fn(),
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
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('test item worklist button functionality', () => {
    const { getByTestId } = render(
      <WorklistHomeScreen
        navigation={navigationProp}
        dispatch={mockDispatch}
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
      />
    );
    const palletWorkListButton = getByTestId('palletWorkListButton');
    fireEvent.press(palletWorkListButton);
    expect(navigationProp.navigate).toBeCalledTimes(1);
  });
});
