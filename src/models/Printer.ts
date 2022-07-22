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
  itemName: string;
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

export enum LaserPaperCn {
  'XSmall' = 'X',
  'Small' = 'S',
  'Medium' = 'F',
  'Large' = 'H',
  'Wine' = 'X'
}

export enum LaserPaperMx {
  'XSmall' = 'X',
  'Small' = 'S',
  'Medium' = 'F',
  'Large' = 'H',
  'Wine' = 'W'
}

export enum PortablePaperCn {
  'XSmall' = 'j',
  'Small' = 'C',
  'Medium' = 'D',
  'Wine' = 'X'
}

export enum PortablePaperMx {
  'XSmall' = 'j',
  'Small' = 'C',
  'Medium' = 'D',
  'Wine' = 'W'
}

export type PrintPaperSize = keyof typeof LaserPaperCn | keyof typeof LaserPaperMx
| keyof typeof PortablePaperCn |keyof typeof PortablePaperMx | '';

export interface PrintQueueAPIMultistatus {
  itemNbr: number;
  upcNbr: string;
  completed: boolean;
}

export enum PrintingType {
  PRICE_SIGN = 'Price Sign',
  LOCATION = 'Location',
  PALLET = 'Pallet'
}
