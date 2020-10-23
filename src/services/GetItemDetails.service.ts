import Request from './Request';
import { getEnvironment, Environment } from "../utils/environment";

export default class GetItemDetailsService {
  public static getItemDetails(payload: {headers: object; id: number}) {
    const urls: Environment = getEnvironment();
    return Request.enqueue({
      url: `${urls.itemDetailsURL}/item/${payload.id}`,
      method: 'get',
      headers: payload.headers
    });
  }
}
