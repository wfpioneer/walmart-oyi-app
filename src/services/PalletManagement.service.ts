import { AxiosResponse } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

export default class PalletManagementService {
  public static getPalletUpcs(payload: {palletId: number}): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.get(
      `${urls.locationUrl}/pallet/${payload.palletId}`
    );
  }
}
