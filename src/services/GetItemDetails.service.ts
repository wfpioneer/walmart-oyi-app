import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

export default class GetItemDetailsService {
  public static getItemDetails(payload: {headers: object; id: number}) {
    const urls: Environment = getEnvironment();
    return Request.get(
      `${urls.itemDetailsURL}/item/${payload.id}`,
      undefined,
      { headers: payload.headers }
    );
  }
}
