import {
  ADD_TO_PRINTER_LIST,
  ADD_TO_PRINT_QUEUE,
  Actions,
  DELETE_FROM_PRINTER_LIST,
  SET_PRINT_QUEUE,
  SET_SELECTED_PRINTER,
  SET_SELECTED_SIGN_TYPE,
  TOGGLE_PRINT_SCREEN
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
  isPrintLocation: boolean;
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
  isPrintLocation: false
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
      // TODO NEED TO BE ABLE TO DELETE FROM LOCATION LIST
      // eslint-disable-next-line no-case-declarations
      const deleteIndex = printerList.findIndex(
        item => item.id === action.payload
      );
      printerList.splice(deleteIndex, 1);
      return {
        ...state,
        printerList
      };
    case ADD_TO_PRINT_QUEUE: {
      const updatedPrintQueue = [...printQueue, ...action.payload];
      // Push array
      return {
        ...state,
        printQueue: updatedPrintQueue
      };
    }
    case SET_PRINT_QUEUE:
      return {
        ...state,
        printQueue: action.payload
      };
    case TOGGLE_PRINT_SCREEN:
      return {
        ...state,
        isPrintLocation: action.payload
      };
    default:
      return state;
  }
};
