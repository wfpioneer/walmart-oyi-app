import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import SalesFloorItemCard from './SalesFloorItemCard';

describe('Sales floor item card render tests', () => {
  it('renders the item card', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(
      <SalesFloorItemCard
        assigned="vn50pz4"
        category={73}
        createdBy="t0s0og"
        createdTS="02/07/2022"
        decrementQty={jest.fn()}
        incrementQty={jest.fn()}
        itemDesc="Paganini"
        itemNbr={1234}
        onQtyTextChange={jest.fn()}
        onEndEditing={jest.fn()}
        quantity={4}
        salesFloorLocation="ABAR1-1"
        upcNbr="1234567890"
        decrementStockQty={jest.fn()}
        incrementStockQty={jest.fn()}
        onStockEndEditing={jest.fn()}
        onStockQtyTextChange={jest.fn()}
        stockedQty={0}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the item with an invalid quantity value', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(
      <SalesFloorItemCard
        assigned="vn50pz4"
        category={73}
        createdBy="t0s0og"
        createdTS="02/07/2022"
        decrementQty={jest.fn()}
        incrementQty={jest.fn()}
        itemDesc="Paganini"
        itemNbr={1234}
        onQtyTextChange={jest.fn()}
        onEndEditing={jest.fn()}
        quantity={0}
        salesFloorLocation="ABAR1-1"
        upcNbr="1234567890"
        decrementStockQty={jest.fn()}
        incrementStockQty={jest.fn()}
        onStockEndEditing={jest.fn()}
        onStockQtyTextChange={jest.fn()}
        stockedQty={5}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
