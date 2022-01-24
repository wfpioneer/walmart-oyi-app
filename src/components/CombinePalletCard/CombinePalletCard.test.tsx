import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { CombinePallet } from '../../models/PalletManagementTypes';
import CombinePalletCard from './CombinePalletCard';

describe('Test CombinePalletCard Component', () => {
  it('Renders the Combine Pallet Card', () => {
    const renderer = ShallowRenderer.createRenderer();
    const mockCombinePallet: CombinePallet = {
      itemCount: 5,
      palletId: 123
    };
    renderer.render(
      <CombinePalletCard item={mockCombinePallet} dispatch={jest.fn()} />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
