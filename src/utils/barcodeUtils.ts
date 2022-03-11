// eslint-disable-next-line no-shadow
export enum BARCODE_TYPES {
  QR_CODE = 'QR Code',
  QR_CODE_LABEL = 'LABEL-TYPE-QRCODE',
  CODE_128 = 'LABEL-TYPE-CODE128',
  EAN13 = 'LABEL-TYPE-EAN13',
  UPC_A = 'LABEL-TYPE-UPCA',
  UPCE0 = 'LABEL-TYPE-UPCE0',
  CODE_39 = 'LABEL-TYPE-CODE39',
  EAN8 = 'LABEL-TYPE-EAN8'
}

export const removeCheckDigit = (barcode: string): string => barcode.substring(0, barcode.length - 1);

export const removeLeadingZero = (barcode: string): string => barcode.replace(/\D|^0+/g, '');

export const cleanIfUpcOrEan = (scanned: { type: string | null; value: string | null}): string => {
  if (scanned.value) {
    if (scanned.type === BARCODE_TYPES.EAN13 || scanned.type === BARCODE_TYPES.UPC_A) {
      return removeLeadingZero(removeCheckDigit(scanned.value));
    }
    return scanned.value;
  }
  return '';
};
