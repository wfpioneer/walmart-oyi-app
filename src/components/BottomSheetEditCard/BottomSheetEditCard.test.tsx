import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import BottomSheetEditCard from './BottomSheetEditCard';

describe('Edit item render tests', () => {
  it('renders the bottom sheet edit item, visible', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <BottomSheetEditCard
        onPress={() => {}}
        text="Edit an item"
        isVisible={true}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
