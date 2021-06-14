import { AxiosResponse } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';
import User from '../models/User';

export default class GetFluffyRolesService {
  public static getFluffyRoles(payload: User): Promise<AxiosResponse> {
    // This is to get Fluffy to correctly return features
    if (__DEV__) {
      payload.userId = 'istanse';
      payload.countryCode = 'US';
    }

    const urls: Environment = getEnvironment();
    return Request.get(
      `${urls.fluffyURL}/appFeaturesForUser/v2/Intl Oyi/${payload.userId}/${payload.countryCode}`,
      undefined
    );
  }
}
