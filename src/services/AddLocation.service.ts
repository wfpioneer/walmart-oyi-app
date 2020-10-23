import Request from './Request';
import { getEnvironment, Environment } from "../utils/environment";

export default class AddLocationService {
  public static addLocation(payload: {headers: object; upc: string; sectionId: string; locationTypeNbr: number}) {
    const urls: Environment = getEnvironment();
    return Request.enqueue({
      url: `${urls.orchestrationURL}/item/${payload.upc}/location/`,
      method: 'post',
      data: {
        sectionId: payload.sectionId,
        locationTypeNbr: payload.locationTypeNbr
      },
      timeout: 10000,
      headers: payload.headers
    });
  }
}
