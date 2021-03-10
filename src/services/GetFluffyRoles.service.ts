import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';
import User from '../models/User';

export default class GetFluffyRolesService {
    public static getFluffyRoles(payload: User) {
      const urls: Environment = getEnvironment();
      return Request.enqueue({
        url: `${urls.fluffyURL}/appFeaturesForUser/v2/Intl Oyi/${payload.userId}/${payload.countryCode}`,
        method: 'get',
        data: {}
      });
    }
  }