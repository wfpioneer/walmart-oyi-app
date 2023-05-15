import User from '../../models/User';
import {
  ASSIGN_FLUFFY_FEATURES,
  Actions,
  SET_CONFIGS,
  USER_LOGIN,
  USER_LOGOUT
} from '../actions/User';

export const initialState: User = {
  additional: {
    clockCheckResult: '',
    displayName: '',
    loginId: '',
    mailId: ''
  },
  countryCode: '',
  domain: '',
  siteId: 0,
  token: '',
  userId: '',
  features: [],
  configs: {
    locationManagement: false,
    locationManagementEdit: false,
    palletManagement: false,
    settingsTool: false,
    printingUpdate: false,
    binning: false,
    palletExpiration: false,
    backupCategories: '',
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
    overridePalletPerishables: false
  }
};

export const UserReducer = (state = initialState, action: Actions): User => {
  switch (action.type) {
    case USER_LOGIN:
      return {
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
          backupCategories: action.payload.backupCategories,
          picking: action.payload.picking,
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
          overridePalletPerishables: action.payload.overridePltPerish || false
        }
      };
    default:
      return state;
  }
};
