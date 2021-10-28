import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import BottomSheetBaseCard from './BottomSheetBaseCard';

describe('Base card render tests', () => {
  it('renders the bottom sheet base card', () => {
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
});
