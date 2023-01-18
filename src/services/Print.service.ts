import { AxiosRequestHeaders, AxiosResponse } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';
import { PrintItemList, PrintLocationList, PrintPalletList } from '../models/Printer';

const TIMEOUT = 15000;

export default class PrintService {
  public static print(payload: {
    headers?: AxiosRequestHeaders;
    printList: PrintItemList[];
  }): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.post(
      `${urls.orchestrationURL}/print/v1/price-sign`,
      payload.printList,
      { headers: payload.headers, timeout: TIMEOUT }
    );
  }

  public static printLabels(payload: {
    headers?: AxiosRequestHeaders;
    printLabelList: PrintLocationList[];
  }): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.post(
      `${urls.itemDetailsURL}/print/location-sign`,
      payload.printLabelList,
      {
        headers: payload.headers,
        timeout: TIMEOUT
      }
    );
  }

  public static printPallet(payload: {
    headers?: AxiosRequestHeaders;
    printPalletList: PrintPalletList[];
  }): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.post(
      `${urls.itemDetailsURL}/print/pallet-label`,
      payload.printPalletList,
      {
        headers: payload.headers,
        timeout: TIMEOUT
      }
    );
  }
}
