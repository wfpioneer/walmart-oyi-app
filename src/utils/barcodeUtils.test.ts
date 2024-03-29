import React from 'react';
import {
  BARCODE_TYPES,
  cleanScanIfUpcOrEanBarcode,
  compareWithMaybeCheckDigit,
  removeCheckDigit,
  removeLeadingZero
} from './barcodeUtils';

describe('Barcode utilities function tests', () => {
  it('tests the remove check digit function', () => {
    const sampleBarcode = '1234567890';
    const checkDigitRemoved = removeCheckDigit(sampleBarcode);

    expect(checkDigitRemoved).toBe('123456789');
  });

  it('tests the remove leading zeros function', () => {
    const inputValues: { [key: string]: string } = {
      zeros: '00000000',
      trailing: '12345000',
      middle: '12000345',
      leading: '00012345',
      leadingMiddle: '001200345',
      leadingTrailing: '001234500',
      scattered: '00120034500',
      nonZero: '123456789'
    };

    const expectedOutput: { [key: string]: string } = {
      zeros: '',
      trailing: '12345000',
      middle: '12000345',
      leading: '12345',
      leadingMiddle: '1200345',
      leadingTrailing: '1234500',
      scattered: '120034500',
      nonZero: '123456789'
    };

    Object.entries(inputValues).forEach(entry => {
      const [key, value] = entry;
      const actualOutput = removeLeadingZero(value);

      expect(actualOutput).toBe(expectedOutput[key]);
    });
  });

  it('tests the clean barcode function', () => {
    const scanInputs: { [key: string]: { type: string | null; value: string | null } } = {
      manualScan: { type: null, value: '12345' },
      code128Scan: { type: BARCODE_TYPES.CODE_128, value: '12345' },
      upcAScan: { type: BARCODE_TYPES.UPC_A, value: '000000356312' },
      ean13Scan: { type: BARCODE_TYPES.EAN13, value: '0000000356312' },
      emptyScan: { type: null, value: null }
    };

    const expectedOutput: { [key: string]: string } = {
      manualScan: '12345',
      code128Scan: '12345',
      upcAScan: '35631',
      ean13Scan: '35631',
      emptyScan: ''
    };

    Object.entries(scanInputs).forEach(entry => {
      const [key, value] = entry;
      const actualOutput = cleanScanIfUpcOrEanBarcode(value);

      expect(actualOutput).toBe(expectedOutput[key]);
    });
  });

  it('tests that comparing a barcode to a upc works regardless of check digit', () => {
    // scanned shorter than upc
    let result = compareWithMaybeCheckDigit('123456', '1234567');
    expect(result).toBeFalsy();

    // scanned same length as upc, not same
    result = compareWithMaybeCheckDigit('123456', '123455');
    expect(result).toBeFalsy();

    // scanned same length as upc, same
    result = compareWithMaybeCheckDigit('123456', '123456');
    expect(result).toBeTruthy();

    // scanned longer than upc, not same
    result = compareWithMaybeCheckDigit('1234557', '123456');
    expect(result).toBeFalsy();

    // scanned longer than upc, same
    result = compareWithMaybeCheckDigit('1234567', '123456');
    expect(result).toBeTruthy();

    // scanned too long, not same
    result = compareWithMaybeCheckDigit('12345478', '123456');
    expect(result).toBeFalsy();

    // scanned too long, same
    result = compareWithMaybeCheckDigit('12345678', '123456');
    expect(result).toBeFalsy();
  });
});
