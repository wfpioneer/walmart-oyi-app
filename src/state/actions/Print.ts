import { PrintQueueItem, Printer } from '../../models/Printer';

export const SET_SELECTED_PRINTER = 'PRINT/SET_SELECTED_PRINTER';
export const SET_SELECTED_SIGN_TYPE = 'PRINT/SET_SELECTED_SIGN_TYPE';
export const ADD_TO_PRINTER_LIST = 'PRINT/ADD_TO_PRINTER_LIST';
export const DELETE_FROM_PRINTER_LIST = 'PRINT/DELETE_FROM_PRINTER_LIST';
export const ADD_TO_PRINT_QUEUE = 'PRINT/ADD_TO_PRINT_QUEUE';
export const SET_PRINT_QUEUE = 'PRINT/SET_PRINT_QUEUE';

export const setSelectedPrinter = (printer: Printer) => ({
  type: SET_SELECTED_PRINTER,
  payload: printer
});

export const setSignType = (type: string) => ({
  type: SET_SELECTED_SIGN_TYPE,
  payload: type
});

export const addToPrinterList = (printer: Printer) => ({
  type: ADD_TO_PRINTER_LIST,
  payload: printer
});

export const deleteFromPrinterList = (printerId: number) => ({
  type: DELETE_FROM_PRINTER_LIST,
  payload: printerId
});

export const addToPrintQueue = (label: PrintQueueItem) => ({
  type: ADD_TO_PRINT_QUEUE,
  payload: label
});

export const setPrintQueue = (printQueue: PrintQueueItem[]) => ({
  type: SET_PRINT_QUEUE,
  payload: printQueue
});
