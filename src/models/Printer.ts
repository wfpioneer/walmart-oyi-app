/* eslint-disable no-shadow */
export interface Printer {
  type: PrinterType;
  name: string;
  desc: string;
  id: string;
  labelsAvailable: string[];
}

export enum PrinterType {
  LASER,
  PORTABLE
}

export enum PrintQueueItemType {
  ITEM = 'ITEM',
  SECTION = 'SECTION',
  AISLE = 'AISLE'
}

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
  itemType?: PrintQueueItemType
}
export interface PrintLocationList {
  locationId: number;
  qty: number;
  printerMACAddress: string;
}
export interface PrintPalletList {
  palletId: number;
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

export interface PrintQueueAPIMultistatus {
  itemNbr: number;
  upcNbr: string;
  completed: boolean;
}
