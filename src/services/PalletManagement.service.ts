import { AxiosResponse } from 'axios';
import { Environment, getEnvironment } from '../utils/environment';
import Request from './Request';

export interface UpdateItemQuantityRequest {
  upc: string;
  quantity: number;
  palletId: number;
}

export default class PalletManagementService {
  public static updateItemQuantity(payload: UpdateItemQuantityRequest): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.patch(`${urls.locationUrl}/pallet/${payload.palletId}/upc/qty`, {
      upcNbr: payload.upc,
      quantity: payload.quantity
    });
  }
}
