import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import BinningItemCard from './BinningItemCard';

describe('Binning Item card render tests', () => {
  it('renders the binning item card', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <BinningItemCard
        palletId={1}
        itemDesc="itemDesc"
        lastLocation="A1-1"
        canDelete
        onClick={jest.fn}
        onDelete={jest.fn}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('renders the binning item card without last loc', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <BinningItemCard
        palletId={1}
        itemDesc="itemDesc"
        canDelete
        onClick={jest.fn}
        onDelete={jest.fn}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('renders the binning item card for empty pallet', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <BinningItemCard
        palletId={1}
        itemDesc=""
        canDelete
        onClick={jest.fn}
        onDelete={jest.fn}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('renders the binning item card in read only mode', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <BinningItemCard
        palletId={1}
        itemDesc="itemDesc"
        lastLocation="A1-1"
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
