import User from '../../models/User';
import {
  ASSIGN_FLUFFY_FEATURES,
  Actions,
  SET_CONFIGS,
  SET_USER_TOKENS,
  USER_LOGIN,
  USER_LOGOUT
} from '../actions/User';

export const initialState: User = {
  'bu-division': '',
  c: '',
  cn: '',
  co: '',
  codePage: '',
  company: '',
  countryCode: '',
  ctscSecurityAnswers: '',
  department: '',
  departmentNumber: '',
  description: '',
  displayName: '',
  displayNamePrintable: '',
  distinguishedName: '',
  division: '',
  domain: '',
  employeeID: '',
  employeeNumber: '',
  employeeType: '',
  extensionAttribute1: '',
  extensionAttribute2: '',
  extensionAttribute9: '',
  extensionAttribute10: '',
  extensionAttribute11: '',
  facsimileTelephoneNumber: '',
  givenName: '',
  initials: '',
  l: '',
  mail: '',
  manager: '',
  memberOf: [],
  name: '',
  postalCode: '',
  preferredLanguage: '',
  sAMAccountName: '',
  siteId: 0,
  sn: '',
  st: '',
  streetAddress: '',
  sub: '',
  targetAddress: '',
  telephoneNumber: '',
  title: '',
  userPrincipalName: '',
  'wm-AccountStatus': '',
  'wm-AlignDistrict': '',
  'wm-AlignDivision': '',
  'wm-AlignRegion': '',
  'wm-AlignSubDivision': '',
  'wm-BusinessUnitCategory': '',
  'wm-BusinessUnitNumber': '',
  'wm-BusinessUnitSubType': '',
  'wm-BusinessUnitType': '',
  'wm-ChargeBusinessUnitNumber': '',
  'wm-ChargeCountryCode': '',
  'wm-ChargeDivisionNumber': '',
  'wm-ChargeState': '',
  'wm-DistrictNumber': '',
  'wm-EmployeeNumber': '',
  'wm-EmploymentStatus': '',
  'wm-FriendlyJobcodes': '',
  'wm-FullTimePartTimeCode': '',
  'wm-FullTimePartTimeEffDate': '',
  'wm-HireDate': '',
  'wm-IdentificationNumber': '',
  'wm-JobCode': '',
  'wm-JobCodeEffectiveDate': '',
  'wm-ManagerEffectiveDate': '',
  'wm-ManagerEpplID': '',
  'wm-PositionCode': '',
  'wm-RegionNumber': '',
  'wm-ReportToPositionCode': '',
  'wm-RespBaseDivNbr': '',
  'wm-RespCountrCode': '',
  'wm-RespLevelCode': '',
  'wm-RespLevelId': '',
  'wm-StoreMgrRespCode': '',
  'wm-SubDivisionId': '',
  'wm-SystemJobcodes': '',
  'wm-Type': '',
  'wm-WorkShift': '',
  'wm-division': '',
  features: [],
  configs: {
    locationManagement: false,
    locationManagementEdit: false,
    palletManagement: false,
    settingsTool: false,
    printingUpdate: false,
    binning: false,
    palletExpiration: false,
    perishableCategories: '',
    picking: false,
    areas: [],
    enableAreaFilter: false,
    palletWorklists: false,
    createPallet: false,
    auditWorklists: false,
    showRollOverAudit: false,
    showOpenAuditLink: false,
    scanRequired: false,
    showCalculator: false,
    multiBin: false,
    multiPick: false,
    showItemImage: false,
    showFeedback: false,
    reserveAdjustment: false,
    manualNoAction: false,
    peteGetPallets: false,
    inProgress: false,
    peteGetLocations: false,
    showQuantityStocked: false,
    enableAuditsInProgress: false,
    enableAuditSave: false
  },
  userTokens: {
    accessToken: '',
    accessTokenExpirationDate: '',
    authorizationCode: '',
    authorizeAdditionalParameters: undefined,
    idToken: '',
    refreshToken: '',
    scopes: [],
    tokenAdditionalParameters: undefined,
    tokenType: ''
  },
  userId: ''
};

// eslint-disable-next-line default-param-last
export const UserReducer = (state = initialState, action: Actions): User => {
  switch (action.type) {
    case SET_USER_TOKENS:
      return {
        ...state,
        userTokens: action.payload
      };
    case USER_LOGIN:
      return {
        ...state,
        ...action.payload,
        features: [],
        configs: initialState.configs
      };
    case USER_LOGOUT:
      return initialState;
    case ASSIGN_FLUFFY_FEATURES:
      return {
        ...state,
        features: action.payload
      };
    case SET_CONFIGS:
      return {
        ...state,
        configs: {
          locationManagement: action.payload.locationManagement || false,
          locationManagementEdit: action.payload.locMgmtEdit || false,
          palletManagement: action.payload.palletManagement || false,
          settingsTool: action.payload.settingsTool || false,
          printingUpdate: action.payload.printingUpdate || false,
          binning: action.payload.binning || false,
          palletExpiration: action.payload.palletExpiration || false,
          perishableCategories: action.payload.perishableCatgs || '',
          picking: action.payload.picking || false,
          areas: action.payload.areas || [],
          enableAreaFilter: action.payload.enableAreaFilter || false,
          palletWorklists: action.payload.palletWorklists || false,
          createPallet: action.payload.createPallet || false,
          auditWorklists: action.payload.auditWorklists || false,
          showRollOverAudit: action.payload.showRollOverAudit || false,
          showOpenAuditLink: action.payload.showOpenAuditLink || false,
          scanRequired: action.payload.scanRequired || false,
          showCalculator: action.payload.showCalculator || false,
          multiBin: action.payload.multiBin || false,
          multiPick: action.payload.multiPick || false,
          showItemImage: action.payload.showItemImage || false,
          showFeedback: action.payload.showFeedback || false,
          reserveAdjustment: action.payload.reserveAdjustment || false,
          manualNoAction: action.payload.manualNoAction || false,
          peteGetPallets: action.payload.peteGetPallets || false,
          inProgress: action.payload.inProgress || false,
          peteGetLocations: action.payload.peteGetLocations || false,
          showQuantityStocked: action.payload.showQtyStocked || false,
          enableAuditsInProgress: action.payload.enableAuditsIP || false,
          enableAuditSave: action.payload.enableAuditSave || false
        }
      };
    default:
      return state;
  }
};
