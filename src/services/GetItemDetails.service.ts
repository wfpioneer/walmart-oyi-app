import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

const TIMEOUT = 15000; // ms

export default class GetItemDetailsService {
  public static getItemDetails(payload: {headers: object; id: number}) {
    const urls: Environment = getEnvironment();
    return Request.get(
      `${urls.itemDetailsURL}/v2/item/${payload.id}`,
      undefined,
      { headers: payload.headers, timeout: TIMEOUT }
    );
  }
}
