import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';
import { PickAction } from '../models/Picking.d';

export interface CreatePickRequest {
  itemNbr: number;
  upcNbr: string;
  itemDesc: string;
  category: number;
  salesFloorLocationId?: number;
  salesFloorLocationName?: string;
  moveToFront?: boolean;
  numberOfPallets: number;
  quickPick: boolean;
}

export default class PickingService {
  public static getPickListService() {
    const urls: Environment = getEnvironment();

    return Request.get(`${urls.locationUrl}/picklist`);
  }

  public static updatePickListStatus(payload: {
    headers: { action: PickAction };
    picklistItems: {
      picklistId: number;
      locationId: number;
      locationName: string;
      itemQty?: number;
      palletId: number;
    }[];
  }) {
    const urls: Environment = getEnvironment();
    const { picklistItems, headers } = payload;
    return Request.patch(
      `${urls.locationUrl}/picklist/update`,
      { picklistItems },
      { headers }
    );
  }

  public static updatePickListStatusV1(payload: {
    headers: { action: PickAction };
    picklistItems: {
      picklistId: number;
      locationId: number;
      locationName: string;
      itemQty?: number;
      palletId: number;
    }[];
  }) {
    const urls: Environment = getEnvironment();
    const { picklistItems, headers } = payload;
    return Request.patch(
      `${urls.orchestrationURL}/picklists`,
      { picklistItems },
      { headers }
    );
  }

  public static updatePalletNotFound(payload: {
    palletId: string;
    picklistIds: number[];
  }) {
    const urls: Environment = getEnvironment();
    const { palletId, picklistIds } = payload;
    return Request.put(
      `${urls.locationUrl}/picklist/${palletId}/palletnotfound`,
      { picklistIds },
    );
  }

  public static createNewPick(payload: CreatePickRequest) {
    const urls: Environment = getEnvironment();
    const TIMEOUT = 30000;
    return Request.post(
      `${urls.orchestrationURL}/v1/picklist`,
      payload,
      { timeout: TIMEOUT }
    );
  }
}
