import { AxiosResponse } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

export default class DeletePalletService {
  // TODO rename service and redux actions as this only Removes a pallet from a section, not delete
  public static deletePallet(payload: {palletId: number}): Promise<AxiosResponse> {
    const urls: Environment = getEnvironment();
    return Request.delete(
      `${urls.locationUrl}/pallet/${payload.palletId}/section`, undefined
    );
  }

  // Removes all items and locations from Pallet, then deletes that pallet. Could rename to deletePallet
  public static clearPallet(payload: {palletId: number}): Promise<AxiosResponse> {
    const urls: Environment = getEnvironment();
    return Request.delete(
      `${urls.locationUrl}/v1/pallet/${payload.palletId}`
    );
  }
}
