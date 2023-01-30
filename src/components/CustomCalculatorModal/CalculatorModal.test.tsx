import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import CalculatorModal from './CalculatorModal';

describe('Calculator Modal render tests', () => {
  const mockDisableAcceptButtonFn = jest.fn(() => false);
  it('render modal with visible true', () => {
    const component = (
      <CalculatorModal
        visible={true}
        onAccept={jest.fn()}
        onClose={jest.fn()}
        showAcceptButton={true}
        disableAcceptButton={mockDisableAcceptButtonFn}
      />
    );
    const { toJSON } = render(component);
    expect(toJSON()).toMatchSnapshot();
  });

  it('render modal with visible false', () => {
    const component = (
      <CalculatorModal
        visible={false}
        onAccept={jest.fn()}
        onClose={jest.fn()}
        showAcceptButton={true}
        disableAcceptButton={mockDisableAcceptButtonFn}
      />
    );
    const { toJSON } = render(component);
    expect(toJSON()).toMatchSnapshot();
  });

  it('render modal with visible false', () => {
    const component = (
      <CalculatorModal
        visible={false}
        onAccept={jest.fn()}
        onClose={jest.fn()}
        showAcceptButton={true}
        disableAcceptButton={mockDisableAcceptButtonFn}
      />
    );
    const { toJSON } = render(component);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should call mock close on close btn click', () => {
    const mockClose = jest.fn();
    const component = (
      <CalculatorModal
        visible={true}
        onAccept={jest.fn()}
        onClose={mockClose}
        showAcceptButton={true}
        disableAcceptButton={mockDisableAcceptButtonFn}
      />
    );
    const { getByTestId } = render(component);
    const modalCloseButton = getByTestId('modal-close-button');
    fireEvent.press(modalCloseButton);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('should call mock accept on accept btn click', () => {
    const mockAccept = jest.fn();
    const component = (
      <CalculatorModal
        visible={true}
        onAccept={mockAccept}
        onClose={jest.fn()}
        showAcceptButton={true}
        disableAcceptButton={mockDisableAcceptButtonFn}
      />
    );
    const { getByTestId } = render(component);
    const modalAcceptButton = getByTestId('modal-accept-button');
    fireEvent.press(modalAcceptButton);
    expect(mockAccept).toHaveBeenCalledTimes(1);
  });

  it('should not call mock accept on accept btn click when disableAcceptButton is true', () => {
    const mockAccept = jest.fn();
    const mockDisableAcceptBtnFn = jest.fn(() => true);
    const component = (
      <CalculatorModal
        visible={true}
        onAccept={mockAccept}
        onClose={jest.fn()}
        showAcceptButton={true}
        disableAcceptButton={mockDisableAcceptBtnFn}
      />
    );
    const { getByTestId } = render(component);
    const modalAcceptButton = getByTestId('modal-accept-button');
    fireEvent.press(modalAcceptButton);
    expect(mockAccept).not.toHaveBeenCalled();
  });
});
