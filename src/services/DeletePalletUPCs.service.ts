import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

export default class DeletePalletUPCsService {
  public static deletePalletUPCs(payload: {
    palletId: number;
    upcs: string[],
    expirationDate?: string,
    removeExpirationDate: boolean
  }) {
    const upcsUrlParam = payload.upcs.reduce((reducer, current, index, array) => {
      if (index !== array.length - 1) {
        // TODO: eslint issue is not easily resolvable and we many need tech debt story to fix this issue.
        return reducer += `upcs=${current}&`;
      }
      return reducer += `upcs=${current}`;
    }, '');
    const urls: Environment = getEnvironment();
    return Request.delete(
      `${urls.locationUrl}/pallet/${payload.palletId}/upc?${upcsUrlParam}`, {
        removeExpirationDate: payload.removeExpirationDate,
        expirationDate: payload.expirationDate
      }
    );
  }
}
