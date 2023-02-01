import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import PrintQueueEdit, { QTY_MAX, QTY_MIN, validateQty } from './PrintQueueEdit';
import { PrintQueueItem } from '../../models/Printer';
import { PrintTab } from '../../screens/PrintList/PrintList';
import { trackEvent } from '../../utils/AppCenterTool';

jest.mock('../../utils/AppCenterTool.ts', () => ({
  ...jest.requireActual('../../utils/__mocks__/AppCenterTool'),
  trackEvent: jest.fn()
}));

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'mockMaterialCommunityIcons');
const mockSetState = jest.fn();
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn().mockImplementation(init => [init, mockSetState])
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => {
  const ActualReactRedux = jest.requireActual('react-redux');
  return {
    ...ActualReactRedux,
    useDispatch: () => mockDispatch
  };
});

describe('PrintQueueEdit component', () => {
  const mockItemIndexToEdit = jest.fn();
  const defaultProps = {
    countryCode: 'MX',
    itemIndexToEdit: 0,
    printQueue: [{
      catgNbr: 28,
      isSizeValid: true,
      itemName: '700ML JAGERMEISTER',
      itemNbr: 62267,
      itemType: 'ITEM',
      paperSize: 'Small',
      signQty: 4,
      upcNbr: '406770001404',
      worklistType: 'NSFL'
    }],
    queueName: 'PRICESIGN',
    selectedPrinter: null,
    setItemIndexToEdit: mockItemIndexToEdit
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Renders the default PrintQueueEdit', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <PrintQueueEdit
        countryCode={defaultProps.countryCode}
        itemIndexToEdit={defaultProps.itemIndexToEdit}
        printQueue={defaultProps.printQueue as PrintQueueItem[]}
        queueName={defaultProps.queueName as PrintTab}
        selectedPrinter={defaultProps.selectedPrinter}
        setItemIndexToEdit={defaultProps.setItemIndexToEdit}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Tests minus button click', () => {
    const { getByTestId } = render(
      <PrintQueueEdit
        countryCode={defaultProps.countryCode}
        itemIndexToEdit={defaultProps.itemIndexToEdit}
        printQueue={defaultProps.printQueue as PrintQueueItem[]}
        queueName={defaultProps.queueName as PrintTab}
        selectedPrinter={defaultProps.selectedPrinter}
        setItemIndexToEdit={defaultProps.setItemIndexToEdit}
      />
    );

    const minusButton = getByTestId('minusbutton');
    fireEvent.press(minusButton);
    expect(mockSetState).toBeCalledTimes(2);
    expect(mockSetState).toBeCalledWith(true);
    expect(mockSetState).toBeCalledWith(expect.any(Function));
  });

  it('Tests minus button click when signQty is more than QTY_MAX', () => {
    const printQueue = [{ ...defaultProps.printQueue[0], signQty: 101 }];
    const { getByTestId } = render(
      <PrintQueueEdit
        countryCode={defaultProps.countryCode}
        itemIndexToEdit={defaultProps.itemIndexToEdit}
        printQueue={printQueue as PrintQueueItem[]}
        queueName={defaultProps.queueName as PrintTab}
        selectedPrinter={defaultProps.selectedPrinter}
        setItemIndexToEdit={defaultProps.setItemIndexToEdit}
      />
    );

    const minusButton = getByTestId('minusbutton');
    fireEvent.press(minusButton);
    expect(mockSetState).toBeCalledTimes(2);
    expect(mockSetState).toBeCalledWith(true);
    expect(mockSetState).toBeCalledWith(QTY_MAX);
  });

  it('Tests plus button click', () => {
    const { getByTestId } = render(
      <PrintQueueEdit
        countryCode={defaultProps.countryCode}
        itemIndexToEdit={defaultProps.itemIndexToEdit}
        printQueue={defaultProps.printQueue as PrintQueueItem[]}
        queueName={defaultProps.queueName as PrintTab}
        selectedPrinter={defaultProps.selectedPrinter}
        setItemIndexToEdit={defaultProps.setItemIndexToEdit}
      />
    );

    const plusButton = getByTestId('plusbutton');

    fireEvent.press(plusButton);
    expect(mockSetState).toBeCalledTimes(2);
    expect(mockSetState).toBeCalledWith(true);
    expect(mockSetState).toBeCalledWith(expect.any(Function));
  });

  it('Tests plus button click when signQty is less than QTY_MIN', () => {
    const printQueue = [{ ...defaultProps.printQueue[0], signQty: 0 }];
    const { getByTestId } = render(
      <PrintQueueEdit
        countryCode={defaultProps.countryCode}
        itemIndexToEdit={defaultProps.itemIndexToEdit}
        printQueue={printQueue as PrintQueueItem[]}
        queueName={defaultProps.queueName as PrintTab}
        selectedPrinter={defaultProps.selectedPrinter}
        setItemIndexToEdit={defaultProps.setItemIndexToEdit}
      />
    );

    const plusButton = getByTestId('plusbutton');

    fireEvent.press(plusButton);
    expect(mockSetState).toBeCalledTimes(2);
    expect(mockSetState).toBeCalledWith(true);
    expect(mockSetState).toBeCalledWith(QTY_MIN);
  });

  it('Tests txtCopies change', () => {
    const { getByTestId } = render(
      <PrintQueueEdit
        countryCode={defaultProps.countryCode}
        itemIndexToEdit={defaultProps.itemIndexToEdit}
        printQueue={defaultProps.printQueue as PrintQueueItem[]}
        queueName={defaultProps.queueName as PrintTab}
        selectedPrinter={defaultProps.selectedPrinter}
        setItemIndexToEdit={defaultProps.setItemIndexToEdit}
      />
    );
    const txtCopies = getByTestId('txtCopies');

    fireEvent.changeText(txtCopies, '55');
    expect(mockSetState).toBeCalledWith(55);
  });

  it('Test validate qty', () => {
    expect(validateQty(5)).toBe(true);
    expect(validateQty(101)).toBe(false);
    expect(validateQty(0)).toBe(false);
  });

  it('Test close button click', () => {
    const { getByTestId } = render(
      <PrintQueueEdit
        countryCode={defaultProps.countryCode}
        itemIndexToEdit={defaultProps.itemIndexToEdit}
        printQueue={defaultProps.printQueue as PrintQueueItem[]}
        queueName={defaultProps.queueName as PrintTab}
        selectedPrinter={defaultProps.selectedPrinter}
        setItemIndexToEdit={defaultProps.setItemIndexToEdit}
      />
    );
    const closeBtn = getByTestId('closeBtn');

    fireEvent.press(closeBtn);
    expect(mockItemIndexToEdit).toBeCalledWith(-1);
  });

  it('Test save button click', () => {
    const { getByTestId } = render(
      <PrintQueueEdit
        countryCode={defaultProps.countryCode}
        itemIndexToEdit={defaultProps.itemIndexToEdit}
        printQueue={defaultProps.printQueue as PrintQueueItem[]}
        queueName={defaultProps.queueName as PrintTab}
        selectedPrinter={defaultProps.selectedPrinter}
        setItemIndexToEdit={defaultProps.setItemIndexToEdit}
      />
    );
    const btnSave = getByTestId('btnSave');

    fireEvent.press(btnSave);
    expect(trackEvent).toBeCalledWith(
      'print_queue_edit_save',
      { printItem: JSON.stringify(defaultProps.printQueue[0]), newSignQty: 4 }
    );
    expect(mockDispatch).toBeCalledWith({
      payload: defaultProps.printQueue,
      type: 'PRINT/SET_PRINT_QUEUE'
    });
  });
});
