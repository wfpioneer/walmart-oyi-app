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

  // Removes a pallet from an item or multiple items
  public static deletePalletUPCs(payload: {
    palletId: string;
    upcs: string[],
    expirationDate?: string,
    removeExpirationDate: boolean
  }) {
    const upcsUrlParam = payload.upcs.reduce((reducer, current, index, array) => {
      if (index !== array.length - 1) {
        // TODO: eslint issue is not easily resolvable and we many need tech debt story to fix this issue.
        return reducer.concat(`upcs=${current}&`);
      }
      return reducer.concat(`upcs=${current}`);
    }, '');
    const urls: Environment = getEnvironment();
    return Request.delete(
      `${urls.locationUrl}/pallet/${payload.palletId}/upc?${upcsUrlParam}`,
      {
        removeExpirationDate: payload.removeExpirationDate,
        expirationDate: payload.expirationDate
      }
    );
  }

  // New EndPoint to Update the PickList Status of a Bad Pallet to DELETE
  public static deleteBadPallet(payload: {palletId: string}) {
    const urls: Environment = getEnvironment();
    return Request.delete(
      `${urls.locationUrl}/picklist/pallet/${payload.palletId}`
    );
  }
}
