import { Printer, PrintQueueItem } from '../../models/Printer';

export const SET_SELECTED_PRINTER = 'PRINT/SET_SELECTED_PRINTER';
export const SET_SELECTED_SIGN_TYPE = 'PRINT/SET_SELECTED_SIGN_TYPE';
export const ADD_TO_PRINTER_LIST = 'PRINT/ADD_TO_PRINTER_LIST';
export const ADD_TO_PRINT_QUEUE = 'PRINT/ADD_TO_PRINT_QUEUE';

export const setSelectedPrinter = (printer: Printer) => {
  return {
    type: SET_SELECTED_PRINTER,
    payload: printer
  }
}

export const setSignType = (type: string) => {
  return {
    type: SET_SELECTED_SIGN_TYPE,
    payload: type
  }
}

export const addToPrinterList = (printer: Printer) => {
  return {
    type: ADD_TO_PRINTER_LIST,
    payload: printer
  }
}

export const addToPrintQueue = (label: PrintQueueItem) => {
  return {
    type: ADD_TO_PRINT_QUEUE,
    payload: label
  }
}
