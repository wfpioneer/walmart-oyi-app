import { CreateAisleRequest } from '../../models/CreateZoneAisleSection.d';
import {
  ApprovalListItem, approvalAction, approvalRequestSource, approvalStatus
} from '../../models/ApprovalListItem';
import { PrintItemList, PrintLocationList, PrintPalletList } from '../../models/Printer';
import { CreateZoneRequest } from '../reducers/Location';
import { PalletItem } from '../../models/PalletItem';
import { CombinePalletsRequest, UpdateItemQuantityRequest } from '../../services/PalletManagement.service';

export const HIT_GOOGLE = 'SAGA/HIT_GOOGLE';
export const GET_ITEM_DETAILS = 'SAGA/GET_ITEM_DETAILS';
export const GET_WORKLIST = 'SAGA/GET_WORKLIST';
export const EDIT_LOCATION = 'SAGA/EDIT_LOCATION';
export const UPDATE_OH_QTY = 'SAGA/UPDATE_OH_QTY';
export const ADD_TO_PICKLIST = 'SAGA/ADD_TO_PICKLIST';
export const ADD_LOCATION = 'SAGA/ADD_LOCATION';
export const GET_WORKLIST_SUMMARY = 'SAGA/GET_WORKLIST_SUMMARY';
export const DELETE_LOCATION = 'SAGA/DELETE_LOCATION';
export const NO_ACTION = 'SAGA/NO_ACTION';
export const PRINT_SIGN = 'SAGA/PRINT_SIGN';
export const GET_LOCATION_DETAILS = 'SAGA/GET_LOCATION_DETAILS';
export const GET_FLUFFY_FEATURES = 'SAGA/GET_FLUFFY_FEATURES';
export const GET_APPROVAL_LIST = 'SAGA/GET_APPROVAL_LIST';
export const UPDATE_APPROVAL_LIST = 'SAGA/UPDATE_APPROVAL_LIST';
export const GET_ALL_ZONES = 'SAGA/GET_ZONES';
export const GET_AISLE = 'SAGA/GET_AISLE';
export const GET_SECTIONS = 'SAGA/GET_SECTIONS';
export const GET_SECTION_DETAILS = 'SAGA/GET_SECTION_DETAILS';
export const PRINT_LOCATION_LABELS = 'SAGA/PRINT_SECTION_LABELS';
export const ADD_PALLET = 'SAGA/ADD_PALLET';
export const DELETE_PALLET = 'SAGA/DELETE_PALLET';
export const GET_PALLET_DETAILS = 'SAGA/GET_PALLET_DETAILS';
export const POST_CREATE_AISLES = 'SAGA/POST_CREATE_AISLES';
export const CREATE_SECTIONS = 'SAGA/CREATE_SECTIONS';
export const CREATE_ZONE = 'SAGA/CREATE_ZONE';
export const DELETE_ZONE = 'SAGA/DELETE_ZONE';
export const CLEAR_LOCATION = 'SAGA/CLEAR_LOCATION';
export const DELETE_AISLE = 'SAGA/DELETE_AISLE';
export const REMOVE_SECTION = 'SAGA/REMOVE_SECTION';
export const GET_ZONE_NAMES = 'SAGA/GET_ZONE_NAMES';
export const GET_CLUB_CONFIG = 'SAGA/GET_CLUB_CONFIG';
export const GET_ITEM_DETAIL_UPC = 'SAGA/GET_ITEM_DETAIL_UPC';
export const ADD_PALLET_UPCS = 'SAGA/ADD_PALLET_UPCS';
export const UPDATE_PALLET_ITEM_QTY = 'SAGA/UPDATE_PALLET_ITEM_QTY';
export const DELETE_UPCS = 'SAGA/DELETE_UPCS';
export const COMBINE_PALLETS = 'SAGA/COMBINE_PALLETS';
export const PRINT_PALLET_LABEL = 'SAGA/PRINT_PALLET_LABEL';
export const CLEAR_PALLET = 'SAGA/CLEAR_PALLET';

