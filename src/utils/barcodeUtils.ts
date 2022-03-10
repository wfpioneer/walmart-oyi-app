export const removeCheckDigit = (barcode: string): string => barcode.substring(0, barcode.length - 1);

export const removeLeadingZero = (barcode: string): string => barcode.replace(/\D|^0+/g, '');
