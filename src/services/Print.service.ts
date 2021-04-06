import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

export default class PrintService {
  public static print(payload: {headers: object; printlist: [object]}) {
    const urls: Environment = getEnvironment();
    return Request.post(
      `${urls.orchestrationURL}/print/price-sign`,
      payload.printlist,
      { headers: payload.headers }
    );
  }
}
