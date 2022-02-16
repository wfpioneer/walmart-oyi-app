import { Printer, PrinterType } from '../models/Printer';

export const mockPrinterList: Printer[] = [
  {
    type: PrinterType.LASER,
    name: 'Test Laser Printer',
    desc: 'Test Printer',
    id: '123',
    labelsAvailable: []
  },
  {
    type: PrinterType.PORTABLE,
    name: 'Test Portable Printer',
    desc: 'Test Printer',
    id: '456',
    labelsAvailable: []
  },
  {
    type: PrinterType.LASER,
    name: 'Test Laser Printer#2',
    desc: 'Test Printer',
    id: '789',
    labelsAvailable: []
  }
];
