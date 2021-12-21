import {
  ADD_MULTIPLE_TO_PRINT_QUEUE,
  ADD_TO_PRINTER_LIST,
  ADD_TO_PRINT_QUEUE,
  Actions,
  DELETE_FROM_PRINTER_LIST,
  REMOVE_MULT_FROM_PRINT_QUEUE_BY_ITEM_NBR,
  REMOVE_MULT_FROM_PRINT_QUEUE_BY_UPC,
  SET_PRINTING_LOCATION_LABELS,
  SET_PRINT_QUEUE,
  SET_SELECTED_PRINTER,
  SET_SELECTED_SIGN_TYPE,
  UNSET_PRINTING_LOCATION_LABELS
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
}

const initialState: StateType = {
  selectedPrinter: {
    type: PrinterType.LASER,
    name: '',
    desc: '',
    id: '0'
  },
  selectedSignType: '',
  printerList: [],
  printQueue: [],
  printingLocationLabels: ''
};

export const Print = (state = initialState, action: Actions): StateType => {
  const { printerList, printQueue } = state;
  switch (action.type) {
    case SET_SELECTED_PRINTER:
      return {
        ...state,
        selectedPrinter: {
          type: action.payload.type,
          name: action.payload.name,
          desc: action.payload.desc,
          id: action.payload.id
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
    default:
      return state;
  }
};
