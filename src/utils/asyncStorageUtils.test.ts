import { mockPrinterList } from '../mockData/mockPrinterList';
import {
  clearAsyncStorage,
  clearPrinterList,
  deleteLocationLabelPrinter,
  deletePalletLabelPrinter,
  deletePriceLabelPrinter,
  deletePrinter,
  getLocationLabelPrinter,
  getPalletLabelPrinter,
  getPriceLabelPrinter,
  getPrinterList,
  savePrinter,
  setLocationLabelPrinter,
  setPalletLabelPrinter,
  setPriceLabelPrinter
} from './asyncStorageUtils';

describe.only('Tests Async Storage: ', () => {
  describe('Testing Printer Functions', () => {
    it('Saves a printer to the async storage then removes the printer', async () => {
      const singlePrinter = [mockPrinterList[0]];
      await savePrinter(mockPrinterList[0]);
      const printStorageResults = await getPrinterList();
      expect(printStorageResults).toStrictEqual(singlePrinter);

      await deletePrinter(mockPrinterList[0].id);
      const emptyStorageResults = await getPrinterList();
      expect(emptyStorageResults).toStrictEqual([]);
    });

    it('Saves multiple printers to the async storage then removes all printers', async () => {
      mockPrinterList.forEach(async printer => {
        await savePrinter(printer);
      });
      const printerListResults = await getPrinterList();
      expect(printerListResults).toStrictEqual(mockPrinterList);

      await clearPrinterList();
      const emptyStorageResults = await getPrinterList();
      expect(emptyStorageResults).toStrictEqual([]);
    });

    it('Tests saving + retrieving LocationLabelPrinter', async () => {
      await setLocationLabelPrinter(mockPrinterList[1]);
      const locationLabelResults = await getLocationLabelPrinter();
      expect(locationLabelResults).toStrictEqual(mockPrinterList[1]);

      await deleteLocationLabelPrinter();
      const emptyLocationResults = await getLocationLabelPrinter();
      expect(emptyLocationResults).toBeNull();
    });

    it('Tests saving + retrieving PalletLabelPrinter', async () => {
      await setPalletLabelPrinter(mockPrinterList[1]);
      const palletLabelResults = await getPalletLabelPrinter();
      expect(palletLabelResults).toStrictEqual(mockPrinterList[1]);

      await deletePalletLabelPrinter();
      const emptyPalletResults = await getPalletLabelPrinter();
      expect(emptyPalletResults).toBeNull();
    });

    it('Tests saving + retrieving PriceLabelPrinter', async () => {
      await setPriceLabelPrinter(mockPrinterList[1]);
      const priceLabelResults = await getPriceLabelPrinter();
      expect(priceLabelResults).toStrictEqual(mockPrinterList[1]);

      await deletePriceLabelPrinter();
      const emptyPriceResults = await getPriceLabelPrinter();
      expect(emptyPriceResults).toBeNull();
    });
  });

  describe('Test general async storage functions', () => {
    it('tests clearAsyncStorage function', async () => {
      mockPrinterList.forEach(async printer => {
        await savePrinter(printer);
      });
      const printerListResults = await getPrinterList();
      await setLocationLabelPrinter(mockPrinterList[1]);
      const locationLabelResults = await getLocationLabelPrinter();
      expect(printerListResults).toStrictEqual(mockPrinterList);
      expect(locationLabelResults).toStrictEqual(mockPrinterList[1]);

      await clearAsyncStorage();
      const emptyPrintListResults = await getPrinterList();
      const emptyLocationLabelResults = await getLocationLabelPrinter();
      expect(emptyPrintListResults).toStrictEqual([]);
      expect(emptyLocationLabelResults).toBeNull();
    });
  });
});
