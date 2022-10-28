import React, { Dispatch } from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import PalletQtyUpdate, {
  assignHandleTextChange, calculateDecreaseQty, calculateIncreaseQty,
  validateQty, validateSameQty
} from './PalletQtyUpdate';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'mockMaterialCommunityIcons');

describe('testing PalletQtyUpdate component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('render component and test buttons', () => {
    const mockHandleSubmit = jest.fn();
    const mockHandleClose = jest.fn();
    const mockSetNewQty = jest.fn();
    const mockUseState: any = (useState: () => [unknown, Dispatch<unknown>]) => [useState, mockSetNewQty];
    jest.spyOn(React, 'useState').mockImplementation(mockUseState);
    it('render component with same onhands and new qty', () => {
      const { toJSON } = render(
        <PalletQtyUpdate
          qty={10}
          palletId={4598}
          handleSubmit={mockHandleSubmit}
          handleClose={mockHandleClose}
        />
      );
      expect(toJSON()).toMatchSnapshot();
    });
    it('render component with invalid new qty', () => {
      const { toJSON } = render(
        <PalletQtyUpdate
          qty={-11}
          palletId={4598}
          handleSubmit={mockHandleSubmit}
          handleClose={mockHandleClose}
        />
      );
      expect(toJSON()).toMatchSnapshot();
    });
    it('render component and test buttons', () => {
      const { getByTestId } = render(
        <PalletQtyUpdate
          qty={11}
          palletId={4598}
          handleSubmit={mockHandleSubmit}
          handleClose={mockHandleClose}
        />
      );
      const testIncrease = getByTestId('increaseButton');
      const testDecrease = getByTestId('decreaseButton');
      const testTextInput = getByTestId('numericTextInput');
      const testCancel = getByTestId('cancelButton');
      fireEvent.press(testCancel);
      expect(mockHandleClose).toHaveBeenCalled();
      fireEvent.press(testIncrease);
      expect(mockSetNewQty).toHaveBeenCalled();
      mockSetNewQty.mockReset();
      fireEvent.press(testDecrease);
      expect(mockSetNewQty).toHaveBeenCalled();
      mockSetNewQty.mockReset();
      fireEvent.changeText(testTextInput, '20');
      expect(mockSetNewQty).toHaveBeenCalled();
    });
  });
  describe('test external functions', () => {
    const mockSetNewQty = jest.fn();
    it('test assignHandleTextChange', () => {
      assignHandleTextChange(10, mockSetNewQty);
      expect(mockSetNewQty).toHaveBeenCalledWith(10);
    });
    it('test calculateDecreaseQty', () => {
      calculateDecreaseQty(99999, mockSetNewQty);
      expect(mockSetNewQty).toHaveBeenCalledWith(9999);
      mockSetNewQty.mockReset();
      calculateDecreaseQty(10, mockSetNewQty);
      expect(mockSetNewQty).toHaveBeenCalled();
    });
    it('test calculateIncreaseQty', () => {
      calculateIncreaseQty(-10, mockSetNewQty);
      expect(mockSetNewQty).toHaveBeenCalledWith(0);
      mockSetNewQty.mockReset();
      calculateIncreaseQty(10, mockSetNewQty);
      expect(mockSetNewQty).toHaveBeenCalled();
    });
    it('test validateSameQty', () => {
      let results = validateSameQty(10, 10);
      expect(results).toStrictEqual(true);
      results = validateSameQty(10, 11);
      expect(results).toStrictEqual(false);
    });
    it('test validateQty', () => {
      let results = validateQty(-10);
      expect(results).toStrictEqual(false);
      results = validateQty(10);
      expect(results).toStrictEqual(true);
      results = validateQty(99999);
      expect(results).toStrictEqual(false);
    });
  });
});
