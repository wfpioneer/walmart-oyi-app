import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

export default class GetLocationDetailsService {
  public static getLocation(payload: {headers: object; itemNbr: number}) {
    const urls: Environment = getEnvironment();
    return Request.enqueue({
      url: `${urls.orchestrationURL}/location/item/${payload.itemNbr}`,
      method: 'get',
      data: {},
      headers: payload.headers
    });
  }
}
