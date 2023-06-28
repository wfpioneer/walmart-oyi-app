/* eslint semi: 0 */
import { AuthorizeResult } from 'react-native-app-auth';

export default interface User {
  'bu-division': string;
  c: string;
  cn: string;
  co: string;
  codePage: string;
  company: string;
  configs: Configurations;
  countryCode: string;
  ctscSecurityAnswers: string;
  department: string;
  departmentNumber: string;
  description: string;
  displayName: string;
  displayNamePrintable: string;
  distinguishedName: string;
  division: string;
  domain: string;
  employeeID: string;
  employeeNumber: string;
  employeeType: 'H' | 'S' | '';
  extensionAttribute1: string;
  extensionAttribute2: string;
  extensionAttribute9: string;
  extensionAttribute10: string;
  extensionAttribute11: string;
  facsimileTelephoneNumber: string;
  givenName: string;
  initials: string;
  l: string;
  mail: string;
  manager: string;
  memberOf: string[];
  name: string;
  postalCode: string;
  preferredLanguage: string;
  sAMAccountName: string;
  siteId: number;
  sn: string;
  st: string;
  streetAddress: string;
  sub: string;
  targetAddress: string;
  telephoneNumber: string;
  title: string;
  userPrincipalName: string;
  'wm-AccountStatus': string;
  'wm-AlignDistrict': string;
  'wm-AlignDivision': string;
  'wm-AlignRegion': string;
  'wm-AlignSubDivision': string;
  'wm-BusinessUnitCategory': string;
  'wm-BusinessUnitNumber': string;
  'wm-BusinessUnitSubType': string;
  'wm-BusinessUnitType': 'HO' | 'ST' | 'CL' | 'DC' | '';
  'wm-ChargeBusinessUnitNumber': string;
  'wm-ChargeCountryCode': string;
  'wm-ChargeDivisionNumber': string;
  'wm-ChargeState': string;
  'wm-DistrictNumber': string;
  'wm-EmployeeNumber': string;
  'wm-EmploymentStatus': string;
  'wm-FriendlyJobcodes': string;
  'wm-FullTimePartTimeCode': string;
  'wm-FullTimePartTimeEffDate': string;
  'wm-HireDate': string;
  'wm-IdentificationNumber': string;
  'wm-JobCode': string;
  'wm-JobCodeEffectiveDate': string;
  'wm-ManagerEffectiveDate': string;
  'wm-ManagerEpplID': string;
  'wm-PositionCode': string;
  'wm-RegionNumber': string;
  'wm-ReportToPositionCode': string;
  'wm-RespBaseDivNbr': string;
  'wm-RespCountrCode': string;
  'wm-RespLevelCode': string;
  'wm-RespLevelId': string;
  'wm-StoreMgrRespCode': string;
  'wm-SubDivisionId': string;
  'wm-SystemJobcodes': string;
  'wm-Type': string;
  'wm-WorkShift': string;
  'wm-division': string;
  features: string[],
  userTokens: AuthorizeResult;
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
  peteGetPallets: boolean;
  inProgress: boolean;
  overridePalletPerishables: boolean;
  peteGetLocations: boolean;
}

export interface area {
  area: string;
  categories: number[];
}

export const AVAILABLE_TOOLS = ['location management', 'pallet management', 'picking', 'binning', 'settings tool'];
