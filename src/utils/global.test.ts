import {
  LaserPaperCn, LaserPaperMx, PortablePaperCn, PortablePaperMx, PrinterType
} from '../models/Printer';
import { getPaperSizeBasedOnCountry } from './global';

describe('test global utilities function', () => {
  it('test getPaperSizeBasedOnCountry utility function', () => {
    let mockSelectedPrinterType = PrinterType.LASER;
    let mockCountryCode = 'MX';
    let paperSizeObj = getPaperSizeBasedOnCountry(mockSelectedPrinterType, mockCountryCode);
    expect(paperSizeObj).toEqual(LaserPaperMx);
    mockCountryCode = 'CN';
    mockSelectedPrinterType = PrinterType.PORTABLE;
    paperSizeObj = getPaperSizeBasedOnCountry(mockSelectedPrinterType, mockCountryCode);
    expect(paperSizeObj).toEqual(PortablePaperCn);
    mockSelectedPrinterType = PrinterType.LASER;
    paperSizeObj = getPaperSizeBasedOnCountry(mockSelectedPrinterType, mockCountryCode);
    expect(paperSizeObj).toEqual(LaserPaperCn);
    mockCountryCode = 'MX';
    mockSelectedPrinterType = PrinterType.PORTABLE;
    paperSizeObj = getPaperSizeBasedOnCountry(mockSelectedPrinterType, mockCountryCode);
    expect(paperSizeObj).toEqual(PortablePaperMx);
  });
});
