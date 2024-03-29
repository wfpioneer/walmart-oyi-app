import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { ReactTestInstance } from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';
import Calculator from './Calculator';

const pressButtonAndRerender = (
  button: ReactTestInstance,
  rerender: (nextElement: React.ReactElement<any, string | React.JSXElementConstructor<any>>) => void
) => {
  fireEvent.press(button);
  rerender(<Calculator />);
};

describe('Test Calculator component', () => {
  it('renders the calculator', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(<Calculator />);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders and presses all the buttons into equations with no errors', () => {
    const { getByTestId, rerender, toJSON } = render(<Calculator />);
    expect(toJSON()).toMatchSnapshot('initial render');
    const numbers = [
      getByTestId('zero'),
      getByTestId('one'),
      getByTestId('two'),
      getByTestId('three'),
      getByTestId('four'),
      getByTestId('five'),
      getByTestId('six'),
      getByTestId('seven'),
      getByTestId('eight'),
      getByTestId('nine')
    ];
    const decimal = getByTestId('decimal');

    const add = getByTestId('add');
    const subtract = getByTestId('subtract');
    const multiply = getByTestId('multiply');
    const divide = getByTestId('divide');

    const equals = getByTestId('equals');
    const del = getByTestId('delete');
    const clear = getByTestId('clear');

    numbers.forEach(button => {
      pressButtonAndRerender(button, rerender);
      expect(toJSON()).toMatchSnapshot();
    });

    pressButtonAndRerender(clear, rerender);
    expect(toJSON()).toMatchSnapshot('initial render');

    pressButtonAndRerender(numbers[3], rerender);
    pressButtonAndRerender(decimal, rerender);
    pressButtonAndRerender(numbers[1], rerender);
    pressButtonAndRerender(numbers[4], rerender);
    expect(toJSON()).toMatchSnapshot('pi');

    pressButtonAndRerender(multiply, rerender);
    pressButtonAndRerender(numbers[2], rerender);
    expect(toJSON()).toMatchSnapshot('multiply equation');

    pressButtonAndRerender(equals, rerender);
    expect(toJSON()).toMatchSnapshot('tau');

    pressButtonAndRerender(clear, rerender);
    expect(toJSON()).toMatchSnapshot('initial render');

    pressButtonAndRerender(numbers[2], rerender);
    pressButtonAndRerender(add, rerender);
    pressButtonAndRerender(numbers[6], rerender);
    pressButtonAndRerender(subtract, rerender);
    pressButtonAndRerender(numbers[4], rerender);
    expect(toJSON()).toMatchSnapshot('add subtract equation');

    pressButtonAndRerender(equals, rerender);
    expect(toJSON()).toMatchSnapshot('four');

    pressButtonAndRerender(del, rerender);
    expect(toJSON()).toMatchSnapshot('initial render');
    pressButtonAndRerender(clear, rerender);

    pressButtonAndRerender(numbers[2], rerender);
    pressButtonAndRerender(add, rerender);
    pressButtonAndRerender(numbers[3], rerender);
    pressButtonAndRerender(divide, rerender);
    pressButtonAndRerender(numbers[4], rerender);
    expect(toJSON()).toMatchSnapshot('parentheses and divide equation');

    pressButtonAndRerender(equals, rerender);
    expect(toJSON()).toMatchSnapshot('one point two five');

    // Long press delete will delete whole last number
    fireEvent(del, 'longPress');
    rerender(<Calculator />);
    expect(toJSON()).toMatchSnapshot('initial render');

    pressButtonAndRerender(numbers[1], rerender);
    pressButtonAndRerender(add, rerender);
    pressButtonAndRerender(numbers[2], rerender);
    pressButtonAndRerender(numbers[3], rerender);
    expect(toJSON()).toMatchSnapshot('one plus twenty three');

    fireEvent(del, 'longPress');
    rerender(<Calculator />);
    expect(toJSON()).toMatchSnapshot('one plus');
  });

  it('presses equals with a onEquals supplied', () => {
    const mockOnEquals = jest.fn();
    const { getByTestId, rerender } = render(<Calculator onEquals={mockOnEquals} />);
    const one = getByTestId('one');
    const two = getByTestId('two');
    const add = getByTestId('add');
    const equals = getByTestId('equals');

    fireEvent.press(equals);
    rerender(<Calculator onEquals={mockOnEquals} />);
    expect(mockOnEquals).toHaveBeenCalledTimes(0);

    fireEvent.press(one);
    rerender(<Calculator onEquals={mockOnEquals} />);

    fireEvent.press(add);
    rerender(<Calculator onEquals={mockOnEquals} />);

    fireEvent.press(two);
    rerender(<Calculator onEquals={mockOnEquals} />);

    fireEvent.press(equals);
    rerender(<Calculator onEquals={mockOnEquals} />);
    expect(mockOnEquals).toHaveBeenCalledTimes(1);
    expect(mockOnEquals).toBeCalledWith(3);
  });

  it('presses buttons to make invalid equations', () => {
    const { getByTestId, rerender, toJSON } = render(<Calculator />);
    expect(toJSON()).toMatchSnapshot('initial render');
    const zero = getByTestId('zero');
    const one = getByTestId('one');
    const two = getByTestId('two');
    const three = getByTestId('three');
    const four = getByTestId('four');
    const five = getByTestId('five');
    const six = getByTestId('six');
    const seven = getByTestId('seven');
    const eight = getByTestId('eight');
    const nine = getByTestId('nine');
    const decimal = getByTestId('decimal');

    const add = getByTestId('add');
    const subtract = getByTestId('subtract');
    const multiply = getByTestId('multiply');
    const divide = getByTestId('divide');

    const equals = getByTestId('equals');
    const del = getByTestId('delete');
    const clear = getByTestId('clear');

    pressButtonAndRerender(add, rerender);
    expect(toJSON()).toMatchSnapshot('cannot begin with operand');
    pressButtonAndRerender(clear, rerender);

    pressButtonAndRerender(subtract, rerender);
    pressButtonAndRerender(four, rerender);
    expect(toJSON()).toMatchSnapshot('dash is not operand before number');
    pressButtonAndRerender(clear, rerender);

    pressButtonAndRerender(one, rerender);
    pressButtonAndRerender(add, rerender);
    pressButtonAndRerender(multiply, rerender);
    expect(toJSON()).toMatchSnapshot('cannot have double operand');

    pressButtonAndRerender(del, rerender);
    pressButtonAndRerender(three, rerender);
    pressButtonAndRerender(two, rerender);
    expect(toJSON()).toMatchSnapshot('cannot have closing parent without opening parent');
    pressButtonAndRerender(clear, rerender);

    pressButtonAndRerender(five, rerender);
    pressButtonAndRerender(divide, rerender);
    pressButtonAndRerender(seven, rerender);
    pressButtonAndRerender(add, rerender);
    expect(toJSON()).toMatchSnapshot('cannot have operand next to parent');

    pressButtonAndRerender(del, rerender);
    pressButtonAndRerender(equals, rerender);
    expect(toJSON()).toMatchSnapshot('cannot calculate when end with operand');

    pressButtonAndRerender(eight, rerender);
    expect(toJSON()).toMatchSnapshot('error gone after more typing');
    pressButtonAndRerender(equals, rerender);
    expect(toJSON()).toMatchSnapshot('cannot calculate with unclosed parent');
    pressButtonAndRerender(clear, rerender);

    pressButtonAndRerender(decimal, rerender);
    expect(toJSON()).toMatchSnapshot('cannot have single decimal point');
    pressButtonAndRerender(clear, rerender);

    pressButtonAndRerender(zero, rerender);
    pressButtonAndRerender(decimal, rerender);
    pressButtonAndRerender(add, rerender);
    expect(toJSON()).toMatchSnapshot('cannot have decimal followed by operand');

    pressButtonAndRerender(del, rerender);
    pressButtonAndRerender(nine, rerender);
    pressButtonAndRerender(decimal, rerender);
    expect(toJSON()).toMatchSnapshot('cannot have multiple decimals in a number');

    pressButtonAndRerender(del, rerender);
    pressButtonAndRerender(add, rerender);
    pressButtonAndRerender(multiply, rerender);
    pressButtonAndRerender(six, rerender);
    expect(toJSON()).toMatchSnapshot('cannot have double operand');
  });

  it('renders the calculator modal component with the negative validation error enabled', () => {
    const { getByTestId, rerender, toJSON } = render(<Calculator showNegValidation={true} />);
    const subtract = getByTestId('subtract');
    const one = getByTestId('one');
    fireEvent.press(subtract);
    rerender(<Calculator showNegValidation={true} />);

    fireEvent.press(one);
    rerender(<Calculator showNegValidation={true} />);
    expect(toJSON()).toMatchSnapshot();
  });
  it('renders the calculator component with paper tape on continuous calculation', () => {
    const { getByTestId, rerender, toJSON } = render(<Calculator showNegValidation={true} />);
    const two = getByTestId('two');
    const three = getByTestId('three');
    const four = getByTestId('four');
    const subtract = getByTestId('subtract');
    const multiply = getByTestId('multiply');
    const equals = getByTestId('equals');
    const clear = getByTestId('clear');
    pressButtonAndRerender(four, rerender);
    pressButtonAndRerender(subtract, rerender);
    pressButtonAndRerender(two, rerender);
    pressButtonAndRerender(equals, rerender);
    expect(getByTestId('calc-paper-tape').props.children).toBe('4-2=2');
    expect(getByTestId('calc-text').props.children).toEqual('2');
    pressButtonAndRerender(multiply, rerender);
    pressButtonAndRerender(four, rerender);
    pressButtonAndRerender(equals, rerender);
    expect(getByTestId('calc-paper-tape').props.children).toBe('4-2=2*4=8');
    expect(getByTestId('calc-text').props.children).toEqual('8');
    // clear the current calc and click on any operand
    pressButtonAndRerender(clear, rerender);
    pressButtonAndRerender(subtract, rerender);
    pressButtonAndRerender(three, rerender);
    pressButtonAndRerender(equals, rerender);
    expect(getByTestId('calc-paper-tape').props.children).toBe('4-2=2*4=8-3=5');
    expect(getByTestId('calc-text').props.children).toEqual('5');
    expect(toJSON()).toMatchSnapshot();
    // clear the current calc and clicking on any value
    pressButtonAndRerender(clear, rerender);
    pressButtonAndRerender(three, rerender);
    expect(getByTestId('calc-paper-tape').props.children).toBe('4-2=2*4=8-3=5');
    expect(getByTestId('calc-text').props.children).toEqual('3');
    pressButtonAndRerender(multiply, rerender);
    pressButtonAndRerender(four, rerender);
    pressButtonAndRerender(equals, rerender);
    // should show the paper tape with new calculation
    expect(getByTestId('calc-paper-tape').props.children).toBe('3*4=12');
    expect(getByTestId('calc-text').props.children).toEqual('12');
  });
  it('test calculator component for allClear button press functionality', () => {
    const mockClear = jest.fn();
    const { getByTestId, rerender } = render(<Calculator onClear={mockClear} showNegValidation={true} />);
    const two = getByTestId('two');
    const four = getByTestId('four');
    const multiply = getByTestId('multiply');
    const equals = getByTestId('equals');
    pressButtonAndRerender(two, rerender);
    pressButtonAndRerender(multiply, rerender);
    pressButtonAndRerender(four, rerender);
    pressButtonAndRerender(equals, rerender);
    expect(getByTestId('calc-paper-tape').props.children).toBe('2*4=8');
    expect(getByTestId('calc-text').props.children).toEqual('8');
    const allClearButton = getByTestId('allClear');
    pressButtonAndRerender(allClearButton, rerender);
    expect(getByTestId('calc-paper-tape').props.children).toBe('');
    expect(getByTestId('calc-text').props.children).toEqual('');
  });
});
