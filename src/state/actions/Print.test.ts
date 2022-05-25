import {
  ADD_MULTIPLE_TO_LOCATION_PRINT_QUEUE,
  ADD_TO_PRINT_QUEUE,
  ADD_TO_PRINTER_LIST,
  DELETE_FROM_PRINTER_LIST,
  REMOVE_MULT_FROM_PRINT_QUEUE_BY_ITEM_NBR,
  SET_SELECTED_PRINTER,
  SET_SELECTED_SIGN_TYPE,
  addMultipleToLocationPrintQueue,
  addToPrintQueue,
  addToPrinterList,
  deleteFromPrinterList,
  removeMultipleFromPrintQueueByItemNbr,
  setSelectedPrinter,
  setSignType
} from './Print';
import {LaserPaper, PrintPaperSize, Printer, PrintQueueItem} from '../../models/Printer';
import { mockPrinterList } from '../../mockData/mockPrinterList';
import { mockLargePrintQueue, mockLocationPrintQueue, mockPrintQueue } from '../../mockData/mockPrintQueue';

describe('testing action creators', () => {
  it('testing action creators for print', () => {
    const setSelectedPrinterResults = setSelectedPrinter(mockPrinterList[0]);
    expect(setSelectedPrinterResults).toStrictEqual({
      type: SET_SELECTED_PRINTER,
      payload: mockPrinterList[0]
    });
    const setSignTypeResults = setSignType('XSmall');
    expect(setSignTypeResults).toStrictEqual({
      type: SET_SELECTED_SIGN_TYPE,
      payload: 'XSmall'
    });
    const addToPrinterListResults = addToPrinterList(mockPrinterList[0]);
    expect(addToPrinterListResults).toStrictEqual({
      type: ADD_TO_PRINTER_LIST,
      payload: mockPrinterList[0]
    });
    const deleteFromPrinterListResults = deleteFromPrinterList(mockPrinterList[0].id);
    expect(deleteFromPrinterListResults).toStrictEqual({
      type: DELETE_FROM_PRINTER_LIST,
      payload: mockPrinterList[0].id
    });
    const addToPrintQueueResults = addToPrintQueue(mockPrintQueue[0]);
    expect(addToPrintQueueResults).toStrictEqual({
      type: ADD_TO_PRINT_QUEUE,
      payload: mockPrintQueue[0]
    });
    const addMultipleToLocationPrintQueueResults = addMultipleToLocationPrintQueue(mockLocationPrintQueue);
    expect(addMultipleToLocationPrintQueueResults).toStrictEqual({
      type: ADD_MULTIPLE_TO_LOCATION_PRINT_QUEUE,
      payload: mockLocationPrintQueue
    });
    const itemNbrs: number[] = [];
    mockLargePrintQueue.forEach(printQueueItem => {
      if (printQueueItem.itemNbr) {
        itemNbrs.push(printQueueItem.itemNbr);
      }
    });
    const removeMultipleFromPrintQueueByItemNbrResults = removeMultipleFromPrintQueueByItemNbr(itemNbrs);
    expect(removeMultipleFromPrintQueueByItemNbrResults).toStrictEqual({
      type: REMOVE_MULT_FROM_PRINT_QUEUE_BY_ITEM_NBR,
      payload: itemNbrs
    })
  });
});
