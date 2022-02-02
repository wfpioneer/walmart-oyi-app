import { AxiosResponse } from 'axios';
import { Environment, getEnvironment } from '../utils/environment';
import Request from './Request';

export interface UpdateItemQuantityRequest {
  upc: string;
  quantity: number;
  palletId: number;
}

export interface CombinePalletsRequest {
  targetPallet: number;
  combinePallets: number[];
}

export default class PalletManagementService {
  public static updateItemQuantity(payload: UpdateItemQuantityRequest): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.patch(`${urls.locationUrl}/pallet/${payload.palletId}/upc/qty`, {
      upcNbr: payload.upc,
      quantity: payload.quantity
    });
  }

  public static combinePallets(payload: CombinePalletsRequest): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.put(`${urls.locationUrl}/pallet/${payload.targetPallet}/combine`, {
      palletIds: payload.combinePallets
    });
  }
}
