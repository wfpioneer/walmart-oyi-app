import Request from './Request';
import URLS from '../utils/environment';

export default class UpdateOHQtyService {
  public static updateOHQty(payload: {headers: object; itemNumber: number; data: {onHandQty: number;};}) {
    return Request.enqueue({
      url: `${URLS.orchestrationURL}/item/${payload.itemNumber}/onhands`,
      method: 'put',
      timeout: 10000,
      headers: payload.headers,
      data: payload.data
    });
  }
}
