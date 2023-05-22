import { all, call } from 'redux-saga/effects';
import AddPalletService from '../../services/AddPallet.service';
import { makeAsyncSaga } from './generic/makeAsyncSaga';
import * as saga from '../actions/saga';
import * as actions from '../actions/asyncAPI';
import HitGoogleService from '../../services/HitGoogle.service';
import GetItemDetailsService from '../../services/GetItemDetails.service';
import GetWorklistService from '../../services/GetWorklist.service';
import GetPalletWorklistService from '../../services/GetPalletWorklist.service';
import EditLocationService from '../../services/EditLocation.service';
import UpdateOHQtyService from '../../services/UpdateOHQty.service';
import AddLocationService from '../../services/AddLocation.service';
import WorklistSummaryService from '../../services/WorklistSummary.service';
import DeleteLocationService from '../../services/DeleteLocation.service';
import NoActionService from '../../services/NoAction.service';
import PrintService from '../../services/Print.service';
import GetLocationDetailsService from '../../services/GetLocationDetails.service';
import GetFluffyRolesService from '../../services/GetFluffyRoles.service';
import GetApprovalListService from '../../services/GetApprovalList.service';
import UpdateApprovalListService from '../../services/UpdateApprovalList.service';
import LocationService from '../../services/Location.service';
import DeletePalletService from '../../services/DeletePallet.service';
import DeleteAisleService from '../../services/DeleteAisle.service';
import ConfigService from '../../services/Config.service';
import GetItemDetailsUPCService from '../../services/GetItemDetailsUPCService';
import PalletManagementService from '../../services/PalletManagement.service';
import CreatePalletService from '../../services/CreatePallet.service';
import DeletePalletUPCsService from '../../services/DeletePalletUPCs.service';
import PickingService from '../../services/Picking.service';
import ReportMissingPalletService from '../../services/ReportMissingPallet.service';
import GetItemPalletsService from '../../services/GetItemPallets.service';
import FeedBackService from '../../services/Feedback.service';
import UserConfigService from '../../services/UserConfig.service';

