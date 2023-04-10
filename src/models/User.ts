/* eslint semi: 0 */
export default interface User {
  userId: string;
  token: string;
  countryCode: string;
  domain: string;
  siteId: number;
  additional: {
    displayName: string;
    clockCheckResult: string;
    loginId: string;
    mailId: string;
  };
  features: string[],
  configs: Configurations
}

export interface Configurations {
  locationManagement: boolean;
  locationManagementEdit: boolean;
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
  otherActions: boolean;
}

export interface area {
  area: string;
  categories: number[];
}

export const AVAILABLE_TOOLS = ['location management', 'pallet management', 'picking', 'binning', 'settings tool'];
