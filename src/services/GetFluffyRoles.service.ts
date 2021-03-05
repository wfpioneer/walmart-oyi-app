import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

export default class GetFluffyRolesService {
    public static getFluffyRoles() {
      const urls: Environment = getEnvironment();
      return Request.enqueue({
        url: `${urls.fluffyURL}`,
        method: 'get',
        data: {}
      });
    }
  }