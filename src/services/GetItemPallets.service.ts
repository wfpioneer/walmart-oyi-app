import { AxiosResponse } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';
import { GetItemPalletsResponse } from '../models/ItemPallets';

export default class GetItemPalletsService {
  public static getItemPallets(payload: {itemNbr: number}):
    Promise<AxiosResponse<Array<GetItemPalletsResponse>>> {
    const urls: Environment = getEnvironment();
    return Request.get(
      `${urls.locationUrl}/location/item/${payload.itemNbr}/pallets`
    );
  }
}
