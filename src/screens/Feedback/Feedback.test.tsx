import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { FeedbackScreen } from './Feedback';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

describe('Feedback Screen', () => {
  const mockRate = 0;
  const mockSetRate = jest.fn();
  const mockDispatch = jest.fn();
  it('should render the screen based on props', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <FeedbackScreen rate={mockRate} setRate={mockSetRate} dispatch={mockDispatch} />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
