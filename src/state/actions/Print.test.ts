import {
  ADD_LOCATION_PRINT_QUEUE,
  ADD_MULTIPLE_TO_LOCATION_PRINT_QUEUE,
  ADD_TO_PRINTER_LIST,
  ADD_TO_PRINT_QUEUE,
  CLEAR_LOCATION_PRINT_QUEUE,
  DELETE_FROM_PRINTER_LIST,
  REMOVE_MULT_FROM_PRINT_QUEUE_BY_ITEM_NBR,
  REMOVE_MULT_FROM_PRINT_QUEUE_BY_UPC,
  SET_LOCATION_LABEL_PRINTER,
  SET_LOCATION_PRINT_QUEUE,
  SET_PALLET_LABEL_PRINTER,
  SET_PRICE_LABEL_PRINTER,
  SET_PRINTER_LIST,
  SET_PRINTING_LOCATION_LABELS,
  SET_PRINTING_PALLET_LABEL,
  SET_PRINTING_TYPE,
  SET_PRINT_QUEUE,
  SET_SELECTED_PRINTER,
  SET_SELECTED_SIGN_TYPE,
  UNSET_PRINTING_LOCATION_LABELS,
  UNSET_PRINTING_PALLET_LABEL,
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
} from './Print';
import { PrintingType } from '../../models/Printer';
import { mockPrinterList } from '../../mockData/mockPrinterList';
import { mockLargePrintQueue, mockLocationPrintQueue, mockPrintQueue } from '../../mockData/mockPrintQueue';
import { LocationName } from '../../models/Location';

describe('testing action creators', () => {
  it('testing setSelectedPrinter', () => {
    const results = setSelectedPrinter(mockPrinterList[0]);
    expect(results).toStrictEqual({
      type: SET_SELECTED_PRINTER,
      payload: mockPrinterList[0]
    });
  });
  it('testing setSignType', () => {
    const results = setSignType('XSmall');
    expect(results).toStrictEqual({
      type: SET_SELECTED_SIGN_TYPE,
      payload: 'XSmall'
    });
  });
  it('testing addToPrinterList', () => {
    const results = addToPrinterList(mockPrinterList[0]);
    expect(results).toStrictEqual({
      type: ADD_TO_PRINTER_LIST,
      payload: mockPrinterList[0]
    });
  });
  it('testing deleteFromPrinterList', () => {
    const results = deleteFromPrinterList(mockPrinterList[0].id);
    expect(results).toStrictEqual({
      type: DELETE_FROM_PRINTER_LIST,
      payload: mockPrinterList[0].id
    });
  });
  it('testing addToPrintQueue', () => {
    const results = addToPrintQueue(mockPrintQueue[0]);
    expect(results).toStrictEqual({
      type: ADD_TO_PRINT_QUEUE,
      payload: mockPrintQueue[0]
    });
  });
  it('testing addMultipleToLocationPrintQueue', () => {
    const results = addMultipleToLocationPrintQueue(mockLocationPrintQueue);
    expect(results).toStrictEqual({
      type: ADD_MULTIPLE_TO_LOCATION_PRINT_QUEUE,
      payload: mockLocationPrintQueue
    });
  });
  it('testing removeMultipleFromPrintQueueByItemNbr', () => {
    const itemNbrs = [123456, 789012];
    const results = removeMultipleFromPrintQueueByItemNbr(itemNbrs);
    expect(results).toStrictEqual({
      type: REMOVE_MULT_FROM_PRINT_QUEUE_BY_ITEM_NBR,
      payload: itemNbrs
    });
  });
  it('testing removeMultipleFromPrintQueueByUpc', () => {
    const upcNbrs = ['123456', '789012'];
    const results = removeMultipleFromPrintQueueByUpc(upcNbrs);
    expect(results).toStrictEqual({
      type: REMOVE_MULT_FROM_PRINT_QUEUE_BY_UPC,
      payload: upcNbrs
    });
  });
  it('testing setPrintQueue', () => {
    const results = setPrintQueue(mockLargePrintQueue);
    expect(results).toStrictEqual({
      type: SET_PRINT_QUEUE,
      payload: mockLargePrintQueue
    });
  });
  it('testing setPrintingLocationLabels', () => {
    const results = setPrintingLocationLabels(LocationName.SECTION);
    expect(results).toStrictEqual({
      type: SET_PRINTING_LOCATION_LABELS,
      payload: LocationName.SECTION
    });
  });
  it('testing unsetPrintingLocationLabels', () => {
    const results = unsetPrintingLocationLabels();
    expect(results).toStrictEqual({
      type: UNSET_PRINTING_LOCATION_LABELS
    });
  });
  it('testing setPrintingPalletLabel', () => {
    const results = setPrintingPalletLabel();
    expect(results).toStrictEqual({
      type: SET_PRINTING_PALLET_LABEL
    });
  });
  it('testing unsetPrintingPalletLabel', () => {
    const results = unsetPrintingPalletLabel();
    expect(results).toStrictEqual({
      type: UNSET_PRINTING_PALLET_LABEL
    });
  });
  it('testing addLocationPrintQueue', () => {
    const results = addLocationPrintQueue(mockLocationPrintQueue[0]);
    expect(results).toStrictEqual({
      type: ADD_LOCATION_PRINT_QUEUE,
      payload: mockLocationPrintQueue[0]
    });
  });
  it('testing setLocationPrintQueue', () => {
    const results = setLocationPrintQueue(mockLocationPrintQueue);
    expect(results).toStrictEqual({
      type: SET_LOCATION_PRINT_QUEUE,
      payload: mockLocationPrintQueue
    });
  });
  it('testing clearLocationPrintQueue', () => {
    const results = clearLocationPrintQueue();
    expect(results).toStrictEqual({
      type: CLEAR_LOCATION_PRINT_QUEUE
    });
  });
  it('testing setPriceLabelPrinter', () => {
    const results = setPriceLabelPrinter(mockPrinterList[0]);
    expect(results).toStrictEqual({
      type: SET_PRICE_LABEL_PRINTER,
      payload: mockPrinterList[0]
    });
  });
  it('testing setLocationLabelPrinter', () => {
    const results = setLocationLabelPrinter(mockPrinterList[1]);
    expect(results).toStrictEqual({
      type: SET_LOCATION_LABEL_PRINTER,
      payload: mockPrinterList[1]
    });
  });
  it('testing setPalletLabelPrinter', () => {
    const results = setPalletLabelPrinter(mockPrinterList[1]);
    expect(results).toStrictEqual({
      type: SET_PALLET_LABEL_PRINTER,
      payload: mockPrinterList[1]
    });
  });
  it('testing setPrintingType', () => {
    const results = setPrintingType(PrintingType.LOCATION);
    expect(results).toStrictEqual({
      type: SET_PRINTING_TYPE,
      payload: PrintingType.LOCATION
    });
  });
  it('testing setPrinterList', () => {
    const results = setPrinterList(mockPrinterList);
    expect(results).toStrictEqual({
      type: SET_PRINTER_LIST,
      payload: mockPrinterList
    });
  });
});
