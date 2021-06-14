import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { QuantityChange, QuantityChangeProps, qtyStyleChange } from './QuantityChange';
import styles from './QuantityChange.style';

describe('QuantityChange Component', () => {
  const positiveItem: QuantityChangeProps = {
    oldQty: 5,
    newQty: 20,
    dollarChange: 200.00
  };
  const negativeItem: QuantityChangeProps = {
    oldQty: 30,
    newQty: 10,
    dollarChange: 100.00

  };
  describe('Tests rendering Quantity On-Hands Change:', () => {
    it('Renders positive change in quantity', () => {
      const renderer = ShallowRenderer.createRenderer();
      const { oldQty, newQty, dollarChange } = positiveItem;
      renderer.render(
        <QuantityChange
          oldQty={oldQty}
          newQty={newQty}
          dollarChange={dollarChange}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders negative change in quantity', () => {
      const renderer = ShallowRenderer.createRenderer();
      const { oldQty, newQty, dollarChange } = negativeItem;
      renderer.render(
        <QuantityChange
          oldQty={oldQty}
          newQty={newQty}
          dollarChange={dollarChange}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders no change arrow if oldOHQuantity and newOHQuantity are zero', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <QuantityChange
          oldQty={0}
          newQty={0}
          dollarChange={0}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests qtyStyleChange function:', () => {
    it('qtyStyleChange returns positiveChange styling for increased new quantity change', () => {
      const { oldQty, newQty } = positiveItem;
      expect(qtyStyleChange(oldQty, newQty)).toBe(styles.positiveChange);
    });

    it('qtyStyleChange returns negativeChange styling for decreased new quantity change', () => {
      const { oldQty, newQty } = negativeItem;
      expect(qtyStyleChange(oldQty, newQty)).toBe(styles.negativeChange);
    });
    it('qtyStyleChange returns noOHChange styling if oldQty & newQty equal zero ', () => {
      const zeroQty = 0;
      expect(qtyStyleChange(zeroQty, zeroQty)).toBe(styles.noOHChange);
    });
  });
});
