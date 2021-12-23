import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

export default class DeleteAisleService {
  public static deleteAisle(payload: {aisleId: string;}) {
    const urls: Environment = getEnvironment();
    return Request.delete(
      `${urls.locationUrl}/aisle/${payload.aisleId}`, undefined
    );
  }
}
