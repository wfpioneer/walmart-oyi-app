import Request from './Request';
import URLS from '../utils/environment';

export default class PrintService {
  public static print(payload: {headers: object; printlist: [object]}) {
    return Request.enqueue({
      url: `${URLS.orchestrationURL}/print/price-sign`,
      method: 'post',
      data: payload.printlist,
      timeout: 10000,
      headers: payload.headers
    });
  }
}
