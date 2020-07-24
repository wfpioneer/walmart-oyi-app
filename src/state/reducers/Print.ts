import {
  ADD_TO_PRINT_QUEUE,
  ADD_TO_PRINTER_LIST,
  SET_SELECTED_PRINTER,
  SET_SELECTED_SIGN_TYPE
} from '../actions/Print';
import { Printer, PrinterType, PrintQueueItem } from '../../models/Printer';

interface StateType {
  selectedPrinter: Printer;
  selectedSignType: string;
  printerList: Printer[];
  printQueue: PrintQueueItem[];
}

const initialState: StateType = {
  selectedPrinter: {
    type: PrinterType.LASER,
    name: '',
    desc: '',
    id: 0
  },
  selectedSignType: '',
  printerList: [],
  printQueue: []
}

export const Print = (state = initialState, action: any) => {
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
      }
    case SET_SELECTED_SIGN_TYPE:
      return {
        ...state,
        selectedSignType: action.payload
      }
    case ADD_TO_PRINTER_LIST:
      const {printerList} = state;
      printerList.push(action.payload);

      return {
        ...state,
        printerList
      }
    case ADD_TO_PRINT_QUEUE:
      const {printQueue} = state;
      printQueue.push(action.payload);

      return {
        ...state,
        printQueue
      }
    default:
      return state;
  }
}
