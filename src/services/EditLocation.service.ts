import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

export default class EditLocationService {
  public static editLocation(payload: {headers: object; upc: string; sectionId: string; newSectionId: string;
    locationTypeNbr: number; newLocationTypeNbr: number;}) {
    const urls: Environment = getEnvironment();
    return Request.enqueue({
      url: `${urls.orchestrationURL}/item/${payload.upc}/location/${payload.sectionId}/${payload.locationTypeNbr}`,
      method: 'put',
      data: {
        sectionId: payload.newSectionId,
        locationTypeNbr: payload.newLocationTypeNbr
      },
      headers: payload.headers
    });
  }
}
