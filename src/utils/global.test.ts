import {
  LaserPaperCn, LaserPaperMx, LaserPaperPrice, PortablePaperCn, PortablePaperMx, PrinterType
} from '../models/Printer';
import { getPaperSizeBasedOnCountry } from './global';

describe('test global utilities function', () => {
  it('test getPaperSizeBasedOnCountry utility function', () => {
    let mockSelectedPrinterType = PrinterType.LASER;
    let mockCountryCode = 'MX';
    let paperSizeObj = getPaperSizeBasedOnCountry(mockSelectedPrinterType, mockCountryCode);
    const mixedLaserPaperSizeMX = { ...LaserPaperMx, ...LaserPaperPrice };
    const mixedLaserPaperSizeCN = { ...LaserPaperCn, ...LaserPaperPrice };
    expect(paperSizeObj).toEqual(mixedLaserPaperSizeMX);
    mockCountryCode = 'CN';
    mockSelectedPrinterType = PrinterType.PORTABLE;
    paperSizeObj = getPaperSizeBasedOnCountry(mockSelectedPrinterType, mockCountryCode);
    expect(paperSizeObj).toEqual(PortablePaperCn);
    mockSelectedPrinterType = PrinterType.LASER;
    paperSizeObj = getPaperSizeBasedOnCountry(mockSelectedPrinterType, mockCountryCode);
    expect(paperSizeObj).toEqual(mixedLaserPaperSizeCN);
    mockCountryCode = 'MX';
    mockSelectedPrinterType = PrinterType.PORTABLE;
    paperSizeObj = getPaperSizeBasedOnCountry(mockSelectedPrinterType, mockCountryCode);
    expect(paperSizeObj).toEqual(PortablePaperMx);
  });
});
