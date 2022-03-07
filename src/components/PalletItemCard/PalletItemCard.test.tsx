import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import PalletItemCard, { styleSelector } from './PalletItemCard';
import styles from './PalletItemCard.style';

describe('PalletItemCard', () => {
  describe('Tests rendering PalletItemCard', () => {
    const renderer = ShallowRenderer.createRenderer();
    it('PalletItemCard with valid input', () => {
      renderer.render(<PalletItemCard
        itemName="Item1"
        price={12.78}
        upc="23423423423"
        itemNumber="234234234"
        decreaseQuantity={jest.fn()}
        increaseQuantity={jest.fn()}
        numberOfItems={1}
        deleteItem={jest.fn()}
        onTextChange={jest.fn()}
        markEdited={false}
        minValue={1}
        maxValue={2}
        isValid={true}
        isAdded={false}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders the card with edited true', () => {
      renderer.render(<PalletItemCard
        itemName="Item1"
        price={12.78}
        upc="23423423423"
        itemNumber="234234234"
        decreaseQuantity={jest.fn()}
        increaseQuantity={jest.fn()}
        numberOfItems={1}
        deleteItem={jest.fn()}
        onTextChange={jest.fn()}
        markEdited={true}
        minValue={1}
        maxValue={2}
        isValid={true}
        isAdded={false}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders the card with isAdded true', () => {
      renderer.render(<PalletItemCard
        itemName="Item1"
        price={12.78}
        upc="23423423423"
        itemNumber="234234234"
        decreaseQuantity={jest.fn()}
        increaseQuantity={jest.fn()}
        numberOfItems={1}
        deleteItem={jest.fn()}
        onTextChange={jest.fn()}
        markEdited={false}
        minValue={1}
        maxValue={2}
        isValid={true}
        isAdded={true}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests styleSelector function', () => {
    it('styleSelector returns added container if isAdded is true', () => {
      expect(styleSelector(true, false)).toStrictEqual(styles.addedContainer);
    });
    it('styleSelector returns added container if isAdded and isEdited is true', () => {
      expect(styleSelector(true, true)).toStrictEqual(styles.addedContainer);
    });
    it('styleSelector returns edited container if isEdited is true', () => {
      expect(styleSelector(false, true)).toStrictEqual(styles.editedContainer);
    });
    it('styleSelector returns default container if isAdded/isEdited is false', () => {
      expect(styleSelector(false, false)).toStrictEqual(styles.container);
    });
  });
});
