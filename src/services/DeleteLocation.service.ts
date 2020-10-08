import Request from './Request';
import URLS from '../utils/environment';

export default class DeleteLocationService {
  public static deleteLocation(payload: {headers: object; upc: string; sectionId: string; locationTypeNbr: number}) {
    return Request.enqueue({
      url: `${URLS.orchestrationURL}/item/${payload.upc}/location/${payload.sectionId}/${payload.locationTypeNbr}`,
      method: 'delete',
      data: {
      },
      timeout: 10000,
      headers: payload.headers
    });
  }
}
