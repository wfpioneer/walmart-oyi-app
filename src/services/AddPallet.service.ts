import { AxiosResponse } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';
import { PalletItem } from '../models/PalletManagementTypes';

export default class AddPalletService {
  public static addPallet(payload: {
    palletId: string;
    sectionId?: number;
    locationName?: string;
  }): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.put(
      `${urls.orchestrationURL}/pallet/${payload.palletId}/section`,
      {
        sectionId: payload.sectionId,
        locationName: payload.locationName
      }
    );
  }

  public static addPalletUPCs(payload: {
    palletId: string;
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
