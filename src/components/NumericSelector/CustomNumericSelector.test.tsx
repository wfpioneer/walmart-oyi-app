import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import CustomNumericSelector from './CustomNumericSelector';

describe('Custom Numeric selector component', () => {
  const value = 10;
  const renderer = ShallowRenderer.createRenderer();
  it('CustomNumericSelector with valid input', () => {
    renderer.render(<CustomNumericSelector
      isValid={true}
      onDecreaseQty={jest.fn()}
      onIncreaseQty={jest.fn()}
      onInputPress={jest.fn()}
      minValue={0}
      maxValue={100}
      value={value}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('CustomNumericSelector minus button is disabled if value is less than or equal to minValue', () => {
    const min = 15;
    renderer.render(<CustomNumericSelector
      isValid={true}
      onDecreaseQty={jest.fn()}
      onIncreaseQty={jest.fn()}
      onInputPress={jest.fn()}
      minValue={min}
      maxValue={100}
      value={value}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('CustomNumericSelector plus button is disabled if value is greater than or equal to maxValue', () => {
    const max = 10;
    renderer.render(<CustomNumericSelector
      isValid={true}
      onDecreaseQty={jest.fn()}
      onIncreaseQty={jest.fn()}
      onInputPress={jest.fn()}
      minValue={0}
      maxValue={max}
      value={value}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('CustomNumericSelector with invalid input', () => {
    renderer.render(<CustomNumericSelector
      isValid={false}
      onDecreaseQty={jest.fn()}
      onIncreaseQty={jest.fn()}
      onInputPress={jest.fn()}
      minValue={0}
      maxValue={100}
      value={value}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