// TODO add types for each service payload
export const hitGoogle = (payload: any) => ({ type: HIT_GOOGLE, payload } as const);
export const getItemDetails = (payload: any) => ({ type: GET_ITEM_DETAILS, payload } as const);
export const getWorklist = (payload?: any) => ({ type: GET_WORKLIST, payload } as const);
export const editLocation = (payload: any) => ({ type: EDIT_LOCATION, payload } as const);
export const addLocation = (payload: any) => ({ type: ADD_LOCATION, payload } as const);
export const updateOHQty = (payload: {
  data: Partial<ApprovalListItem>
}) => ({ type: UPDATE_OH_QTY, payload } as const);
export const addToPicklist = (payload: any) => ({ type: ADD_TO_PICKLIST, payload } as const);
export const getWorklistSummary = () => ({ type: GET_WORKLIST_SUMMARY } as const);
export const deleteLocation = (payload: any) => ({ type: DELETE_LOCATION, payload } as const);
export const noAction = (payload: any) => ({ type: NO_ACTION, payload } as const);
export const printSign = (payload: {
  headers?: Record<string, unknown>;
  printList: PrintItemList[]}) => ({ type: PRINT_SIGN, payload } as const);
export const getLocationDetails = (payload: any) => ({ type: GET_LOCATION_DETAILS, payload } as const);
export const getFluffyFeatures = (payload: any) => ({ type: GET_FLUFFY_FEATURES, payload } as const);
export const getApprovalList = (payload: {
  itemNbr?: number;
  status?: approvalStatus;
  approvalRequestSource?: approvalRequestSource;
}) => ({ type: GET_APPROVAL_LIST, payload } as const);
export const updateApprovalList = (payload: {
  approvalItems: ApprovalListItem[];
  headers: { action: approvalAction };
}) => ({ type: UPDATE_APPROVAL_LIST, payload } as const);
export const getAllZones = () => ({ type: GET_ALL_ZONES } as const);
export const getAisle = (payload: { zoneId: number }) => ({ type: GET_AISLE, payload } as const);
export const getSections = (payload: { aisleId: number }) => ({ type: GET_SECTIONS, payload } as const);
export const getSectionDetails = (payload: { sectionId: string }) => ({ type: GET_SECTION_DETAILS, payload } as const);
export const printLocationLabel = (payload: {
  printLabelList: PrintLocationList[]
}) => ({ type: PRINT_LOCATION_LABELS, payload } as const);
export const addPallet = (payload: any) => ({ type: ADD_PALLET, payload } as const);
export const deletePallet = (payload: {palletId: number}) => ({ type: DELETE_PALLET, payload } as const);
export const createSections = (payload: any) => ({ type: CREATE_SECTIONS, payload } as const);
export const getPalletDetails = (payload: {
  palletIds: number[], isAllItems?: boolean
}) => ({ type: GET_PALLET_DETAILS, payload } as const);
export const deleteZone = (payload: number) => ({ type: DELETE_ZONE, payload } as const);
export const postCreateAisles = (payload: {
  aislesToCreate: CreateAisleRequest
}) => ({ type: POST_CREATE_AISLES, payload } as const);
export const postCreateZone = (payload: CreateZoneRequest) => ({ type: CREATE_ZONE, payload } as const);
export const clearLocation = (payload: {
  locationId: number, target: string
}) => ({ type: CLEAR_LOCATION, payload } as const);
export const deleteAisle = (payload: any) => ({ type: DELETE_AISLE, payload } as const);
export const removeSection = (payload: number) => ({ type: REMOVE_SECTION, payload } as const);
export const getZoneNames = () => ({ type: GET_ZONE_NAMES } as const);
export const getClubConfig = () => ({ type: GET_CLUB_CONFIG } as const);
export const getItemDetailsUPC = (payload: { upc: number }) => ({ type: GET_ITEM_DETAIL_UPC, payload } as const);
export const addPalletUPCs = (payload: {
  palletId: number, items: PalletItem[]
}) => ({ type: ADD_PALLET_UPCS, payload } as const);
export const updatePalletItemQty = (payload: UpdateItemQuantityRequest) => ({
  type: UPDATE_PALLET_ITEM_QTY, payload
} as const);
export const deleteUpcs = (payload: { palletId: number; upcs: string[] }) => ({ type: DELETE_UPCS, payload } as const);
export const combinePallets = (payload: CombinePalletsRequest) => ({
  type: COMBINE_PALLETS, payload
} as const);
export const printPalletLabel = (payload: {
  printPalletList: PrintPalletList[]
}) => ({ type: PRINT_PALLET_LABEL, payload } as const);
export const clearPallet = (payload: {palletId: number}) => ({
  type: CLEAR_PALLET, payload
} as const);
