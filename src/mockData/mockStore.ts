import { RootState } from '../state/reducers/RootReducer';
import { initialState as initialApprovalsState } from '../state/reducers/Approvals';
import { initialState as initialAuditItemState } from '../state/reducers/AuditItemScreen';
import { initialState as initialAuditWorklistState } from '../state/reducers/AuditWorklist';
import { initialState as initialBinningState } from '../state/reducers/Binning';
import { initialState as initialGlobalState } from '../state/reducers/Global';
import { initialState as initialItemDetailsState } from '../state/reducers/ItemDetailScreen';
import { initialState as initialItemHistoryState } from '../state/reducers/ItemHistory';
import { initialState as initialLocationState } from '../state/reducers/Location';
import { initialState as initialModalState } from '../state/reducers/Modal';
import { initialState as initialPalletManagementState } from '../state/reducers/PalletManagement';
import { initialState as initialPalletWorklistState } from '../state/reducers/PalletWorklist';
import { initialState as initialPickingState } from '../state/reducers/Picking';
import { initialState as initialPrintState } from '../state/reducers/Print';
import { initialState as initialReserveAdjustmentState } from '../state/reducers/ReserveAdjustmentScreen';
import { initialState as initialSnackbarState } from '../state/reducers/SnackBar';
import { initialState as initialUserState } from '../state/reducers/User';
import { initialState as initialWorklistState } from '../state/reducers/Worklist';
import { AsyncState } from '../models/AsyncState';

export const defaultAsyncState: AsyncState = {
  error: null,
  isWaiting: false,
  result: null,
  value: null
};
export const mockInitialState: RootState = {
  Approvals: {
    ...initialApprovalsState
  },
  AuditItemScreen: { ...initialAuditItemState },
  AuditWorklist: { ...initialAuditWorklistState },
  Binning: { ...initialBinningState },
  Global: { ...initialGlobalState },
  ItemDetailScreen: { ...initialItemDetailsState },
  ItemHistory: { ...initialItemHistoryState },
  Location: { ...initialLocationState },
  modal: { ...initialModalState },
  PalletManagement: { ...initialPalletManagementState },
  PalletWorklist: { ...initialPalletWorklistState },
  Picking: { ...initialPickingState },
  Print: { ...initialPrintState },
  ReserveAdjustmentScreen: { ...initialReserveAdjustmentState },
  SessionTimeout: null,
  SnackBar: { ...initialSnackbarState },
  User: { ...initialUserState },
  Worklist: { ...initialWorklistState },
  async: {
    addLocation: { ...defaultAsyncState },
    addPallet: { ...defaultAsyncState },
    addPalletUPCs: { ...defaultAsyncState },
    binPallets: { ...defaultAsyncState },
    clearLocation: { ...defaultAsyncState },
    clearPallet: { ...defaultAsyncState },
    combinePallets: { ...defaultAsyncState },
    createNewPick: { ...defaultAsyncState },
    createNewPickV1: { ...defaultAsyncState },
    createSections: { ...defaultAsyncState },
    deleteAisle: { ...defaultAsyncState },
    deleteLocation: { ...defaultAsyncState },
    deletePallet: { ...defaultAsyncState },
    deleteUpcs: { ...defaultAsyncState },
    deleteZone: { ...defaultAsyncState },
    editLocation: { ...defaultAsyncState },
    getAisle: { ...defaultAsyncState },
    getAllZones: { ...defaultAsyncState },
    getApprovalList: { ...defaultAsyncState },
    getAuditLocations: { ...defaultAsyncState },
    getClubConfig: { ...defaultAsyncState },
    getFluffyRoles: { ...defaultAsyncState },
    getItemDetailsUPC: { ...defaultAsyncState },
    getItemDetailsV4: { ...defaultAsyncState },
    getItemManagerApprovalHistory: { ...defaultAsyncState },
    getItemPallets: { ...defaultAsyncState },
    getItemPalletsV1: { ...defaultAsyncState },
    getItemPicklistHistory: { ...defaultAsyncState },
    getItemPiHistory: { ...defaultAsyncState },
    getItemPiSalesHistory: { ...defaultAsyncState },
    getLocationsForItem: { ...defaultAsyncState },
    getLocationsForItemV1: { ...defaultAsyncState },
    getPalletConfig: { ...defaultAsyncState },
    getPalletDetails: { ...defaultAsyncState },
    getPalletWorklist: { ...defaultAsyncState },
    getPicklists: { ...defaultAsyncState },
    getSectionDetails: { ...defaultAsyncState },
    getSections: { ...defaultAsyncState },
    getUserConfig: { ...defaultAsyncState },
    getWorklist: { ...defaultAsyncState },
    getWorklistAudits: { ...defaultAsyncState },
    getWorklistAuditsV1: { ...defaultAsyncState },
    getWorklistSummary: { ...defaultAsyncState },
    getWorklistSummaryV2: { ...defaultAsyncState },
    getWorklistV1: { ...defaultAsyncState },
    getZoneNames: { ...defaultAsyncState },
    hitGoogle: { ...defaultAsyncState },
    noAction: { ...defaultAsyncState },
    postCreateAisles: { ...defaultAsyncState },
    postCreatePallet: { ...defaultAsyncState },
    postCreateZone: { ...defaultAsyncState },
    printLocationLabels: { ...defaultAsyncState },
    printPalletLabel: { ...defaultAsyncState },
    printSign: { ...defaultAsyncState },
    removeSection: { ...defaultAsyncState },
    reportMissingPallet: { ...defaultAsyncState },
    saveAuditsProgress: { ...defaultAsyncState },
    submitFeedbackRating: { ...defaultAsyncState },
    updateApprovalList: { ...defaultAsyncState },
    updateMultiPalletUPCQty: { ...defaultAsyncState },
    updateMultiPalletUPCQtyV2: { ...defaultAsyncState },
    updateOHQty: { ...defaultAsyncState },
    updateOHQtyV1: { ...defaultAsyncState },
    updatePalletItemQty: { ...defaultAsyncState },
    updatePalletNotFound: { ...defaultAsyncState },
    updatePicklistStatus: { ...defaultAsyncState },
    updatePicklistStatusV1: { ...defaultAsyncState },
    updateUserConfig: { ...defaultAsyncState }
  }
};
