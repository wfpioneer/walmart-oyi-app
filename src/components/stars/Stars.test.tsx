import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { fireEvent, render } from '@testing-library/react-native';
import Stars from './Stars';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

describe('StarsComponent', () => {
  const mockInitialValue = 0;
  const mockOnValueChange = jest.fn();
  it('should render the component based on props', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <Stars initialValue={mockInitialValue} onValueChange={mockOnValueChange} />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('should render Stars component with intial value and defined size', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <Stars initialValue={mockInitialValue} onValueChange={mockOnValueChange} size={25} />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('tests press functionality on select rating', () => {
    const { getByTestId } = render(
      <Stars initialValue={mockInitialValue} onValueChange={mockOnValueChange} />
    );
    const mockIndex = 1;

    const rateIcon = getByTestId(`star-icon-${mockIndex}`);
    fireEvent.press(rateIcon);
    expect(mockOnValueChange).toHaveBeenCalledWith(mockIndex + 1);
  });
});
