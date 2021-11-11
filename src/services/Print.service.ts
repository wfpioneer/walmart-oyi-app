import { AxiosResponse } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

export default class PrintService {
  public static print(payload: {
    headers: Record<string, unknown>;
    printlist: [Record<string, unknown>];
  }): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.post(
      `${urls.orchestrationURL}/print/price-sign`,
      payload.printlist,
      { headers: payload.headers }
    );
  }

  public static printLabels(payload: {
    headers: Record<string, unknown>;
    locationId: number;
    qty: number;
    printerMacAddress: string;
  }): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.post(
      `${urls.orchestrationURL}/print/location-sign`,
      {
        locationId: payload.locationId,
        qty: payload.qty,
        printerMacAddress: payload.printerMacAddress
      },
      {
        headers: payload.headers
      }
    );
  }
}
