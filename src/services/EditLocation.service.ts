import Request from './Request';
import URLS from '../utils/environment';

export default class EditLocationService {
  public static editLocation(payload: {headers: object; upc: string; sectionId: string; newSectionId: string;
    locationTypeNbr: number; newLocationTypeNbr: number;}) {
    return Request.enqueue({
      url: `${URLS.orchestrationURL}/item/${payload.upc}/location/${payload.sectionId}/${payload.locationTypeNbr}`,
      method: 'put',
      data: {
        sectionId: payload.newSectionId,
        locationTypeNbr: payload.newLocationTypeNbr
      },
      timeout: 10000,
      headers: payload.headers
    });
  }
}
