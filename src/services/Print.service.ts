import Request from './Request';
import { getEnvironment, Environment } from '../utils/environment';

export default class PrintService {
  public static print(payload: {headers: object; printlist: [object]}) {
    const urls: Environment = getEnvironment();
    return Request.enqueue({
      url: `${urls.orchestrationURL}/print/price-sign`,
      method: 'post',
      data: payload.printlist,
      headers: payload.headers
    });
  }
}
