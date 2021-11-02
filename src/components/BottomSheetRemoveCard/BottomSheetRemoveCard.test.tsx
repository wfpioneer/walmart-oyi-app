import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import BottomSheetRemoveCard from './BottomSheetRemoveCard';

describe('Remove aisle render tests', () => {
  it('renders the bottom sheet remove aisle, non visible, non manager option', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <BottomSheetRemoveCard
        onPress={() => {}}
        text="Remove aisle"
        isVisible={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the bottom sheet remove aisle, visible, manager option', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <BottomSheetRemoveCard
        onPress={() => {}}
        text="Remove aisle"
        isVisible
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
