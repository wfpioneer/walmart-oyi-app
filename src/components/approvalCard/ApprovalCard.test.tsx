import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  ApprovalCard, ApprovalCardProps, qtyStyleChange, renderQuantityChange
} from './ApprovalCard';
import styles from './ApprovalCard.style';

describe('ApprovalCard Component', () => {
  const positiveItem: ApprovalCardProps = {
    image: '../../assets/images/placeholder.png',
    itemNbr: 123,
    itemName: 'Test Item 123',
    userId: 'Associate Employee',
    daysLeft: 3,
    newQuantity: 20,
    oldQuantity: 5,
    dollarChange: 200.00,
    dispatch: jest.fn()
  };
  const negativeItem: ApprovalCardProps = {
    image: '../../assets/images/placeholder.png',
    itemNbr: 456,
    itemName: 'Test Item 456',
    userId: 'Associate Worker',
    daysLeft: 1,
    newQuantity: 10,
    oldQuantity: 30,
    dollarChange: 100.00,
    dispatch: jest.fn()
  };

  describe('Tests rendering ApprovalCard:', () => {
    it('Renders an Approval Item with a positive price change', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ApprovalCard
          dollarChange={positiveItem.dollarChange}
          daysLeft={positiveItem.daysLeft}
          image={positiveItem.image}
          itemName={positiveItem.itemName}
          itemNbr={positiveItem.itemNbr}
          oldQuantity={positiveItem.oldQuantity}
          newQuantity={positiveItem.newQuantity}
          userId={positiveItem.userId}
          dispatch={jest.fn()}
          isChecked={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders an Approval Item with a decreased change in quantity', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <ApprovalCard
          dollarChange={negativeItem.dollarChange}
          daysLeft={negativeItem.daysLeft}
          image={negativeItem.image}
          itemName={negativeItem.itemName}
          itemNbr={negativeItem.itemNbr}
          oldQuantity={negativeItem.oldQuantity}
          newQuantity={negativeItem.newQuantity}
          userId={negativeItem.userId}
          dispatch={negativeItem.dispatch}
          isChecked={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders the Approval Item CheckBox as "checked" ', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ApprovalCard
          dollarChange={0}
          daysLeft={0}
          image={undefined}
          itemName=""
          itemNbr={0}
          oldQuantity={0}
          newQuantity={0}
          userId=""
          dispatch={jest.fn()}
          isChecked={true}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders the Approval Item CheckBox as "unchecked" ', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ApprovalCard
          dollarChange={0}
          daysLeft={0}
          image={undefined}
          itemName=""
          itemNbr={0}
          oldQuantity={0}
          newQuantity={0}
          userId=""
          dispatch={jest.fn()}
          isChecked={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders zero if days left is undefined ', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ApprovalCard
          dollarChange={0}
          daysLeft={undefined}
          image={undefined}
          itemName=""
          itemNbr={0}
          oldQuantity={0}
          newQuantity={0}
          userId=""
          dispatch={jest.fn()}
          isChecked={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests rendering Quantity On-Hands Change:', () => {
    it('Renders positive change in quantity', () => {
      const renderer = ShallowRenderer.createRenderer();
      const { oldQuantity, newQuantity, dollarChange } = positiveItem;
      renderer.render(
        renderQuantityChange(oldQuantity, newQuantity, dollarChange)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders negative change in quantity', () => {
      const renderer = ShallowRenderer.createRenderer();
      const { oldQuantity, newQuantity, dollarChange } = negativeItem;
      renderer.render(
        renderQuantityChange(oldQuantity, newQuantity, dollarChange)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders no change arrow if oldOHQuantity and newOHQuantity are zero', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderQuantityChange(0, 0, 0)
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
