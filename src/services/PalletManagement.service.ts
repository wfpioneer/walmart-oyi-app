import { AxiosResponse } from 'axios';
import { PalletItem } from '../models/PalletManagementTypes';
import { Environment, getEnvironment } from '../utils/environment';
import Request from './Request';

export interface UpdateItemQuantityRequest {
  palletId: number
  palletItem: Pick<PalletItem, 'quantity' | 'upcNbr'>[]
}

export interface CombinePalletsRequest {
  targetPallet: number;
  combinePallets: number[];
}

export interface GetPalletInfoRequest {
  palletIds: number[],
  isAllItems?: boolean,
  isSummery?: boolean
}

export default class PalletManagementService {
  public static updateItemQuantity(payload: UpdateItemQuantityRequest): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.patch(`${urls.locationUrl}/pallet/${payload.palletId}/upc/qtys`, payload.palletItem);
  }

  public static combinePallets(payload: CombinePalletsRequest): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.put(`${urls.locationUrl}/pallet/${payload.targetPallet}/combine`, {
      palletIds: payload.combinePallets
    });
  }

  public static getPalletInfo(payload: GetPalletInfoRequest): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    const allItems = payload.isAllItems || false;
    const summeryDetails = payload.isSummery || false;
    return Request.get(`${urls.locationUrl}/pallet`, {
      palletIds: payload.palletIds.join(),
      allItems: allItems,
      summeryDetails: summeryDetails
    });
  }
}
