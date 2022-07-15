import { AxiosRequestHeaders } from 'axios';
import { CreateAisleRequest } from '../../models/CreateZoneAisleSection.d';
import { PalletWorklistType } from '../../models/PalletWorklist';
import {
  ApprovalListItem,
  approvalAction,
  approvalRequestSource,
  approvalStatus
} from '../../models/ApprovalListItem';
import {
  PrintItemList,
  PrintLocationList,
  PrintPalletList
} from '../../models/Printer';
import { CreateZoneRequest } from '../reducers/Location';
import { PalletItem } from '../../models/PalletItem';
import {
  CombinePalletsRequest,
  GetPalletDetailsRequest,
  PostBinPalletsRequest,
  UpdateItemQuantityRequest
} from '../../services/PalletManagement.service';
import { GetItemDetailsPayload } from '../../services/GetItemDetails.service';
import User from '../../models/User';
import { PickAction } from '../../models/Picking.d';
import { CreatePickRequest } from '../../services/Picking.service';

export const HIT_GOOGLE = 'SAGA/HIT_GOOGLE';
export const GET_ITEM_DETAILS = 'SAGA/GET_ITEM_DETAILS';
export const GET_WORKLIST = 'SAGA/GET_WORKLIST';
export const GET_PALLET_WORKLIST = 'SAGA/GET_PALLET_WORKLIST';
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
export const GET_PALLET_DETAILS = 'SAGA/GET_PALLET_DETAILS';
export const POST_BIN_PALLETS = 'SAGA/POST_BIN_PALLETS';
export const GET_PALLET_CONFIG = 'SAGA/GET_PALLET_CONFIG';
export const UPDATE_PICKLIST_STATUS = 'SAGA/UPDATE_PICKLIST_STATUS';
export const GET_PICKLISTS = 'SAGA/GET_PICKLISTS';
export const UPDATE_PALLET_NOT_FOUND = 'SAGA/UPDATE_PALLET_NOT_FOUND';
export const CREATE_NEW_PICK = 'SAGA/CREATE_NEW_PICK';

