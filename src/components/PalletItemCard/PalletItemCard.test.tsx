import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import PalletItemCard from './PalletItemCard';

describe('PalletItemCard', () => {
  const renderer = ShallowRenderer.createRenderer();
  it('PalletItemCard with valid input', () => {
    renderer.render(<PalletItemCard
      itemName="Item1"
      amount="$12.78"
      upc="23423423423"
      itemNumber="234234234"
      decreaseQuantity={jest.fn()}
      increaseQuantity={jest.fn()}
      numberOfItems={1}
      deleteItem={jest.fn()}
      onTextChange={jest.fn()}
      markDelete={false}
      minValue={1}
      maxValue={2}
      isValid={true}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
