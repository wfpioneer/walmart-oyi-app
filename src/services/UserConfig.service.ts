import { AxiosResponse } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

export interface UserConfigResponse {
    userId: string;
    clubNbr: number;
    countryCode: string;
    lastLogin: string;
    loginCount: number;
}

export default class ConfigService {
  public static getUserConfig(): Promise<AxiosResponse<UserConfigResponse>> {
    const urls: Environment = getEnvironment();
    return Request.get(
      `${urls.configUrl}/user-config`
    );
  }

  public static updateUserConfig(): Promise<AxiosResponse<UserConfigResponse>> {
    const urls: Environment = getEnvironment();
    return Request.put(
      `${urls.configUrl}/user-config`
    );
  }
}
