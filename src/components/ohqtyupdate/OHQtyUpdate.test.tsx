import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ONQtyUpdate, {
  assignHandleTextChange, calculateDecreaseQty, calculateIncreaseQty,
  validateSameQty, validateQty, default as OHQtyUpdate
} from './OHQtyUpdate';
import { AxiosError } from 'axios';
import {object} from "prop-types";

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'mockMaterialCommunityIcons');

describe('testing OHQtyUpdate component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('render component and test buttons', () => {
    const mockHandleSubmit = jest.fn();
    const mockHandleClose = jest.fn();
    const mockSetNewOHQty = jest.fn();
    it('render component with same onhands and new qty', () => {
      const { toJSON } = render(
        <OHQtyUpdate
          onHandsQty={10}
          newOHQty={10}
          isWaiting={false}
          error={null}
          setNewOHQty={mockSetNewOHQty}
          handleSubmit={mockHandleSubmit}
          handleClose={mockHandleClose}
        />
      );
      expect(toJSON()).toMatchSnapshot();
    });
    it('render component with different onhands and new qty', () => {
      const { toJSON } = render(
        <OHQtyUpdate
          onHandsQty={10}
          newOHQty={11}
          isWaiting={false}
          error={null}
          setNewOHQty={mockSetNewOHQty}
          handleSubmit={mockHandleSubmit}
          handleClose={mockHandleClose}
        />
      );
      expect(toJSON()).toMatchSnapshot();
    });
    it('render component with invalid new qty', () => {
      const { toJSON } = render(
        <OHQtyUpdate
          onHandsQty={10}
          newOHQty={-11}
          isWaiting={false}
          error={null}
          setNewOHQty={mockSetNewOHQty}
          handleSubmit={mockHandleSubmit}
          handleClose={mockHandleClose}
        />
      );
      expect(toJSON()).toMatchSnapshot();
    });
    it('render component with isWating true', () => {
      const { toJSON } = render(
        <OHQtyUpdate
          onHandsQty={10}
          newOHQty={10}
          isWaiting={true}
          error={null}
          setNewOHQty={mockSetNewOHQty}
          handleSubmit={mockHandleSubmit}
          handleClose={mockHandleClose}
        />
      );
      expect(toJSON()).toMatchSnapshot();
    });
    it('render component and test buttons', () => {
      const { getByTestId } = render(
        <OHQtyUpdate
          onHandsQty={10}
          newOHQty={11}
          isWaiting={false}
          error={null}
          setNewOHQty={mockSetNewOHQty}
          handleSubmit={mockHandleSubmit}
          handleClose={mockHandleClose}
        />
      );
      const testIncrease = getByTestId('increaseButton');
      const testDecrease = getByTestId('decreaseButton');
      const testTextInput = getByTestId('numericTextInput');
      const testClose = getByTestId('closeButton');
      const testSave = getByTestId('saveButton');
      fireEvent.press(testSave);
      expect(mockHandleSubmit).toHaveBeenCalled();
      fireEvent.press(testClose);
      expect(mockHandleClose).toHaveBeenCalled();
      fireEvent.press(testIncrease);
      expect(mockSetNewOHQty).toHaveBeenCalled();
      mockSetNewOHQty.mockReset();
      fireEvent.press(testDecrease);
      expect(mockSetNewOHQty).toHaveBeenCalled();
      mockSetNewOHQty.mockReset();
      fireEvent.changeText(testTextInput, '20');
      expect(mockSetNewOHQty).toHaveBeenCalled();
    });
    it('render component with error', () => {
      const mockError = {
        config: {},
        isAxiosError: true,
        message: '500 Network Error',
        name: 'Network Error',
        toJSON: () => object
      };
      const { toJSON } = render(
        <OHQtyUpdate
          onHandsQty={10}
          newOHQty={11}
          isWaiting={false}
          error={mockError}
          setNewOHQty={mockSetNewOHQty}
          handleSubmit={mockHandleSubmit}
          handleClose={mockHandleClose}
        />
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });
  describe('test external functions', () => {
  const mockSetNewOHQty = jest.fn();
    it('test assignHandleTextChange', () => {
      assignHandleTextChange(10, mockSetNewOHQty);
      expect(mockSetNewOHQty).toHaveBeenCalledWith(10);
    });
    it('test calculateDecreaseQty', () => {
      calculateDecreaseQty(99999, mockSetNewOHQty);
      expect(mockSetNewOHQty).toHaveBeenCalledWith(9999);
      mockSetNewOHQty.mockReset();
      calculateDecreaseQty(10, mockSetNewOHQty);
      expect(mockSetNewOHQty).toHaveBeenCalled();
    });
    it('test calculateIncreaseQty', () => {
      calculateIncreaseQty(-10, mockSetNewOHQty);
      expect(mockSetNewOHQty).toHaveBeenCalledWith(0);
      mockSetNewOHQty.mockReset();
      calculateIncreaseQty(10, mockSetNewOHQty);
      expect(mockSetNewOHQty).toHaveBeenCalled();
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