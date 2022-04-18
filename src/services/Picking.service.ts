import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

export default class PickingService {
  public static getPickListService() {
    const urls: Environment = getEnvironment();

    return Request.get(`${urls.locationUrl}/picklist`);
  }
}
