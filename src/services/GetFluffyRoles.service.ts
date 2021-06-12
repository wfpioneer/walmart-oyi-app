import { AxiosResponse } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';
import User from '../models/User';

export default class GetFluffyRolesService {
  public static getFluffyRoles(payload: User): Promise<AxiosResponse> {
    let { userId, countryCode, siteId: clubNbr } = payload;

    // This is to get Fluffy to correctly return features
    if (__DEV__) {
      userId = 'istanse';
      countryCode = 'US';
      clubNbr = 1;
    }

    const urls: Environment = getEnvironment();
    return Request.get(
      `${urls.fluffyURL}/featuresForStoreAndAuth/v2/Intl Oyi/${userId}/${countryCode}/${clubNbr}`,
      undefined
    );
  }
}
