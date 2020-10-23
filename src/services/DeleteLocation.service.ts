import Request from './Request';
import { getEnvironment, Environment } from '../utils/environment';

export default class DeleteLocationService {
  public static deleteLocation(payload: {headers: object; upc: string; sectionId: string; locationTypeNbr: number}) {
    const urls: Environment = getEnvironment();
    return Request.enqueue({
      url: `${urls.orchestrationURL}/item/${payload.upc}/location/${payload.sectionId}/${payload.locationTypeNbr}`,
      method: 'delete',
      data: {
      },
      headers: payload.headers
    });
  }
}
