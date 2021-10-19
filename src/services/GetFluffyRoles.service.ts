import { AxiosResponse } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';
import User from '../models/User';

export default class GetFluffyRolesService {
  public static getFluffyRoles(payload: User): Promise<AxiosResponse> {
    let { userId, countryCode, siteId: clubNbr } = payload;

    if (__DEV__) {
      // This is to get Fluffy to correctly return features
      userId = 'n0e00s9';
      countryCode = 'US';
      clubNbr = 1;
    } else if (countryCode === 'MX' && clubNbr === 5522) {
      // This is to allow feature toggle for UAT for MX (unless Fluffy allows test clubs to be configured)
      clubNbr = 4879;

      if (userId.includes('SVC')) {
        // Set to Gonzalo's userId in case our MX service account is used, due to Fluffy not allowing underscores
        userId = 'g0a01r7';
      }
    } else if (countryCode === 'CN' && clubNbr === 5597) {
      // This is to allow feature toggle for UAT for CN (unless Fluffy allows test clubs to be configured)
      clubNbr = 4830;

      if (userId.includes('SVC')) {
        // Set to Eileen's userId in case our CN service account is used, due to Fluffy not allowing underscores
        userId = 'eyu7';
      }
    }

    const urls: Environment = getEnvironment();
    return Request.get(
      `${urls.fluffyURL}/featuresForStoreAndAuth/v2/Intl Oyi/${userId}/${countryCode}/${clubNbr}`,
      undefined
    );
  }
}
