import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

export default class DeletePalletService {
  public static deletePallet(payload: {palletId: string;}) {
    const urls: Environment = getEnvironment();
    return Request.delete(
      `${urls.locationUrl}/pallet/${payload.palletId}/section`, undefined
    );
  }
}
