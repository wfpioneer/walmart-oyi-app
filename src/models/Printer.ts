/* eslint-disable no-shadow */
export interface Printer {
  type: PrinterType;
  name: string;
  desc: string;
  id: string;
}

export enum PrinterType {
  LASER,
  PORTABLE
}

export type PrintQueueListType = 'ITEM' | 'LOCATION';

export interface PrintQueueItem {
  image?: any;
  itemName?: string;
  itemNbr?: number;
  upcNbr?: string;
  catgNbr?: number;
  signQty: number;
  paperSize: PrintPaperSize;
  worklistType?: string;
  locationId?: number;
  itemType: PrintQueueListType;
}
export interface PrintLocationList {
  locationId: number;
  qty: number;
  printerMACAddress: string;
}
export interface PrintItemList {
  itemNbr: number;
  qty: number;
  code: string;
  description: string;
  printerMACAddress: string;
  isPortablePrinter: boolean;
  workListTypeCode: string;
}

// TODO mx wine label code is 'W', when implementing multitenetness need to adjust papersizes for the correct market
export enum LaserPaper {
  'XSmall' = 'X',
  'Small' = 'S',
  'Medium' = 'F',
  'Large' = 'H',
  'Wine' = 'X'
}

export enum PortablePaper {
  'XSmall' = 'j',
  'Small' = 'C',
  'Medium' = 'D',
  'Wine' = 'X'
}

export type PrintPaperSize = keyof typeof LaserPaper | keyof typeof PortablePaper | '';
