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

export const getPortablePaperSizeByCountry = (countryCode: string) => {
  if (countryCode === 'MX') {
    return PortablePaperMx;
  }
  return PortablePaperCn;
};

export const getLaserPaperSizeByCountry = (countryCode: string) => {
  if (countryCode === 'MX') {
    return { ...LaserPaperMx, ...LaserPaperPrice };
  }
  return { ...LaserPaperCn, ...LaserPaperPrice };
};

export const getPaperSizeBasedOnCountry = (
  printerType: PrinterType | undefined,
  countryCode: string,
) => {
  switch (printerType) {
    case PrinterType.LASER: return getLaserPaperSizeByCountry(countryCode);
    case PrinterType.PORTABLE: return getPortablePaperSizeByCountry(countryCode);
    default: return countryCode === 'MX' ? LaserPaperMx : LaserPaperCn;
  }
};
