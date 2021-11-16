import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import NumericSelector from './NumericSelector';

describe('AddZoneScreen', () => {
  const value = 10;
  const renderer = ShallowRenderer.createRenderer();
  it('NumericSelector with valid input', () => {
    renderer.render(<NumericSelector
      isValid={true}
      onDecreaseQty={jest.fn()}
      onIncreaseQty={jest.fn()}
      onTextChange={jest.fn()}
      value={value}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('NumericSelector with invalid input', () => {
    renderer.render(<NumericSelector
      isValid={false}
      onDecreaseQty={jest.fn()}
      onIncreaseQty={jest.fn()}
      onTextChange={jest.fn()}
      value={value}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
