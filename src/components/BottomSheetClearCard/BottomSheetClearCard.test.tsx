import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import BottomSheetClearCard from './BottomSheetClearCard';

describe('Clear aisle render tests', () => {
  it('renders the bottom sheet Clear aisle, non visible, non manager option', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <BottomSheetClearCard
        onPress={() => {}}
        text="Clear aisle"
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the bottom sheet remove card, visible, manager option', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <BottomSheetClearCard
        onPress={() => {}}
        text="Clear aisle"
        isVisible
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
