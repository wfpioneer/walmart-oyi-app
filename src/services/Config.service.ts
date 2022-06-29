import { AxiosResponse } from 'axios';
import Request from './Request';
import { Environment, getEnvironment } from '../utils/environment';
import { area } from '../models/User';

export interface ConfigResponse {
  locationManagement: boolean;
  locMgmtEdit: boolean;
  palletManagement: boolean;
  settingsTool: boolean;
  printingUpdate: boolean;
  binning: boolean;
  palletExpiration: boolean;
  backupCategories: string;
  picking: boolean;
  areas: area[];
  enableAreaFilter: boolean;
  enableMpWorklist: boolean;
}

export default class ConfigService {
  public static getConfigByClub(): Promise<AxiosResponse<ConfigResponse>> {
    const urls: Environment = getEnvironment();
    return Request.get(
      `${urls.configUrl}/config/club`
    );
  }
}
