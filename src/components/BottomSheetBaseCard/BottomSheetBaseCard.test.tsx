import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import BottomSheetBaseCard from './BottomSheetBaseCard';

describe('Base card render tests', () => {
  it('renders the bottom sheet base card with image', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <BottomSheetBaseCard
        image={require('../../assets/images/sams_logo.jpeg')}
        onPress={() => {}}
        text="hello"
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the bottom sheet base card with material community icon', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <BottomSheetBaseCard
        onPress={() => {}}
        text="Heyo"
        materialIconName="pine-tree-fire"
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
