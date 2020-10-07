import Request from './Request';
import URLS from '../utils/environment';

export default class AddLocationService {
  public static addLocation(payload: {headers: object; upc: string; sectionId: string; locationTypeNbr: number}) {
    return Request.enqueue({
      url: `${URLS.locationURL}/item/${payload.upc}/location/`,
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
