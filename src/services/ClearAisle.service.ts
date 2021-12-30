import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

export default class ClearAisleService {
  public static clearAisle(payload: {aisleId: string, clearTarget: string;}) {
    const urls: Environment = getEnvironment();
    return Request.delete(
      `${urls.locationUrl}/location/${payload.aisleId}/${payload.clearTarget}`, undefined
    );
  }
}
