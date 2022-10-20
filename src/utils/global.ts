import {
  LaserPaperCn,
  LaserPaperMx,
  LaserPaperPrice,
  PortablePaperCn,
  PortablePaperMx,
  PrinterType
} from '../models/Printer';

export const SNACKBAR_TIMEOUT = 3000;
export const SNACKBAR_TIMEOUT_LONG = 5000;

export const getPaperSizeBasedOnCountry = (
  printerType: PrinterType | undefined,
  countryCode: string,
) => {
  if (countryCode === 'MX') {
    switch (printerType) {
      case PrinterType.LASER: return { ...LaserPaperMx, ...LaserPaperPrice };
      case PrinterType.PORTABLE: return PortablePaperMx;
      default: return LaserPaperMx;
    }
  }
  switch (printerType) {
    case PrinterType.LASER: return { ...LaserPaperCn, ...LaserPaperPrice };
    case PrinterType.PORTABLE: return PortablePaperCn;
    default: return LaserPaperCn;
  }
};
