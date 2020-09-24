export interface Printer {
  type: PrinterType;
  name: string;
  desc: string;
  id: number;
}

export enum PrinterType {
  LASER,
  PORTABLE
}

export interface PrintQueueItem {
  image?: any;
  itemName: string;
  itemNbr : number;
  upcNbr : string;
  catgNbr: number;
  signQty: number;
  paperSize: LaserPaper | PortablePaper;
}

export enum LaserPaper {
  'XSmall'= 'X',
  'Small'= 'S',
  'Medium'= 'F',
  'Large'= 'H',
  'Wine'= 'W'
}

export enum PortablePaper {
  'XSmall'= 'j',
  'Small'= 'C',
  'Medium'= 'D',
  'Wine'= 'W'
}
