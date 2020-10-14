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

export interface PrintQueueItem {
  image?: any;
  itemName: string;
  itemNbr: number;
  upcNbr: string;
  catgNbr: number;
  signQty: number;
  paperSize: LaserPaper | PortablePaper;
  worklistType: string;
}
// TODO mx wine label code is 'W', when implementing multitenetness need to adjust papersizes for the correct market
export enum LaserPaper {
  'XSmall'= 'X',
  'Small'= 'S',
  'Medium'= 'F',
  'Large'= 'H',
  'Wine'= 'X'
}

export enum PortablePaper {
  'XSmall'= 'j',
  'Small'= 'C',
  'Medium'= 'D',
  'Wine'= 'X'
}
