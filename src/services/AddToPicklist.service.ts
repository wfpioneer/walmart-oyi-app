import Request from './Request';
import URLS from '../utils/environment';

export default class AddToPicklistService {
  public static addToPicklist(payload: {headers: object; itemNumber: number}) {
    return Request.enqueue({
      url: `${URLS.itemDetailsURL}/picklist`,
      method: 'post',
      data: {
        itemNbr: payload.itemNumber
      },
      timeout: 10000,
      headers: payload.headers
    });
  }
}
