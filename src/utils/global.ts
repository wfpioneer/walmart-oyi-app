import {
  LaserPaperCn, LaserPaperMx, PortablePaperCn, PortablePaperMx, PrinterType
} from '../models/Printer';

export const SNACKBAR_TIMEOUT = 3000;
export const SNACKBAR_TIMEOUT_LONG = 5000;

export const getPaperSizeBasedOnCountry = (printerType: PrinterType | undefined, countryCode: string) => {
  if (countryCode === 'MX') {
    return printerType === PrinterType.LASER ? LaserPaperMx : PortablePaperMx;
  }
  return printerType === PrinterType.LASER ? LaserPaperCn : PortablePaperCn;
};
