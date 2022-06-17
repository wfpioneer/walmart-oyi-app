import { Print, StateType, initialState } from './Print';
import {
  addLocationPrintQueue,
  addMultipleToLocationPrintQueue,
  addToPrintQueue,
  addToPrinterList,
  clearLocationPrintQueue,
  deleteFromPrinterList,
  removeMultipleFromPrintQueueByItemNbr,
  removeMultipleFromPrintQueueByUpc,
  setLocationLabelPrinter,
  setLocationPrintQueue,
  setPalletLabelPrinter,
  setPriceLabelPrinter,
  setPrintQueue,
  setPrinterList,
  setPrintingLocationLabels,
  setPrintingPalletLabel,
  setPrintingType,
  setSelectedPrinter,
  setSignType,
  unsetPrintingLocationLabels,
  unsetPrintingPalletLabel
} from '../actions/Print';
import { PrintingType } from '../../models/Printer';
import { mockPrinterList } from '../../mockData/mockPrinterList';
import { mockLargePrintQueue, mockLocationPrintQueue, mockPrintQueue } from '../../mockData/mockPrintQueue';
import { LocationName } from '../../models/Location';

describe('testing printing reducer', () => {
  it('test reducer with addLocationPrintQueue', () => {
    const expectedChangedState: StateType = {
      ...initialState,
      locationPrintQueue: [mockLocationPrintQueue[0]]
    };
    const results = Print(initialState, addLocationPrintQueue(mockLocationPrintQueue[0]));
    expect(results).toStrictEqual(expectedChangedState);
  });
  it('test reducer with addMultipleToLocationPrintQueue', () => {
    const expectedChangedState: StateType = {
      ...initialState,
      locationPrintQueue: mockLocationPrintQueue
    };
    const results = Print(initialState, addMultipleToLocationPrintQueue(mockLocationPrintQueue));
    expect(results).toStrictEqual(expectedChangedState);
  });
  it('test reducer with addToPrintQueue', () => {
    const expectedChangedState: StateType = {
      ...initialState,
      printQueue: mockPrintQueue
    };
    const results = Print(initialState, addToPrintQueue(mockPrintQueue[0]));
    expect(results).toStrictEqual(expectedChangedState);
  });
  it('test reducer with addToPrinterList', () => {
    const expectedChangedState: StateType = {
      ...initialState,
      printerList: [mockPrinterList[0]]
    };
    const results = Print(initialState, addToPrinterList(mockPrinterList[0]));
    expect(results).toStrictEqual(expectedChangedState);
  });
  it('test reducer with clearLocationPrintQueue', () => {
    const changedState: StateType = {
      ...initialState,
      locationPrintQueue: mockLocationPrintQueue
    };
    const results = Print(changedState, clearLocationPrintQueue());
    expect(results).toStrictEqual(initialState);
  });
  it('test reducer with deleteFromPrinterList', () => {
    const changedState: StateType = {
      ...initialState,
      printerList: [mockPrinterList[0]]
    };
    const results = Print(changedState, deleteFromPrinterList('123'));
    expect(results).toStrictEqual(initialState);
  });
  it('test reducer with removeMultipleFromPrintQueueByItemNbr', () => {
    const changedState: StateType = {
      ...initialState,
      printQueue: mockLargePrintQueue
    };
    const results = Print(changedState, removeMultipleFromPrintQueueByItemNbr([123456, 789012]));
    expect(results).toStrictEqual(initialState);
  });
  it('test reducer with removeMultipleFromPrintQueueByUpc', () => {
    const changedState: StateType = {
      ...initialState,
      printQueue: mockLargePrintQueue
    };
    const results = Print(changedState, removeMultipleFromPrintQueueByUpc(['123456', '789012']));
    expect(results).toStrictEqual(initialState);
  });
  it('test reducer with setLocationLabelPrinter', () => {
    const expectedChangedState: StateType = {
      ...initialState,
      locationLabelPrinter: mockPrinterList[1]
    };
    const results = Print(initialState, setLocationLabelPrinter(mockPrinterList[1]));
    expect(results).toStrictEqual(expectedChangedState);
  });
  it('test reducer with setLocationPrintQueue', () => {
    const expectedChangedState: StateType = {
      ...initialState,
      locationPrintQueue: mockLocationPrintQueue
    };
    const results = Print(initialState, setLocationPrintQueue(mockLocationPrintQueue));
    expect(results).toStrictEqual(expectedChangedState);
  });
  it('test reducer with setPalletLabelPrinter', () => {
    const expectedChangedState: StateType = {
      ...initialState,
      palletLabelPrinter: mockPrinterList[1]
    };
    const results = Print(initialState, setPalletLabelPrinter(mockPrinterList[1]));
    expect(results).toStrictEqual(expectedChangedState);
  });
  it('test reducer with setPriceLabelPrinter', () => {
    const expectedChangedState: StateType = {
      ...initialState,
      priceLabelPrinter: mockPrinterList[1]
    };
    const results = Print(initialState, setPriceLabelPrinter(mockPrinterList[1]));
    expect(results).toStrictEqual(expectedChangedState);
  });
  it('test reducer with setPrintQueue', () => {
    const expectedChangedState: StateType = {
      ...initialState,
      printQueue: mockPrintQueue
    };
    const results = Print(initialState, setPrintQueue(mockPrintQueue));
    expect(results).toStrictEqual(expectedChangedState);
  });
  it('test reducer with setPrinterList', () => {
    const expectedChangedState: StateType = {
      ...initialState,
      printerList: mockPrinterList
    };
    const results = Print(initialState, setPrinterList(mockPrinterList));
    expect(results).toStrictEqual(expectedChangedState);
  });
  it('test reducer with setPrintingLocationLabels', () => {
    const expectedChangedState: StateType = {
      ...initialState,
      printingLocationLabels: LocationName.SECTION
    };
    const results = Print(initialState, setPrintingLocationLabels(LocationName.SECTION));
    expect(results).toStrictEqual(expectedChangedState);
  });
  it('test reducer with setPrintingPalletLabel', () => {
    const expectedChangedState: StateType = {
      ...initialState,
      printingPalletLabel: true
    };
    const results = Print(initialState, setPrintingPalletLabel());
    expect(results).toStrictEqual(expectedChangedState);
  });
  it('test reducer with setPrintingType', () => {
    const expectedChangedState: StateType = {
      ...initialState,
      selectedPrintingType: PrintingType.LOCATION
    };
    const results = Print(initialState, setPrintingType(PrintingType.LOCATION));
    expect(results).toStrictEqual(expectedChangedState);
  });
  it('test reducer with setSelectedPrinter', () => {
    const expectedChangedState: StateType = {
      ...initialState,
      selectedPrinter: mockPrinterList[0]
    };
    const results = Print(initialState, setSelectedPrinter(mockPrinterList[0]));
    expect(results).toStrictEqual(expectedChangedState);
  });
  it('test reducer with setSignType', () => {
    const expectedChangedState: StateType = {
      ...initialState,
      selectedSignType: 'XSmall'
    };
    const results = Print(initialState, setSignType('XSmall'));
    expect(results).toStrictEqual(expectedChangedState);
  });
  it('test reducer with unsetPrintingLocationLabels', () => {
    const changedState: StateType = {
      ...initialState,
      printingLocationLabels: LocationName.SECTION
    };
    const results = Print(changedState, unsetPrintingLocationLabels());
    expect(results).toStrictEqual(initialState);
  });
  it('test reducer with unsetPrintingPalletLabel', () => {
    const changedState: StateType = {
      ...initialState,
      printingPalletLabel: true
    };
    const results = Print(changedState, unsetPrintingPalletLabel());
    expect(results).toStrictEqual(initialState);
  });
});
