import { AxiosResponse } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';
import { PrintItemList, PrintLocationList } from '../models/Printer';

export default class PrintService {
  public static print(payload: {
    headers: Record<string, unknown>;
    printList: PrintItemList[];
  }): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.post(
      `${urls.orchestrationURL}/print/price-sign`,
      payload.printList,
      { headers: payload.headers }
    );
  }

  public static printLabels(payload: {
    headers: Record<string, unknown>;
    printLabelList: PrintLocationList[];
  }): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.post(
      `${urls.printingUrl}/print/location-sign`,
      payload.printLabelList,
      {
        headers: payload.headers
      }
    );
  }
}
