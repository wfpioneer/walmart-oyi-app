import { AxiosResponse } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

export default class DeletePalletService {
  public static removePallet(payload: {palletId: number}): Promise<AxiosResponse> {
    const urls: Environment = getEnvironment();
    return Request.delete(
      `${urls.locationUrl}/pallet/${payload.palletId}/section`, undefined
    );
  }

  public static deletePallet(payload: {palletId: number}): Promise<AxiosResponse> {
    const urls: Environment = getEnvironment();
    return Request.delete(
      `${urls.locationUrl}/v1/pallet/${payload.palletId}`
    );
  }
}
