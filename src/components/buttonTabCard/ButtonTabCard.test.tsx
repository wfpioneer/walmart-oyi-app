import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { ButtonBottomTab } from './ButtonTabCard';

describe('ButtonTabCard Component', () => {
  it('Renders the Button Bottom Tab component', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <ButtonBottomTab
        leftTitle="LeftButtonTitle"
        onLeftPress={jest.fn()}
        onRightPress={jest.fn()}
        rightTitle="RightButtonTitle"
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
