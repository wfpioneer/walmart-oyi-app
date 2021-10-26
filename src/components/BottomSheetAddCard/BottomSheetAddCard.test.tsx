import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import BottomSheetAddCard from './BottomSheetAddCard';

describe('Add card render tests', () => {
  it('renders the bottom sheet add card, not visible', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <BottomSheetAddCard
        onPress={() => {}}
        text="hello"
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the bottom sheet add card, visible, non manager option', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <BottomSheetAddCard
        onPress={() => {}}
        text="hello"
        isVisible
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the bottom sheet add card, visible, manager option', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <BottomSheetAddCard
        onPress={() => {}}
        text="hello"
        isVisible
        isManagerOption
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
