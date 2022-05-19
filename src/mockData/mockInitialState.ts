import { RootState } from "../state/reducers/RootReducer";
import { AVAILABLE_TOOLS } from "../models/User";
import {PrinterType} from "../models/Printer";
import {CREATE_FLOW} from "../models/LocationItems";
import {Tabs} from "../models/Picking";

export const defaultAsyncState = {
  isWaiting: false,
  value: null,
  error: null,
  result: null
};

export const mockinitialState = {
  User: {
    userId: 'testUser',
    countryCode: 'MX',
    domain: 'HOMEOFFICE',
    siteId: 5522,
    token: 'testToken',
    features: AVAILABLE_TOOLS,
    configs: {
      locationManagement: true,
      locationManagementEdit: true,
      palletManagement: true,
      settingsTool: true,
      printingUpdate: true,
      binning: true,
      palletExpiration: true,
      backupCategories: '',
      picking: true
    },
    additional: {
      clockCheckResult: '',
      displayName: '',
      loginId: '',
      mailId: ''
    }
  },
  Modal: {
    showModal: false,
    showActivity: false,
    content: null
  },
  Global: {
    isByod: false,
    isManualScanEnabled: false,
    scannedEvent: {
      value: null,
      type: null
    }
  },
  Worklist: {
    menuOpen: false,
    categoryOpen: false,
    exceptionOpen: false,
    filterCategories: [],
    filterExceptions: []
  },
  Print: {
    selectedPrinter: {
      type: PrinterType.LASER,
      name: '',
      desc: '',
      id: '0',
      labelsAvailable: ['price']
    },
    selectedSignType: '',
    printerList: [],
    printQueue: [],
    printingLocationLabels: '',
    printingPalletLabel: false,
    locationPrintQueue: [],
    priceLabelPrinter: {
      type: PrinterType.LASER,
      name: '',
      desc: '',
      id: '0',
      labelsAvailable: ['price']
    },
    locationLabelPrinter: null,
    palletLabelPrinter: null,
    selectedPrintingType: null
  },
  ItemDetailScreen: {
    itemNbr: 0,
    upcNbr: '',
    pendingOnHandsQty: -999,
    exceptionType: null,
    actionCompleted: false,
    floorLocations: [],
    reserveLocations: [],
    selectedLocation: null,
    salesFloor: false
  },
  Location: {
    selectedZone: {
      id: 0,
      name: ''
    },
    selectedAisle: {
      id: 0,
      name: ''
    },
    selectedSection: {
      id: 0,
      name: ''
    },
    zones: [],
    possibleZones: [],
    aisles: [],
    sections: [],
    palletIds: [],
    locationPopupVisible: false,
    createFlow: CREATE_FLOW.NOT_STARTED,
    newZone: '',
    aislesToCreate: [],
    itemPopupVisible: false,
    selectedItem: null
  },
  Approvals: {
    approvalList: [],
    categories: {},
    categoryIndices: [],
    selectedItemQty: 0,
    isAllSelected: false
  },
  SnackBar: {
    showSnackBar: false,
    messageContent: '',
    duration: 5000
  },
  PalletManagement: {
    managePalletMenu: false,
    palletInfo: {
      id: '0',
      createDate: undefined,
      expirationDate: undefined
    },
    items: [],
    combinePallets: [],
    perishableCategories: []
  },
  Binning: {
    pallets: [],
    binLocation: null
  },
  Picking: {
    pickList: [],
    selectedPicks: [],
    pickCreateItem: {
      itemName: '',
      itemNbr: 0,
      upcNbr: '',
      categoryNbr: 0,
      categoryDesc: '',
      price: 0
    },
    pickCreateFloorLocations: [],
    pickCreateReserveLocations: [],
    selectedTab: Tabs.PICK
  },
  sessionTimeout: null,
  async: {
    hitGoogle: defaultAsyncState,
    getItemDetails: defaultAsyncState,
    getWorklist: defaultAsyncState,
    editLocation: defaultAsyncState,
    addToPicklist: defaultAsyncState,
    addLocation: defaultAsyncState,
    updateOHQty: defaultAsyncState,
    getWorklistSummary: defaultAsyncState,
    deleteLocation: defaultAsyncState,
    noAction: defaultAsyncState,
    printSign: defaultAsyncState,
    getLocation: defaultAsyncState,
    getFluffyRoles: defaultAsyncState,
    getApprovalList: defaultAsyncState,
    updateApprovalList: defaultAsyncState,
    getAllZones: defaultAsyncState,
    getAisle: defaultAsyncState,
    getSections: defaultAsyncState,
    getSectionDetails: defaultAsyncState,
    addPallet: defaultAsyncState,
    deletePallet: defaultAsyncState,
    printLocationLabels: defaultAsyncState,
    getPalletDetails: defaultAsyncState,
    postCreateAisles: defaultAsyncState,
    createSections: defaultAsyncState,
    postCreateZone: defaultAsyncState,
    deleteZone: defaultAsyncState,
    clearLocation: defaultAsyncState,
    deleteAisle: defaultAsyncState,
    removeSection: defaultAsyncState,
    getZoneNames: defaultAsyncState,
    getClubConfig: defaultAsyncState,
    getItemDetailsUPC: defaultAsyncState,
    addPalletUPCs: defaultAsyncState,
    updatePalletItemQty: defaultAsyncState,
    deleteUpcs: defaultAsyncState,
    combinePallets: defaultAsyncState,
    printPalletLabel: defaultAsyncState,
    clearPallet: defaultAsyncState,
    getPalletInfo: defaultAsyncState,
    binPallets: defaultAsyncState,
    getPalletConfig: defaultAsyncState,
    updatePicklistStatus: defaultAsyncState,
    getPicklists: defaultAsyncState,
    createNewPick: defaultAsyncState
  }
};