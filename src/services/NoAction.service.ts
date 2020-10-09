import Request from './Request';
import URLS from '../utils/environment';

export default class NoActionService {
  public static noAction(payload: {headers: object; upc: string; itemNbr: number; scannedValue: string;}) {
    return Request.enqueue({
      url: `${URLS.orchestrationURL}/worklist/item/${payload.itemNbr}/noaction`,
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
