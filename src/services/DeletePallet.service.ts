import { AxiosResponse } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

export default class DeletePalletService {
  public static deletePalletFromSection(payload: {palletId: string}): Promise<AxiosResponse> {
    const urls: Environment = getEnvironment();
    return Request.delete(
      `${urls.locationUrl}/pallet/${payload.palletId}/section`,
      undefined
    );
  }

  // Removes all items and locations from Pallet, then deletes that pallet.
  public static clearPallet(payload: {palletId: string}): Promise<AxiosResponse> {
    const urls: Environment = getEnvironment();
    return Request.delete(
      `${urls.orchestrationURL}/pallet/${payload.palletId}`
    );
  }
}
