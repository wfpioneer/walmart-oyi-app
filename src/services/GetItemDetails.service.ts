import Request from './Request';
import URLS from '../utils/environment';

export default class GetItemDetailsService {
  public static getItemDetails(payload: {headers: object; id: number}) {
    return Request.enqueue({
      url: `${URLS.itemDetailsURL}/item/${payload.id}`,
      method: 'get',
      timeout: 10000,
      headers: payload.headers
    });
  }
}
