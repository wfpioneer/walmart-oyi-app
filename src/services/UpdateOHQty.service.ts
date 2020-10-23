import Request from './Request';
import { getEnvironment, Environment } from "../utils/environment";

export default class UpdateOHQtyService {
  public static updateOHQty(payload: {headers: object; itemNumber: number; data: {onHandQty: number;};}) {
    const urls: Environment = getEnvironment();
    return Request.enqueue({
      url: `${urls.orchestrationURL}/item/${payload.itemNumber}/onhands`,
      method: 'put',
      headers: payload.headers,
      data: payload.data
    });
  }
}
