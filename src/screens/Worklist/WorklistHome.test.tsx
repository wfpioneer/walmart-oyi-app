import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ShallowRenderer from 'react-test-renderer/shallow';
import WorklistHome from './WorklistHome';

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native') as any,
  useNavigation: () => ({
    navigate: mockedNavigate,
    dispatch: jest.fn
  })
}));

describe('WorkListHome', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Renders WorkListHome screen', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(
      <WorklistHome />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('test buttons in component', () => {
    const { getByTestId } = render(
      <WorklistHome />,
    );

    const itemWkListBtn = getByTestId('itemWkListBtn');
    fireEvent.press(itemWkListBtn);
    expect(mockedNavigate).toHaveBeenCalled();
  });
});
