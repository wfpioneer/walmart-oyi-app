import {
  ADD_LOCATION_PRINT_QUEUE,
  ADD_MULTIPLE_TO_PRINT_QUEUE,
  ADD_TO_PRINTER_LIST,
  ADD_TO_PRINT_QUEUE,
  Actions,
  CLEAR_LOCATION_PRINT_QUEUE,
  CLEAR_PORTABLE_LABEL_PRINTER,
  DELETE_FROM_PRINTER_LIST,
  REMOVE_MULT_FROM_PRINT_QUEUE_BY_ITEM_NBR,
  REMOVE_MULT_FROM_PRINT_QUEUE_BY_UPC,
  SET_LOCATION_LABEL_PRINTER,
  SET_PALLET_LABEL_PRINTER,
  SET_PRICE_LABEL_PRINTER,
  SET_PRINTING_LOCATION_LABELS,
  SET_PRINTING_PALLET_LABEL,
  SET_PRINT_QUEUE,
  SET_SELECTED_PRINTER,
  SET_SELECTED_SIGN_TYPE,
  UNSET_PRINTING_LOCATION_LABELS,
  UNSET_PRINTING_PALLET_LABEL
} from '../actions/Print';

import {
  PrintPaperSize,
  PrintQueueItem,
  Printer,
  PrinterType
} from '../../models/Printer';

interface StateType {
  selectedPrinter: Printer;
  selectedSignType: PrintPaperSize;
  printerList: Printer[];
  printQueue: PrintQueueItem[];
  printingLocationLabels: string;
  printingPalletLabel: boolean;
  locationPrintQueue: PrintQueueItem[];
  priceLabelPrinter: Printer | null;
  locationLabelPrinter: Printer | null;
  palletLabelPrinter: Printer | null
}

const initialState: StateType = {
  selectedPrinter: {
    type: PrinterType.LASER,
    name: '',
    desc: '',
    id: '0',
    labelsAvailable: ['price']
  },
  selectedSignType: '',
  printerList: [],
  printQueue: [],
  printingLocationLabels: '',
  printingPalletLabel: false,
  locationPrintQueue: [],
  priceLabelPrinter: {
    type: PrinterType.LASER,
    name: '',
    desc: '',
    id: '0',
    labelsAvailable: ['price']
  },
  locationLabelPrinter: null,
  palletLabelPrinter: null
};

export const Print = (state = initialState, action: Actions): StateType => {
  const { printerList, printQueue, locationPrintQueue } = state;
  switch (action.type) {
    case SET_SELECTED_PRINTER:
      return {
        ...state,
        selectedPrinter: {
          type: action.payload.type,
          name: action.payload.name,
          desc: action.payload.desc,
          id: action.payload.id,
          labelsAvailable: action.payload.labelsAvailable
        }
      };
    case SET_SELECTED_SIGN_TYPE:
      return {
        ...state,
        selectedSignType: action.payload
      };
    case ADD_TO_PRINTER_LIST:
      printerList.push(action.payload);

      return {
        ...state,
        printerList
      };
    case DELETE_FROM_PRINTER_LIST:
      // eslint-disable-next-line no-case-declarations
      const deleteIndex = printerList.findIndex(
        item => item.id === action.payload
      );
      printerList.splice(deleteIndex, 1);
      return {
        ...state,
        printerList
      };
    case ADD_TO_PRINT_QUEUE:
      printQueue.push(action.payload);

      return {
        ...state,
        printQueue
      };
    case ADD_MULTIPLE_TO_PRINT_QUEUE:
      return {
        ...state,
        printQueue: printQueue.concat(action.payload)
      };
    case REMOVE_MULT_FROM_PRINT_QUEUE_BY_ITEM_NBR: {
      const newQueue: PrintQueueItem[] = [];
      printQueue.forEach(item => {
        if (!item.itemNbr || (item.itemNbr && !action.payload.includes(item.itemNbr))) {
          newQueue.push(item);
        }
      });
      return {
        ...state,
        printQueue: newQueue
      };
    }
    case REMOVE_MULT_FROM_PRINT_QUEUE_BY_UPC: {
      const newQueue: PrintQueueItem[] = [];
      printQueue.forEach(item => {
        if (!item.upcNbr || (item.upcNbr && !action.payload.includes(item.upcNbr))) {
          newQueue.push(item);
        }
      });
      return {
        ...state,
        printQueue: newQueue
      };
    }
    case SET_PRINT_QUEUE:
      return {
        ...state,
        printQueue: action.payload
      };
    case SET_PRINTING_LOCATION_LABELS:
      return {
        ...state,
        printingLocationLabels: action.payload
      };
    case UNSET_PRINTING_LOCATION_LABELS:
      return {
        ...state,
        printingLocationLabels: ''
      };
    case SET_PRINTING_PALLET_LABEL:
      return {
        ...state,
        printingPalletLabel: true
      };
    case UNSET_PRINTING_PALLET_LABEL:
      return {
        ...state,
        printingPalletLabel: false
      };
    case ADD_LOCATION_PRINT_QUEUE:
      locationPrintQueue.push(action.payload);
      return {
        ...state,
        locationPrintQueue
      };
    case CLEAR_LOCATION_PRINT_QUEUE:
      return {
        ...state,
        locationPrintQueue: initialState.locationPrintQueue
      };
    case SET_PRICE_LABEL_PRINTER:
      return {
        ...state,
        priceLabelPrinter: action.payload
      };
    case SET_LOCATION_LABEL_PRINTER:
      return {
        ...state,
        locationLabelPrinter: action.payload
      };
    case SET_PALLET_LABEL_PRINTER:
      return {
        ...state,
        palletLabelPrinter: action.payload
      };
    case CLEAR_PORTABLE_LABEL_PRINTER:
      return {
        ...state,
        palletLabelPrinter: initialState.palletLabelPrinter,
        locationLabelPrinter: initialState.locationLabelPrinter,
        priceLabelPrinter: initialState.priceLabelPrinter
      };
    default:
      return state;
  }
};
