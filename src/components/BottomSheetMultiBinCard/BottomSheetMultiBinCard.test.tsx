import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import BottomSheetMultiBinCard from './BottomSheetMultiBinCard';

describe('Multi bin card render tests', () => {
  it('renders the bottom sheet card with multi bin active', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(
      <BottomSheetMultiBinCard
        enableMultiBin={true}
        onPress={jest.fn()}
        text="hekki"
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the bottom sheet card with multi bin inactive', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(
      <BottomSheetMultiBinCard
        enableMultiBin={false}
        onPress={jest.fn()}
        text="hekki"
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