// TODO add types for each service payload
export const hitGoogle = () => ({ type: HIT_GOOGLE } as const);
export const getItemDetails = (payload: GetItemDetailsPayload) => ({ type: GET_ITEM_DETAILS, payload } as const);
export const getWorklist = (payload?: { worklistType?: [string] }) => ({ type: GET_WORKLIST, payload } as const);
export const getPalletWorklist = (payload: { worklistType: PalletWorklistType[] }) => (
  { type: GET_PALLET_WORKLIST, payload } as const
);
export const editLocation = (payload: {
  headers?: AxiosRequestHeaders;
  upc: string;
  sectionId: string;
  newSectionId: string;
  locationTypeNbr: number;
  newLocationTypeNbr: number;
}) => ({ type: EDIT_LOCATION, payload } as const);
export const addLocation = (payload: {
  headers?: AxiosRequestHeaders;
  upc: string;
  sectionId: string;
  locationTypeNbr: number;
}) => ({ type: ADD_LOCATION, payload } as const);
export const updateOHQty = (payload: {
  data: Partial<ApprovalListItem>
}) => ({ type: UPDATE_OH_QTY, payload } as const);
export const addToPicklist = (payload: {
  headers?: AxiosRequestHeaders;
  itemNumber: number;
}) => ({ type: ADD_TO_PICKLIST, payload } as const);
export const getWorklistSummary = () => ({ type: GET_WORKLIST_SUMMARY } as const);
export const deleteLocation = (payload: {
  headers?: AxiosRequestHeaders;
  upc: string;
  sectionId: string;
  locationTypeNbr: number;
}) => ({ type: DELETE_LOCATION, payload } as const);
export const noAction = (payload: {
  headers?: AxiosRequestHeaders;
  upc: string;
  itemNbr: number;
  scannedValue: string;
}) => ({ type: NO_ACTION, payload } as const);
export const printSign = (payload: {
  headers?: AxiosRequestHeaders;
  printList: PrintItemList[];
}) => ({ type: PRINT_SIGN, payload } as const);
export const getLocationDetails = (payload: {
  headers?: AxiosRequestHeaders;
  itemNbr: number;
}) => ({ type: GET_LOCATION_DETAILS, payload } as const);
export const getFluffyFeatures = (payload: User) => ({ type: GET_FLUFFY_FEATURES, payload } as const);
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
  headers?: AxiosRequestHeaders;
  printLabelList: PrintLocationList[];
}) => ({ type: PRINT_LOCATION_LABELS, payload } as const);
export const addPallet = (payload: { palletId: string; sectionId: number }) => ({ type: ADD_PALLET, payload } as const);
export const deletePallet = (payload: { palletId: number }) => ({ type: DELETE_PALLET, payload } as const);
export const createSections = (
  payload: { aisleId: number; sectionCount: number }[]
) => ({ type: CREATE_SECTIONS, payload } as const);
export const deleteZone = (payload: number) => ({ type: DELETE_ZONE, payload } as const);
export const postCreateAisles = (payload: {
  aislesToCreate: CreateAisleRequest;
}) => ({ type: POST_CREATE_AISLES, payload } as const);
export const postCreateZone = (payload: CreateZoneRequest) => ({ type: CREATE_ZONE, payload } as const);
export const clearLocation = (payload: {
  locationId: number;
  target: string;
}) => ({ type: CLEAR_LOCATION, payload } as const);
export const deleteAisle = (payload: { aisleId: number }) => ({ type: DELETE_AISLE, payload } as const);
export const removeSection = (payload: number) => ({ type: REMOVE_SECTION, payload } as const);
export const getZoneNames = () => ({ type: GET_ZONE_NAMES } as const);
export const getClubConfig = () => ({ type: GET_CLUB_CONFIG } as const);
export const getItemDetailsUPC = (payload: { upc: number }) => ({ type: GET_ITEM_DETAIL_UPC, payload } as const);
export const addPalletUPCs = (payload: {
  palletId: string;
  items: PalletItem[];
  expirationDate?: string;
}) => ({ type: ADD_PALLET_UPCS, payload } as const);
export const updatePalletItemQty = (payload: UpdateItemQuantityRequest) => ({
  type: UPDATE_PALLET_ITEM_QTY,
  payload
} as const);
export const deleteUpcs = (payload: {
  palletId: string;
  upcs: string[],
  expirationDate?: string,
  removeExpirationDate: boolean
}) => ({ type: DELETE_UPCS, payload } as const);
export const combinePallets = (payload: CombinePalletsRequest) => ({
  type: COMBINE_PALLETS,
  payload
} as const);
export const printPalletLabel = (payload: {
  headers?: AxiosRequestHeaders;
  printPalletList: PrintPalletList[];
}) => ({ type: PRINT_PALLET_LABEL, payload } as const);
export const clearPallet = (payload: { palletId: string }) => ({
  type: CLEAR_PALLET,
  payload
} as const);
export const getPalletDetails = (payload: GetPalletDetailsRequest) => ({
  type: GET_PALLET_DETAILS, payload
} as const);
export const binPallets = (payload: PostBinPalletsRequest) => ({
  type: POST_BIN_PALLETS, payload
} as const);
export const getPalletConfig = () => ({
  type: GET_PALLET_CONFIG
} as const);
export const updatePicklistStatus = (payload: {
  headers: { action: PickAction };
  picklistItems: {
    picklistId: number;
    locationId: number;
    locationName: string;
  }[];
  palletId: string;
}) => ({
  type: UPDATE_PICKLIST_STATUS,
  payload
} as const);
export const getPicklists = () => ({
  type: GET_PICKLISTS
} as const);
export const updatePalletNotFound = (payload: {
  palletId: string;
  picklistIds: number[]
}) => ({
  type: UPDATE_PALLET_NOT_FOUND,
  payload
} as const);
export const createNewPick = (payload: CreatePickRequest) => ({
  type: CREATE_NEW_PICK,
  payload
} as const);
