import {
  PrintPaperSize, PrintQueueItem, Printer, PrintingType
} from '../../models/Printer';

export const SET_SELECTED_PRINTER = 'PRINT/SET_SELECTED_PRINTER';
export const SET_SELECTED_SIGN_TYPE = 'PRINT/SET_SELECTED_SIGN_TYPE';
export const ADD_TO_PRINTER_LIST = 'PRINT/ADD_TO_PRINTER_LIST';
export const DELETE_FROM_PRINTER_LIST = 'PRINT/DELETE_FROM_PRINTER_LIST';
export const ADD_TO_PRINT_QUEUE = 'PRINT/ADD_TO_PRINT_QUEUE';
export const ADD_MULTIPLE_TO_LOCATION_PRINT_QUEUE = 'PRINT/ADD_MULTIPLE_TO_LOCATION_PRINT_QUEUE';
export const REMOVE_MULT_FROM_PRINT_QUEUE_BY_ITEM_NBR = 'PRINT/REMOVE_MULT_FROM_PRINT_QUEUE_BY_ITEM_NBR';
export const REMOVE_MULT_FROM_PRINT_QUEUE_BY_UPC = 'PRINT/REMOVE_MULT_FROM_PRINT_QUEUE_BY_UPC';
export const SET_PRINT_QUEUE = 'PRINT/SET_PRINT_QUEUE';
export const SET_PRINTING_LOCATION_LABELS = 'PRINT/SET_PRINTING_LOCATION_LABELS';
export const UNSET_PRINTING_LOCATION_LABELS = 'PRINT/UNSET_PRINTING_LOCATION_LABELS';
export const SET_PRINTING_PALLET_LABEL = 'PRINT/SET_PRINTING_PALLET_LABEL';
export const UNSET_PRINTING_PALLET_LABEL = 'PRINT/UNSET_PRINTING_PALLET_LABEL';
export const ADD_LOCATION_PRINT_QUEUE = 'PRINT/ADD_LOCATION_PRINT_QUEUE';
export const SET_LOCATION_PRINT_QUEUE = 'PRINT/SET_LOCATION_PRINT_QUEUE';
export const CLEAR_LOCATION_PRINT_QUEUE = 'PRINT/CLEAR_LOCATION_PRINT_QUEUE';
export const SET_PRICE_LABEL_PRINTER = 'PRINT/SET_PRICE_LABEL_PRINTER';
export const SET_LOCATION_LABEL_PRINTER = 'PRINT/SET_LOCATION_LABEL_PRINTER';
export const SET_PALLET_LABEL_PRINTER = 'PRINT/SET_PALLET_LABEL_PRINTER';
export const SET_PRINTING_TYPE = 'PRINT/SET_PRINTING_TYPE';
export const SET_PRINTER_LIST = 'PRINT/SET_PRINTER_LIST';

export const setSelectedPrinter = (printer: Printer) => ({
  type: SET_SELECTED_PRINTER,
  payload: printer
} as const);

export const setSignType = (type: PrintPaperSize) => ({
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

export const addMultipleToLocationPrintQueue = (labels: PrintQueueItem[]) => ({
  type: ADD_MULTIPLE_TO_LOCATION_PRINT_QUEUE,
  payload: labels
} as const);

export const removeMultipleFromPrintQueueByItemNbr = (itemNbrs: number[]) => ({
  type: REMOVE_MULT_FROM_PRINT_QUEUE_BY_ITEM_NBR,
  payload: itemNbrs
} as const);

export const removeMultipleFromPrintQueueByUpc = (upcs: string[]) => ({
  type: REMOVE_MULT_FROM_PRINT_QUEUE_BY_UPC,
  payload: upcs
} as const);

export const setPrintQueue = (printQueue: PrintQueueItem[]) => ({
  type: SET_PRINT_QUEUE,
  payload: printQueue
} as const);

export const setPrintingLocationLabels = (screen: string) => ({
  type: SET_PRINTING_LOCATION_LABELS,
  payload: screen
} as const);

export const unsetPrintingLocationLabels = () => ({
  type: UNSET_PRINTING_LOCATION_LABELS
} as const);

export const setPrintingPalletLabel = () => ({
  type: SET_PRINTING_PALLET_LABEL
} as const);

export const unsetPrintingPalletLabel = () => ({
  type: UNSET_PRINTING_PALLET_LABEL
} as const);

export const addLocationPrintQueue = (locationLabel: PrintQueueItem) => ({
  type: ADD_LOCATION_PRINT_QUEUE,
  payload: locationLabel
} as const);

export const setLocationPrintQueue = (locationQueue: PrintQueueItem[]) => ({
  type: SET_LOCATION_PRINT_QUEUE,
  payload: locationQueue
} as const);

export const clearLocationPrintQueue = () => ({
  type: CLEAR_LOCATION_PRINT_QUEUE
} as const);

export const setPriceLabelPrinter = (printer : Printer | null) => ({
  type: SET_PRICE_LABEL_PRINTER,
  payload: printer
} as const);

export const setLocationLabelPrinter = (printer : Printer | null) => ({
  type: SET_LOCATION_LABEL_PRINTER,
  payload: printer
} as const);

export const setPalletLabelPrinter = (printer : Printer | null) => ({
  type: SET_PALLET_LABEL_PRINTER,
  payload: printer
} as const);

export const setPrintingType = (printingType: PrintingType) => ({
  type: SET_PRINTING_TYPE,
  payload: printingType
} as const);

export const setPrinterList = (printerList: Printer[]) => ({
  type: SET_PRINTER_LIST,
  payload: printerList
} as const);

export type Actions =
| ReturnType<typeof setSelectedPrinter>
| ReturnType<typeof setSignType>
| ReturnType<typeof addToPrinterList>
| ReturnType<typeof deleteFromPrinterList>
| ReturnType<typeof addToPrintQueue>
| ReturnType<typeof addMultipleToLocationPrintQueue>
| ReturnType<typeof removeMultipleFromPrintQueueByItemNbr>
| ReturnType<typeof removeMultipleFromPrintQueueByUpc>
| ReturnType<typeof setPrintQueue>
| ReturnType<typeof setPrintingLocationLabels>
| ReturnType<typeof unsetPrintingLocationLabels>
| ReturnType<typeof setPrintingPalletLabel>
| ReturnType<typeof unsetPrintingPalletLabel>
| ReturnType<typeof addLocationPrintQueue>
| ReturnType<typeof setLocationPrintQueue>
| ReturnType<typeof clearLocationPrintQueue>
| ReturnType<typeof setPriceLabelPrinter>
| ReturnType<typeof setLocationLabelPrinter>
| ReturnType<typeof setPalletLabelPrinter>
| ReturnType<typeof setPrintingType>
| ReturnType<typeof setPrinterList>
