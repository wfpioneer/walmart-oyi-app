import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';
import { PickAction } from '../models/Picking.d';

export interface CreatePickRequest {
  itemNbr: number;
  upcNbr: string;
  itemDesc: string;
  category: string
  salesFloorLocationId?: number;
  salesFloorLocationName: string;
  moveToFront?: boolean;
  numberOfPallets?: number;
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
    }[];
    palletId: string;
  }) {
    const urls: Environment = getEnvironment();
    const { palletId, picklistItems, headers } = payload;
    return Request.patch(
      `${urls.locationUrl}/picklist/${palletId}/update`,
      { picklistItems },
      { headers }
    );
  }

  public static createNewPick(payload: CreatePickRequest) {
    const urls: Environment = getEnvironment();

    return Request.post(
      `${urls.locationUrl}/picklist`,
      payload
    );
  }
}
