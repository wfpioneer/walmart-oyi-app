import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import BottomSheetAddBayCard from './BottomSheetAddBayCard';

describe('Add bay card render tests', () => {
  it('renders the bottom sheet add bay, not visible', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <BottomSheetAddBayCard
        onPress={() => {}}
        text="add bay"
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the bottom sheet add bay, visible, manager and non manager option', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <BottomSheetAddBayCard
        onPress={() => {}}
        text="add bay"
        isVisible
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
