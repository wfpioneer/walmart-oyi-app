import { AxiosResponse } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';

export default class ReportMissingPalletService {
  public static reportMissingPallet(payload: {
    palletId: string;
    locationName: string;
    sectionId: number;
  }): Promise<AxiosResponse<unknown>> {
    const urls: Environment = getEnvironment();
    return Request.put(
      `${urls.worklistURL}/worklist/pallet/${payload.palletId}/missingpallet`,
      {
        locationName: payload.locationName,
        sectionId: payload.sectionId
      }
    );
  }
}
