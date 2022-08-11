import { AxiosResponse } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';
import { CreatePallet, CreatePalletResponse } from '../models/PalletManagementTypes';

export default class CreatePalletService {
  public static createPallet(payload: CreatePallet): Promise<AxiosResponse<Array<CreatePalletResponse>>> {
    const urls: Environment = getEnvironment();
    return Request.post(
      `${urls.locationUrl}/v1/pallet/v2/pallet`,
      payload
    );
  }
}
