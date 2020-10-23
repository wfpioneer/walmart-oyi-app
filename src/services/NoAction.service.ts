import Request from './Request';
import { getEnvironment, Environment } from "../utils/environment";

export default class NoActionService {
  public static noAction(payload: {headers: object; upc: string; itemNbr: number; scannedValue: string;}) {
    const urls: Environment = getEnvironment();
    return Request.enqueue({
      url: `${urls.orchestrationURL}/worklist/item/${payload.itemNbr}/noaction`,
      method: 'put',
      data: {
        worklistItemUpc: payload.upc,
        worklistItemNbr: payload.itemNbr,
        scannedValue: payload.scannedValue
      },
      timeout: 10000,
      headers: payload.headers
    });
  }
}
