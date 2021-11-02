import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import BottomSheetPrintCard from './BottomSheetPrintCard';

describe('Print card render tests', () => {
  it('renders the bottom sheet print card, not visible', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <BottomSheetPrintCard
        onPress={() => {}}
        text="print card"
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the bottom sheet print card, visible, manager and non manager option', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <BottomSheetPrintCard
        onPress={() => {}}
        text="print card"
        isVisible
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
