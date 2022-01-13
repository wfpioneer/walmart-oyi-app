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
      minValue={0}
      maxValue={100}
      value={value}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('NumericSelector minus button is disabled if value is less than or equal to minValue', () => {
    const min = 15;
    renderer.render(<NumericSelector
      isValid={true}
      onDecreaseQty={jest.fn()}
      onIncreaseQty={jest.fn()}
      onTextChange={jest.fn()}
      minValue={min}
      maxValue={100}
      value={value}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('NumericSelector plus button is disabled if value is greater than or equal to maxValue', () => {
    const max = 10;
    renderer.render(<NumericSelector
      isValid={true}
      onDecreaseQty={jest.fn()}
      onIncreaseQty={jest.fn()}
      onTextChange={jest.fn()}
      minValue={0}
      maxValue={max}
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
      minValue={0}
      maxValue={100}
      value={value}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
