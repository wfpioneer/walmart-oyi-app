import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

export default class AddPalletService {
  public static addPallet(payload: {palletId: string; sectionId: string;}) {
    const urls: Environment = getEnvironment();
    return Request.put(
      `${urls.locationUrl}/pallet/${payload.palletId}/section`,
      {
        sectionId: payload.sectionId
      }
    );
  }
}
