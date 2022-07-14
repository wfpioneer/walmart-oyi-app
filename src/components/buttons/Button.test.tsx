import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import COLOR from '../../themes/Color';
import { Button, ButtonType } from './Button';

describe('Button Component', () => {
  it('Renders the default button', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <Button />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Renders the button with type as Primary', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <Button type={ButtonType.PRIMARY} />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Renders the button with type as Solid White', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <Button type={ButtonType.SOLID_WHITE} />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Renders the button with type as No Border', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <Button type={ButtonType.NO_BORDER} />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Renders the disabled button', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <Button disabled />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Renders the button with other custom specification props', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <Button
        onPress={jest.fn}
        title="Test Button"
        titleColor={COLOR.WHITE}
        titleFontSize={12}
        titleFontWeight="normal"
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

  it('Tests button click functionality', () => {
    const mockOnPressCallBackFn = jest.fn();
    const { getByTestId } = render(
      <Button
        testID="testButton"
        onPress={mockOnPressCallBackFn}
      />
    );
    const button = getByTestId('testButton');
    fireEvent.press(button);
    expect(mockOnPressCallBackFn).toBeCalledTimes(1);
  });

  it('Tests button title been correctly displayed', () => {
    const mockOnPressCallBackFn = jest.fn();
    const { queryAllByText } = render(
      <Button
        testID="testButton"
        title="Test Title"
        onPress={mockOnPressCallBackFn}
      />
    );
    expect(queryAllByText('Test Title')).toHaveLength(1);
  });
});
