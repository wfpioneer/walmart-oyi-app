import { AxiosResponse } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';
import { PalletItem } from '../models/PalletItem';

export default class AddPalletService {
  public static addPallet(payload: {
    palletId: string;
    sectionId: number;
  }): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.put(
      `${urls.locationUrl}/pallet/${payload.palletId}/section`,
      {
        sectionId: payload.sectionId
      }
    );
  }

  public static addPalletUPCs(payload: {
    palletId: number;
    items: PalletItem[];
    expirationDate?: string;
  }): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.put(
      `${urls.locationUrl}/v1/pallet/${payload.palletId}/upcs`,
      payload.items,
      payload.expirationDate
        ? {
          headers: {
            expirationDate: payload.expirationDate
          }
        }
        : undefined
    );
  }
}
