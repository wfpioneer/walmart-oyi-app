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
}

export const AVAILABLE_TOOLS = ['location management', 'pallet management', 'picking', 'binning'];
