import { AxiosResponse } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';
import KEY from '../constant/Key';

interface tokenData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}
interface getItemCenterTokenResponse {
  code: string;
  message: string;
  data: tokenData | null;
  traceId: string;
}

export default class GetItemCenterToken {
  public static getItemCenterToken() : Promise<AxiosResponse<getItemCenterTokenResponse>> {
    const urls: Environment = getEnvironment();
    const tokenUrl = urls.itemCenterTokenURL;
    return Request.post(
      tokenUrl,
      {
        clientId: 'oyi',
        clientSecret: KEY.CN_ITEM_CENTER_TOKEN_SECRET
      }
    );
  }
}
