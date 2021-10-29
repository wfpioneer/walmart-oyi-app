import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import BottomSheetClearAisle from './BottomSheetClearAisle';

describe('Clear aisle render tests', () => {
  it('renders the bottom sheet Clear aisle, non visible, non manager option', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <BottomSheetClearAisle
        onPress={() => {}}
        text="Clear aisle"
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the bottom sheet remove card, visible, manager option', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <BottomSheetClearAisle
        onPress={() => {}}
        text="Clear aisle"
        isVisible
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
