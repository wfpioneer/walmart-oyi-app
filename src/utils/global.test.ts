import {
  LaserPaperCn, LaserPaperMx, LaserPaperPrice, PortablePaperCn, PortablePaperMx, PrinterType
} from '../models/Printer';
import { getFiniteFixedPercent, getPaperSizeBasedOnCountry } from './global';

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

  it('tests getting a percentage', () => {
    const piPercent = 31.43;

    const actual = getFiniteFixedPercent(11, 35, false);

    expect(actual).toBe(piPercent);
  });

  it('tests getting a whole percentage', () => {
    const wholePercentage = 31;
    // 11/35 roughly equals ~0.3143 or ~31.43%
    const actual = getFiniteFixedPercent(11, 35, true);

    expect(actual).toBe(wholePercentage);
  });
});
