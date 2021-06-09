import ShallowRenderer from 'react-test-renderer/shallow';
import { QuantityChange, qtyStyleChange } from './QuantityChange';
import styles from './QuantityChange.style';

interface ItemQuantity {
  newQuantity: number;
  oldQuantity: number;
  dollarChange: number;
}
describe('QuantityChange Component', () => {
  const positiveItem: ItemQuantity = {
    newQuantity: 20,
    oldQuantity: 5,
    dollarChange: 200.00
  };
  const negativeItem: ItemQuantity = {
    newQuantity: 10,
    oldQuantity: 30,
    dollarChange: 100.00

  };
  describe('Tests rendering Quantity On-Hands Change:', () => {
    it('Renders positive change in quantity', () => {
      const renderer = ShallowRenderer.createRenderer();
      const { oldQuantity, newQuantity, dollarChange } = positiveItem;
      renderer.render(
        QuantityChange(oldQuantity, newQuantity, dollarChange)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders negative change in quantity', () => {
      const renderer = ShallowRenderer.createRenderer();
      const { oldQuantity, newQuantity, dollarChange } = negativeItem;
      renderer.render(
        QuantityChange(oldQuantity, newQuantity, dollarChange)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders no change arrow if oldOHQuantity and newOHQuantity are zero', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        QuantityChange(0, 0, 0)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests qtyStyleChange function:', () => {
    it('qtyStyleChange returns positiveChange styling for increased new quantity change', () => {
      const { oldQuantity, newQuantity } = positiveItem;
      expect(qtyStyleChange(oldQuantity, newQuantity)).toBe(styles.positiveChange);
    });

    it('qtyStyleChange returns negativeChange styling for decreased new quantity change', () => {
      const { oldQuantity, newQuantity } = negativeItem;
      expect(qtyStyleChange(oldQuantity, newQuantity)).toBe(styles.negativeChange);
    });
    it('qtyStyleChange returns noOHChange styling if oldQuantity & newQuantity equal zero ', () => {
      const zeroQty = 0;
      expect(qtyStyleChange(zeroQty, zeroQty)).toBe(styles.noOHChange);
    });
  });
});
