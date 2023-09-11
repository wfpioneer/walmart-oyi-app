import { AxiosResponse } from 'axios';
import { PalletItem } from '../models/PalletManagementTypes';
import { Environment, getEnvironment } from '../utils/environment';
import Request from './Request';

export interface UpdateItemQuantityRequest {
  palletId: string;
  palletItem: Pick<PalletItem, 'quantity' | 'upcNbr'>[];
  palletExpiration?: string;
}

export interface CombinePalletsRequest {
  targetPallet: string;
  combinePallets: string[];
}

export interface GetPalletDetailsRequest {
  palletIds: string[],
  isAllItems?: boolean,
  isSummary?: boolean
}

export interface PostBinPalletsRequest {
  location: number | string;
  pallets: string[];
}

export interface PostBinPalletsMultistatusResponse {
  binSummary: {
    palletId: string;
    status: number;
  }[];
}

export interface GetPalletConfigResponse {
  perishableCategories: number[];
}

export interface UpdateMultiPalletUPCQtyRequest {
  itemNbr?: number;
  PalletList: UpdateMultiPalletsPallet[];
}

export interface UpdateMultiPalletsPallet {
  palletId: number;
  expirationDate: string;
  upcs: Pick<PalletItem, 'quantity' | 'upcNbr'>[];
}

export default class PalletManagementService {
  public static updateItemQuantity(payload: UpdateItemQuantityRequest): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.patch(
      `${urls.locationUrl}/v1/pallet/${payload.palletId}/upc/qty`,
      {
        upcs: payload.palletItem,
        expirationDate: payload.palletExpiration
      }
    );
  }

  public static combinePallets(payload: CombinePalletsRequest): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.put(`${urls.locationUrl}/pallet/${payload.targetPallet}/combine`, {
      palletIds: payload.combinePallets
    });
  }

  public static getPalletDetails(payload: GetPalletDetailsRequest): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    const allItems = payload.isAllItems || false;
    const summaryDetails = payload.isSummary || false;
    const TIMEOUT = 30000;

    return Request.get(
      `${urls.locationUrl}/pallet`,
      {
        palletIds: payload.palletIds.join(),
        allItems,
        summaryDetails
      },
      { timeout: TIMEOUT }
    );
  }

  public static postBinPallets(payload: PostBinPalletsRequest): Promise<
    AxiosResponse<unknown | PostBinPalletsMultistatusResponse>
  > {
    const urls: Environment = getEnvironment();
    return Request.post(
      `${urls.orchestrationURL}/bin`,
      payload
    );
  }

  public static getPalletConfig(): Promise<AxiosResponse<GetPalletConfigResponse>> {
    const urls: Environment = getEnvironment();
    return Request.get(
      `${urls.locationUrl}/pallet/pallet-config`
    );
  }

  public static updateMultiPalletUPCQty(payload: UpdateMultiPalletUPCQtyRequest): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();

    return Request.patch(
      `${urls.locationUrl}/pallet/upc`,
      payload.PalletList,
      { timeout: 30000 }
    );
  }

  public static updateMultiPalletUPCQtyV2(payload: UpdateMultiPalletUPCQtyRequest): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();

    return Request.patch(
      `${urls.orchestrationURL}/pallet/upc`,
      { itemNbr: payload.itemNbr, updatePalletsDTO: payload.PalletList },
      { timeout: 30000 }
    );
  }
}
