import { fireEvent, render } from '@testing-library/react-native';
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

  it('Tests custom Button bottom tab component onPress', () => {
    const leftTitle = 'LeftButtonTitle';
    const rightTitle = 'RightButtonTitle';
    const cancelButton = jest.fn();
    const confirmButton = jest.fn();
    const { getByText } = render(
      <ButtonBottomTab
        leftTitle={leftTitle}
        onLeftPress={cancelButton}
        onRightPress={confirmButton}
        rightTitle={rightTitle}
      />
    );
    const buttonLeft = getByText(leftTitle);
    fireEvent.press(buttonLeft);
    expect(cancelButton).toBeCalledTimes(1);
    const buttonRight = getByText(rightTitle);
    fireEvent.press(buttonRight);
    expect(confirmButton).toBeCalledTimes(1);
  });
});
