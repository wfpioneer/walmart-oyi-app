import Request from './Request';
import URLS from '../utils/environment';

export default class PrintService {
  public static print(payload: {headers: object; upc: string; sectionId: string; locationTypeNbr: number}) {
    return Request.enqueue({
      url: `${URLS.orchestrationURL}/item/${payload.upc}/location/`,
      method: 'post',
      data: payload,
      timeout: 10000,
      headers: payload.headers
    });
  }
}
