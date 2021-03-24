import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

export default class UpdateOHQtyService {
  public static updateOHQty(payload: {headers: object; itemNumber: number; data: {onHandQty: number}}) {
    const urls: Environment = getEnvironment();
    return Request.put(
      `${urls.orchestrationURL}/item/${payload.itemNumber}/onhands`,
      payload.data,
      { headers: payload.headers }
    );
  }
}
