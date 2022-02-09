import AsyncStorage from '@react-native-async-storage/async-storage';
import { Printer } from '../models/Printer';

const LOCATION_LABEL = 'locationLabelPrinter';
const PALLET_LABEL = 'palletLabelPrinter';
const PRICE_LABEL = 'priceLabelPrinter';

export const savePrinter = async (printer: Printer): Promise<boolean> => {
  try {
    const printerString = JSON.stringify(printer);
    await AsyncStorage.setItem(`printer-${printer.id}`, printerString);
    return true;
  } catch (e) {
    return false;
  }
};

export const deletePrinter = async (printerId: string): Promise<boolean> => {
  /* when deleting a printer you need to check if that printer is
  currently set as one of the printers being used and if so remove that printer from the printer setting */
  try {
    await AsyncStorage.removeItem(`printer-${printerId}`);
    return true;
  } catch (e) {
    return false;
  }
};

export const getPrinterList = async (): Promise<null | Printer[]> => {
  try {
    const printerKeys = await AsyncStorage.getAllKeys();
    const savedPrinterList = await AsyncStorage.multiGet(printerKeys);
    return savedPrinterList.reduce(
      (
        previousValue: Array<Printer>,
        currentValue: [string | null, string | null]
      ) => {
        if (currentValue[1] && currentValue[0]?.startsWith('printer-')) {
          previousValue.push(JSON.parse(currentValue[1]));
        }
        return previousValue;
      },
      []
    );
  } catch (e) {
    return null;
  }
};

export const clearPrinterList = async (): Promise<boolean> => {
  /* Clear all that start with printer */
  try {
    const printerKeys: string[] = [];
    (await AsyncStorage.getAllKeys()).forEach(key => {
      if (key.startsWith('printer-')) {
        printerKeys.push(key);
      }
    });
    await AsyncStorage.multiRemove(printerKeys);
    return true;
  } catch (e) {
    return false;
  }
};

export const setPriceLabelPrinter = async (
  printer: Printer
): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(PRICE_LABEL, JSON.stringify(printer));
    return true;
  } catch (e) {
    return false;
  }
};

export const getPriceLabelPrinter = async (): Promise<string | null> => {
  try {
    const priceLabelResult = await AsyncStorage.getItem(PRICE_LABEL);
    return priceLabelResult ? JSON.parse(priceLabelResult) : null;
  } catch (e) {
    return null;
  }
};

export const deletePriceLabelPrinter = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(PRICE_LABEL);
    return true;
  } catch (e) {
    return false;
  }
};

export const setLocationLabelPrinter = async (
  printer: Printer
): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(LOCATION_LABEL, JSON.stringify(printer));
    return true;
  } catch (e) {
    return false;
  }
};

export const getLocationLabelPrinter = async (): Promise<string | null> => {
  try {
    const locationLabelResult = await AsyncStorage.getItem(LOCATION_LABEL);
    return locationLabelResult ? JSON.parse(locationLabelResult) : null;
  } catch (e) {
    return null;
  }
};

export const deleteLocationLabelPrinter = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(LOCATION_LABEL);
    return true;
  } catch (e) {
    return false;
  }
};

export const setPalletLabelPrinter = async (
  printer: Printer
): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(PALLET_LABEL, JSON.stringify(printer));
    return true;
  } catch (e) {
    return false;
  }
};

export const getPalletLabelPrinter = async (): Promise<string | null> => {
  try {
    const palletLabelResult = await AsyncStorage.getItem(PALLET_LABEL);
    return palletLabelResult ? JSON.parse(palletLabelResult) : null;
  } catch (e) {
    return null;
  }
};

export const deletePalletLabelPrinter = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(PALLET_LABEL);
    return true;
  } catch (e) {
    return false;
  }
};

export const clearAsyncStorage = async (): Promise<boolean> => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch {
    return false;
  }
};
