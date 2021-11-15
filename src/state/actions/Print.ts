import { PrintPaper, PrintQueueItem, Printer } from '../../models/Printer';

export const SET_SELECTED_PRINTER = 'PRINT/SET_SELECTED_PRINTER';
export const SET_SELECTED_SIGN_TYPE = 'PRINT/SET_SELECTED_SIGN_TYPE';
export const ADD_TO_PRINTER_LIST = 'PRINT/ADD_TO_PRINTER_LIST';
export const DELETE_FROM_PRINTER_LIST = 'PRINT/DELETE_FROM_PRINTER_LIST';
export const ADD_TO_PRINT_QUEUE = 'PRINT/ADD_TO_PRINT_QUEUE';
export const SET_PRINT_QUEUE = 'PRINT/SET_PRINT_QUEUE';

export const setSelectedPrinter = (printer: Printer) => ({
  type: SET_SELECTED_PRINTER,
  payload: printer
} as const);

export const setSignType = (type: PrintPaper) => ({
  type: SET_SELECTED_SIGN_TYPE,
  payload: type
} as const);

export const addToPrinterList = (printer: Printer) => ({
  type: ADD_TO_PRINTER_LIST,
  payload: printer
} as const);

export const deleteFromPrinterList = (printerId: string) => ({
  type: DELETE_FROM_PRINTER_LIST,
  payload: printerId
} as const);

export const addToPrintQueue = (label: PrintQueueItem) => ({
  type: ADD_TO_PRINT_QUEUE,
  payload: label
} as const);

export const setPrintQueue = (printQueue: PrintQueueItem[]) => ({
  type: SET_PRINT_QUEUE,
  payload: printQueue
} as const);

export type Actions =
| ReturnType<typeof setSelectedPrinter>
| ReturnType<typeof setSignType>
| ReturnType<typeof addToPrinterList>
| ReturnType<typeof deleteFromPrinterList>
| ReturnType<typeof addToPrintQueue>
| ReturnType<typeof setPrintQueue>
