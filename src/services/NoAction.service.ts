import { AxiosRequestHeaders } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

export interface NoActionHeaders extends AxiosRequestHeaders {
  worklistType: string[];
}
export default class NoActionService {
  public static noAction(payload: {
    headers?: AxiosRequestHeaders;
    upc: string;
    itemNbr: number;
    scannedValue: string;
  }) {
    const urls: Environment = getEnvironment();
    return Request.put(
      `${urls.orchestrationURL}/worklist/item/${payload.itemNbr}/noaction`,
      {
        worklistItemUpc: payload.upc,
        worklistItemNbr: payload.itemNbr,
        scannedValue: payload.scannedValue
      },
      { headers: payload.headers }
    );
  }

  public static noActionV1(payload: {
    headers?: NoActionHeaders;
    upc: string;
    itemNbr: number;
    scannedValue: string;
  }) {
    const urls: Environment = getEnvironment();
    return Request.put(
      `${urls.orchestrationURL}/worklist/item/${payload.itemNbr}`,
      {
        worklistItemUpc: payload.upc,
        worklistItemNbr: payload.itemNbr,
        scannedValue: payload.scannedValue
      },
      { headers: payload.headers }
    );
  }
}
