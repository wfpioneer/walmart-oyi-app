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
  palletWorklists: boolean;
  createPallet: boolean;
  auditWorklists: boolean;
  showRollOverAudit: boolean;
  showOpenAuditLink: boolean;
  scanRequired: boolean;
  showCalculator: boolean;
  multiPick: boolean;
  multiBin: boolean;
  showItemImage: boolean;
  showFeedback: boolean;
  reserveAdjustment: boolean;
  manualNoAction: boolean;
  peteGetPallets: boolean;
  inProgress: boolean;
  overridePltPerish: boolean;
  peteGetLocations: boolean;
  showQtyStocked: boolean;
  enableAuditsIP: boolean;
  enableAuditSave: boolean;
}

export default class ConfigService {
  public static getConfigByClub(): Promise<AxiosResponse<ConfigResponse>> {
    const urls: Environment = getEnvironment();
    return Request.get(
      `${urls.configUrl}/config/club`
    );
  }
}
