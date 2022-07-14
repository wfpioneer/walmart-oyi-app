import { fireEvent, render } from '@testing-library/react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import COLOR from '../../themes/Color';
import { IconButton, IconButtonType } from './IconButton';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'mockMaterialCommunityIcons');

const mockIcon = <MaterialCommunityIcon name="close" size={16} color={COLOR.GREY_500} />;

describe('IconButton component', () => {
  it('Renders the default iconButton', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <IconButton icon={mockIcon} />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Renders the iconButton with type as Primary', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <IconButton icon={mockIcon} type={IconButtonType.PRIMARY} />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Renders the iconButton with type as Solid White', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <IconButton icon={mockIcon} type={IconButtonType.SOLID_WHITE} />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Renders the iconButton with type as No Border', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <IconButton icon={mockIcon} type={IconButtonType.NO_BORDER} />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Renders the disabled icon button', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <IconButton icon={mockIcon} disabled />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Renders the iconButton with other custom specification props', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <IconButton
        icon={mockIcon}
        onPress={jest.fn}
        backgroundColor={COLOR.MAIN_THEME_COLOR}
        height={5}
        width={10}
        radius={2}
        style={{}}
        testID="testButton"
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Tests iconButton click functionality', () => {
    const mockOnPressCallBackFn = jest.fn();
    const { getByTestId } = render(
      <IconButton
        icon={mockIcon}
        testID="testIconButton"
        onPress={mockOnPressCallBackFn}
      />
    );
    const button = getByTestId('testIconButton');
    fireEvent.press(button);
    expect(mockOnPressCallBackFn).toBeCalledTimes(1);
  });
});