const genericSagas = [
  makeAsyncSaga(saga.GET_ITEM_DETAILS_V4, actions.getItemDetailsV4, GetItemDetailsService.getItemDetailsV4),
  makeAsyncSaga(saga.GET_ITEM_PIHISTORY, actions.getItemPiHistory, GetItemDetailsService.getItemPiHistory),
  makeAsyncSaga(
    saga.GET_ITEM_PISALESHISTORY,
    actions.getItemPiSalesHistory,
    GetItemDetailsService.getItemPiSalesHistory
  ),
  makeAsyncSaga(
    saga.GET_ITEM_PICKLISTHISTORY,
    actions.getItemPicklistHistory,
    GetItemDetailsService.getItemPicklistHistory
  ),
  makeAsyncSaga(
    saga.GET_LOCATIONS_FOR_ITEM,
    actions.getLocationsForItem,
    GetItemDetailsService.getLocationsForItem
  ),
  makeAsyncSaga(
    saga.GET_ITEM_MANAGER_APPROVAL_HISTORY,
    actions.getItemManagerApprovalHistory,
    GetItemDetailsService.getItemManagerApprovalHistory
  ),
  makeAsyncSaga(saga.HIT_GOOGLE, actions.hitGoogle, HitGoogleService.hitGoogle),
  makeAsyncSaga(saga.GET_ITEM_DETAILS, actions.getItemDetails, GetItemDetailsService.getItemDetails),
  makeAsyncSaga(saga.GET_WORKLIST, actions.getWorklist, GetWorklistService.getWorklist),
  makeAsyncSaga(saga.GET_WORKLIST_V1, actions.getWorklistV1, GetWorklistService.getWorklistV1),
  makeAsyncSaga(saga.GET_WORKLIST_AUDIT, actions.getWorklistAudit, GetWorklistService.getWorklistAudit),
  makeAsyncSaga(
    saga.GET_PALLET_WORKLIST,
    actions.getPalletWorklist,
    GetPalletWorklistService.getPalletWorklist
  ),
  makeAsyncSaga(saga.EDIT_LOCATION, actions.editLocation, EditLocationService.editLocation),
  makeAsyncSaga(saga.ADD_LOCATION, actions.addLocation, AddLocationService.addLocation),
  makeAsyncSaga(saga.UPDATE_OH_QTY, actions.updateOHQty, UpdateOHQtyService.updateOHQty),
  makeAsyncSaga(saga.UPDATE_OH_QTY_V1, actions.updateOHQtyV1, UpdateOHQtyService.updateOHQtyV1),
  makeAsyncSaga(saga.GET_WORKLIST_SUMMARY, actions.getWorklistSummary, WorklistSummaryService.getWorklistSummary),
  makeAsyncSaga(
    saga.GET_WORKLIST_SUMMARY_V2,
    actions.getWorklistSummaryV2,
    WorklistSummaryService.getWorklistSummaryV2
  ),
  makeAsyncSaga(saga.DELETE_LOCATION, actions.deleteLocation, DeleteLocationService.deleteLocation),
  makeAsyncSaga(saga.NO_ACTION, actions.noAction, NoActionService.noAction),
  makeAsyncSaga(saga.PRINT_SIGN, actions.printSign, PrintService.print),
  makeAsyncSaga(saga.GET_LOCATION_DETAILS, actions.getLocationDetails, GetLocationDetailsService.getLocation),
  makeAsyncSaga(saga.GET_FLUFFY_FEATURES, actions.getFluffyRoles, GetFluffyRolesService.getFluffyRoles),
  makeAsyncSaga(saga.GET_APPROVAL_LIST, actions.getApprovalList, GetApprovalListService.getApprovalList),
  makeAsyncSaga(saga.UPDATE_APPROVAL_LIST, actions.updateApprovalList, UpdateApprovalListService.updateApprovalList),
  makeAsyncSaga(saga.GET_ALL_ZONES, actions.getAllZones, LocationService.getAllZones),
  makeAsyncSaga(saga.GET_AISLE, actions.getAisle, LocationService.getAisle),
  makeAsyncSaga(saga.GET_SECTIONS, actions.getSections, LocationService.getSections),
  makeAsyncSaga(saga.GET_SECTION_DETAILS, actions.getSectionDetails, LocationService.getSectionDetails),
  makeAsyncSaga(saga.ADD_PALLET, actions.addPallet, AddPalletService.addPallet),
  makeAsyncSaga(saga.DELETE_PALLET, actions.deletePallet, DeletePalletService.deletePallet),
  makeAsyncSaga(saga.PRINT_LOCATION_LABELS, actions.printLocationLabels, PrintService.printLabels),
  makeAsyncSaga(saga.POST_CREATE_AISLES, actions.postCreateAisles, LocationService.createLocationAislesSection),
  makeAsyncSaga(saga.CREATE_SECTIONS, actions.createSections, LocationService.createSections),
  makeAsyncSaga(saga.CREATE_ZONE, actions.createZone, LocationService.createZone),
  makeAsyncSaga(saga.DELETE_ZONE, actions.deleteZone, LocationService.deleteZone),
  makeAsyncSaga(saga.CLEAR_LOCATION, actions.clearLocation, LocationService.clearLocation),
  makeAsyncSaga(saga.DELETE_AISLE, actions.deleteAisle, DeleteAisleService.deleteAisle),
  makeAsyncSaga(saga.REMOVE_SECTION, actions.removeSection, LocationService.removeSection),
  makeAsyncSaga(saga.GET_ZONE_NAMES, actions.getZoneNames, LocationService.getZoneNames),
  makeAsyncSaga(saga.GET_CLUB_CONFIG, actions.getClubConfig, ConfigService.getConfigByClub),
  makeAsyncSaga(saga.GET_ITEM_DETAIL_UPC, actions.getItemDetailsUPC, GetItemDetailsUPCService.getItemDetailsUPC),
  makeAsyncSaga(saga.ADD_PALLET_UPCS, actions.addPalletUPCs, AddPalletService.addPalletUPCs),
  makeAsyncSaga(saga.UPDATE_PALLET_ITEM_QTY, actions.updatePalletItemQty, PalletManagementService.updateItemQuantity),
  makeAsyncSaga(saga.DELETE_UPCS, actions.deleteUpcs, DeletePalletUPCsService.deletePalletUPCs),
  makeAsyncSaga(saga.COMBINE_PALLETS, actions.combinePallets, PalletManagementService.combinePallets),
  makeAsyncSaga(saga.PRINT_PALLET_LABEL, actions.printPalletLabel, PrintService.printPallet),
  makeAsyncSaga(saga.CLEAR_PALLET, actions.clearPallet, DeletePalletService.clearPallet),
  makeAsyncSaga(saga.GET_PALLET_DETAILS, actions.getPalletDetails, PalletManagementService.getPalletDetails),
  makeAsyncSaga(saga.POST_BIN_PALLETS, actions.binPallets, PalletManagementService.postBinPallets),
  makeAsyncSaga(saga.GET_PALLET_CONFIG, actions.getPalletConfig, PalletManagementService.getPalletConfig),
  makeAsyncSaga(saga.POST_CREATE_PALLET, actions.postCreatePallet, CreatePalletService.createPallet),
  makeAsyncSaga(saga.UPDATE_PICKLIST_STATUS, actions.updatePicklistStatus, PickingService.updatePickListStatus),
  makeAsyncSaga(saga.UPDATE_PICKLIST_STATUS_V1, actions.updatePicklistStatusV1, PickingService.updatePickListStatusV1),
  makeAsyncSaga(saga.GET_PICKLISTS, actions.getPicklists, PickingService.getPickListService),
  makeAsyncSaga(saga.UPDATE_PALLET_NOT_FOUND, actions.updatePalletNotFound, PickingService.updatePalletNotFound),
  makeAsyncSaga(saga.CREATE_NEW_PICK, actions.createNewPick, PickingService.createNewPick),
  makeAsyncSaga(
    saga.REPORT_MISSING_PALLET,
    actions.reportMissingPallet,
    ReportMissingPalletService.reportMissingPallet
  ),
  makeAsyncSaga(saga.GET_ITEM_PALLETS, actions.getItemPallets, GetItemPalletsService.getItemPallets),
  makeAsyncSaga(saga.GET_ITEM_PALLETS_V1, actions.getItemPalletsV1, GetItemPalletsService.getItemPalletsV1),
  makeAsyncSaga(
    saga.UPDATE_MULTI_PALLET_UPC_QTY,
    actions.updateMultiPalletUPCQty,
    PalletManagementService.updateMultiPalletUPCQty
  ),
  makeAsyncSaga(saga.SUBMIT_FEEDBACK_RATING, actions.submitFeedbackRating, FeedBackService.submitFeedbackRating),
  makeAsyncSaga(saga.GET_USER_CONFIG, actions.getUserConfig, UserConfigService.getUserConfig),
  makeAsyncSaga(saga.UPDATE_USER_CONFIG, actions.updateUserConfig, UserConfigService.updateUserConfig),
  makeAsyncSaga(
    saga.UPDATE_MULTI_PALLET_UPC_QTY_V2,
    actions.updateMultiPalletUPCQtyV2,
    PalletManagementService.updateMultiPalletUPCQtyV2
  )
];

export default function* rootSaga() {
  yield all(genericSagas.map(genericSaga => call(genericSaga.watcher)));
}
