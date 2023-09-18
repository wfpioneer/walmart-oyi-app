/* eslint max-len: 0 */
export default {
  GENERICS: {
    SAVE: 'Save',
    SIGN_IN: 'Sign In',
    SIGN_OUT: 'Sign Out',
    DONE: 'Done',
    START: 'Start',
    CONTINUE: 'Continue',
    SEND: 'Send',
    DISMISS: 'Dismiss',
    TRY_AGAIN: 'Try again',
    OK: 'OK',
    ERROR: 'Error',
    NOT_STARTED: 'Not started',
    RESTART: 'Restart',
    DELETE: 'Delete',
    CANCEL: 'Cancel',
    SAVE_AND_DONE: 'Save and done',
    NOT_FOUND: 'Not found',
    BACK: 'Back',
    NEXT: 'Next',
    EXIT: 'Exit',
    ALL: 'All',
    GET_STARTED: 'Get Started',
    ENTER_UPC_ITEM_NBR: 'Enter UPC or Item Number',
    INPUT_LOC: 'Input Location Label',
    CHANGE: 'Change',
    SEE_ALL: 'See all',
    ADD: 'Add',
    NOT_ASSIGNED: 'Not assigned',
    UPDATED: 'Updated',
    DAILY: 'Daily',
    WEEKLY: 'Weekly',
    WEEK: 'Week',
    TOTAL: 'Total',
    DEFAULT: 'Default',
    CLUB: 'Club',
    SUBMIT: 'Submit',
    RETRY: 'Retry',
    GOAL: 'Goal',
    VERSION: 'Version',
    BARCODE_SCAN_ERROR: 'This barcode type is not allowed',
    ITEM: 'Item',
    ITEMS: 'Items',
    TOOLS: 'Tools',
    OR: 'OR',
    CURRENCY_SYMBOL: '$',
    UNDO: 'Undo',
    YES: 'Yes',
    NO: 'No',
    ENABLED: 'Enabled',
    DISABLED: 'Disabled',
    REQUIRED: 'Required',
    REMOVED: 'Removed',
    CREATE: 'Create',
    UNASSIGNED: 'unassigned',
    SELECTED: 'selected',
    UPDATE: 'Update Configuration',
    WARNING_LABEL: 'Warning',
    CLOSE: 'Close',
    NUMBER_MIN_MAX: 'Number must be between %{minimum} and %{maximum}',
    FEEDBACK: 'Feedback',
    UNSAVED_WARNING_MSG: 'All unsaved changes will be lost'
  },
  HOME: {
    OWN_YOUR_INVENTORY: 'Own Your Inventory',
    WORKLIST_API_ERROR: 'There was an error retrieving the worklist summary.\nPlease try again.',
    WELCOME: 'Welcome',
    HOME: 'Home',
    STYLE_GUIDE: 'Style Guide',
    CHANGE_LANGUAGE: 'Change Language',
    ITEMS: 'Items',
    WORKLIST_GOAL_COMPLETE: '%{complete} of %{total} items'
  },
  EXCEPTION: {
    PO: 'Price Override',
    NIL_PICK: 'Nil Pick',
    PRICE_OVERRIDE: 'Price Override',
    NO_SALES: 'No Sales',
    NEGATIVE_ON_HANDS: 'Negative On-Hands',
    CANCELLED: 'Cancelled',
    NSFL: 'No Sales Floor Location',
    UNKNOWN: 'Unknown',
    MISSING_PALLETS: 'Missing Pallets',
    AUDITS: 'Audits',
    ROLLOVER_AUDITS: 'Rollover Audits',
    NEG_SALES_FLOOR_QTY: 'Negative Sales Floor Quantity'
  },
  ITEM: {
    TITLE: 'Review item details',
    ITEM: 'Item',
    UPC: 'UPC',
    STATUS: 'Status',
    CATEGORY: 'Category',
    QUANTITY: 'Quantity',
    ON_HANDS: 'On-hands',
    ON_ORDER: 'On order',
    REPLENISHMENT: 'Replenishment',
    PENDING_MGR_APPROVAL: 'Pending manager approval',
    LOCATION: 'Location',
    TO_PICKLIST: ' to picklist',
    RESERVE_NEEDED: 'Reserve location needed to add to picklist',
    ADDED_TO_PICKLIST: 'Item added to picklist',
    ADDED_TO_PICKLIST_ERROR: 'Picklist submission unsuccessful. Please try again.',
    FLOOR: 'Floor',
    RESERVE: 'Reserve',
    SALES_METRICS: 'Sales metrics',
    AVG_SALES: 'average sales',
    TOGGLE_GRAPH: 'Toggle graph',
    OH_UPDATE_ERROR: 'Please enter a number between %{min} and %{max}',
    OH_UPDATE_API_ERROR: 'There was an error updating the quantity. Please try again.',
    API_ERROR: 'There was an error pulling the item details. Please try again.',
    ITEM_NOT_FOUND: 'The scanned item was not found.',
    SCAN_FOR_NO_ACTION: 'Scan for no action',
    USE_SCANNER_SCAN_FOR_NO_ACTION: 'Use the barcode scanner to scan for no action',
    SCAN_DOESNT_MATCH: 'Scan doesn\'t match',
    SCAN_DOESNT_MATCH_DETAILS: 'The item scanned doesn\'t match the current item\'s upc',
    NO_SIGN_PRINTED: 'No sign printed',
    NO_SIGN_PRINTED_DETAILS: 'Item not completed because you never printed a new sign',
    NO_FLOOR_LOCATION: 'No floor location',
    NO_FLOOR_LOCATION_DETAILS: 'Item not completed because you never added a floor location',
    ACTION_COMPLETE_ERROR: 'Error Completing Action',
    ACTION_COMPLETE_ERROR_DETAILS: 'There was an error completing the action, please try again.',
    WEEKLY_AVG_SALES: 'Weekly average sales',
    SALES_FLOOR_QTY: 'Sales Floor',
    RESERVE_QTY: 'Reserve',
    CLAIMS_QTY: 'Claims',
    CONSOLIDATED_QTY: 'Consolidated',
    FLY_CLOUD_QTY: 'Fly Cloud',
    IN_TRANSIT_FLY_QTY: 'In Transit Fly Cloud',
    ERROR_SALES_HISTORY: 'Unable to retrieve sales history',
    ITEM_NUMBER: 'Item Number',
    OH_CHANGE_HISTORY: 'On Hands Change History',
    NO_OH_CHANGE_HISTORY: 'No On Hand history available',
    ERROR_OH_CHANGE_HISTORY: 'Error retrieving data',
    PICK_HISTORY: 'Pick History',
    NO_PICK_HISTORY: 'No pick history available',
    ERROR_PICK_HISTORY: 'Error retrieving data',
    ADDITIONAL_ITEM_DETAILS: 'Additional Item Details',
    VENDOR_PACK: 'Vendor Pack',
    COLOR: 'Color',
    SIZE: 'Size',
    PRICE_BEFORE_TAX: 'Price Before Tax',
    MARGIN: 'Margin',
    GROSS_PROFIT: 'Gross Profit',
    HISTORY: 'History',
    NO_HISTORY: 'No history available',
    RESERVE_ADJUSTMENT: 'Reserve Adjustment',
    SAVE_MODAL: 'Save Quantity Changes?',
    UPDATE_MULTI_PALLET_SUCCESS: 'Pallet quantities have been updated.',
    UPDATE_MULTI_PALLET_FAILURE: 'Unable to update pallet quantities, please try again.',
    ERROR_PI_DELIVERY_HISTORY: 'There was an error pulling the delivery history. Please try again.',
    ERROR_PI_SALES_HISTORY: 'There was an error pulling the sales history. Please try again.',
    DELETE_PALLET_FAILURE: 'Delete pallet failed, please try again',
    RESERVE_CONFIRMATION: 'Save Reserve Pallet Changes?',
    OTHER_ACTIONS: 'Other Actions',
    CLEAN_RESERVE: 'Clean Up Reserve',
    CHOOSE_ACTION: 'Choose Action',
    DESIRED_ACTION: 'Complete the item by taking a desired action from below:',
    CHOOSE_RESERVE: 'Make changes to reserve pallet qty',
    CHOOSE_TOTAL_OH: 'Make changes to total on-hands',
    CHOOSE_PICKLIST: 'Create a pick to replenish sales floor qty',
    NO_ACTION_NEEDED: 'The item is up to date no action is needed',
    REPLENISH_RESERVE: 'Please replenish the reserve, to add item to pick list.',
    CANCEL_APPROVAL: 'This action will cancel the currently pending action. Would you Like to continue?',
    UNABLE_TO_CANCEL_APPROVAL: 'Unable to cancel Approval at this time please contact manager to cancel/reject approval',
    NO_ITEM_SCANNED: 'No Item Scanned',
    SCAN_ITEM: 'Please scan an item'
  },
  PRINT: {
    MAIN_TITLE: 'Print price sign',
    QUEUE_TITLE: 'Print list',
    CHANGE_TITLE: 'Printers',
    LOCATION_TITLE: 'Print location labels',
    PALLET_TITLE: 'Print pallet label',
    PRICE_SIGN: 'Print price sign',
    COPY_QTY: 'Number of copies',
    COPIES: 'Copies',
    SIGN_SIZE: 'Sign size',
    FRONT_DESK: 'Front desk printer',
    EMPTY_LIST: 'Nothing in the print list',
    PRINT: 'Print',
    PRINT_ALL: 'Print all',
    ADD_TO_QUEUE: 'Add to print list',
    TOTAL_ITEMS: 'items total',
    XSmall: 'X-Small',
    Small: 'Small',
    Wine: 'Wine',
    Medium: 'Med',
    Large: 'Large',
    PRINTER_LIST: 'Printer List',
    PRINTER_LIST_PRICE: 'Select item price sign printer',
    PRINTER_LIST_LOCATION: 'Select location labels printer',
    PRINTER_LIST_PALLET: 'Select pallet labels printer',
    CHANGE_PRINTER: 'Change Printer',
    MAC_ADDRESS: 'Enter or Scan MAC Address',
    MAC_ADDRESS_ERROR: 'The MAC address is usually 12 numbers',
    PORTABLE_PRINTER: 'Portable Printer',
    PRINT_SERVICE_ERROR: 'There was an error printing the label, \nPlease try again.',
    PLEASE_CHOOSE_PORTABLE: 'Please choose portable printer',
    LOCATION_SUCCESS: 'Section Label Successfully Printed',
    PALLET_SUCCESS: 'Pallet Label Successfully Printed',
    DUPLICATE_PRINTER: 'A Printer currently exists',
    SOME_PRINTS_FAILED: 'Some items failed to print',
    PRICE_SIGN_PRINTER: 'Price Sign Printer',
    LOCATION_LABEL_PRINTER: 'Location Label Printer',
    PALLET_LABEL_PRINTER: 'Pallet Label Printer',
    LOCATION_PRINTING: 'Location Printing',
    PRICE_SIGNS: 'Price Signs',
    LOCATIONS: 'Locations',
    PRICE_SIGN_SUCCESS: 'Price Sign Label Successfully Printed',
    PRINTER_NOT_ASSIGNED: 'No assigned printer',
    Was_Large: 'Was Price - Large',
    Was_Medium: 'Was Price - Med',
    Was_Small: 'Was Price - Small',
    Was_XSmall: 'Was Price - X-Small',
    INVALID_SIZE: 'Some items will not be printed due to invalid sign size',
    CHOOSE_PRICE_SIGN: 'Print new price sign for this item'
  },
  PALLET: {
    PALLET_MANAGEMENT: 'Pallet Management',
    ENTER_PALLET_ID: 'Type a pallet ID',
    SCAN_PALLET: 'Scan a pallet',
    PRINT_PALLET: 'Print pallet',
    COMBINE_PALLETS: 'Combine Pallets',
    CLEAR_PALLET: 'Clear pallets',
    MANAGE_PALLET: 'Manage Pallet',
    PALLET_ID: 'Pallet ID',
    EXPIRATION_DATE: 'Expiration Date',
    SCAN_INSTRUCTIONS: 'Scan UPC to add an item',
    ITEM_DELETE: '1 item pending deletion',
    X_ITEMS_DELETE: '%{nbrOfItems} items pending deletion',
    PALLET_DETAILS_ERROR: 'Error Unable to Find Pallet',
    PALLET_MERGE: 'will be merged into',
    CANNOT_HAVE_NEGATIVE_QTY: 'Item cannot have negative quantity',
    ITEMS_DETAILS_EXIST: 'The scanned item already exists on the pallet',
    ITEMS_DETAILS_ERROR: 'Error Unable to Find Item with the UPC',
    ITEMS_NOT_FOUND: 'Item Not found',
    PALLET_UPC_NOT_FOUND: 'The Pallet or a UPC was not found',
    ADD_UPC_SUCCESS: 'All Items were successfully added to the Pallet',
    ADD_UPC_ERROR: 'Error adding items to the Pallet',
    COMBINE_PALLET_SUCCESS: 'Pallets combined sucessfully',
    COMBINE_PALLET_FAILURE: 'Failed to combine pallets, please try again',
    PALLET_EXISTS: 'This pallet has already been scanned',
    PALLET_EXISTS_AS_TARGET: 'This pallet is already the target pallet',
    PALLET_DOESNT_EXIST: 'The scanned pallet does not exist in our data',
    SAVE_PALLET_SUCCESS: 'Pallet update successful',
    SAVE_PALLET_PARTIAL: 'Pallet update partially successful',
    SAVE_PALLET_FAILURE: 'Pallet update failed',
    CLEAR_PALLET_CONFIRMATION: 'Are you sure you want to clear this pallet?',
    CLEAR_PALLET_ERROR: 'Error Clearing Pallet was unsuccessful',
    CLEAR_PALLET_SUCCESS: 'Pallet: %{palletId} was successfully cleared',
    CREATE_PALLET: 'Create Pallet',
    CREATE_PALLET_SUCCESS: 'Pallet created successfully',
    CREATE_PALLET_FAILED: 'Failed to create pallet',
    DELETE_ONCE_MERGED: 'Pallet ID %{palletId} will be deleted once merged'
  },
  LOCATION: {
    TITLE: 'All locations',
    FLOOR: 'Floor locations',
    RESERVE: 'Reserve locations',
    FLOORS: 'Floor',
    RESERVES: 'Reserve',
    ADD_LOCATION_API_ERROR: 'There was an error adding the location. \nPlease try again.',
    EDIT_LOCATION_API_ERROR: 'There was an error editing the location. \nPlease try again.',
    ADD_DUPLICATE_ERROR: 'Location and type combination \nalready exists.',
    EDIT_DUPLICATE_ERROR: 'Location and type combination \nalready exists.',
    MANUAL_ENTRY_BUTTON: 'Manually key in location',
    SELECTION_INSTRUCTION: '1. Select a location type.',
    SCAN_INSTRUCTION: 'Scan location label.',
    DELETE_CONFIRMATION: 'Confirm: \ndelete location ',
    DELETE_LOCATION_API_ERROR: 'There was an error deleting the location. \nPlease try again.',
    DELETE_LOCATION_API_SUCCESS: 'Location %{locationName} has been successfully deleted',
    ADD_NEW_LOCATION: 'Add New Location',
    EDIT_LOCATION: 'Edit Location',
    CHANGE_LOCATION: 'Change location of the item',
    LOCATION_MANAGEMENT: 'Location Management',
    ITEMS: 'Items',
    PALLETS: 'Pallets',
    PALLET: 'Pallet',
    ZONES: 'Zones',
    ZONE: 'Zone',
    AISLES: 'Aisles',
    AISLE: 'Aisle',
    SECTIONS: 'Sections',
    SECTION: 'Section',
    AREAS: 'Areas',
    LOCATION_DETAILS: 'Location Details',
    NO_ZONES_AVAILABLE: 'No Zones Available',
    NO_AISLES_AVAILABLE: 'No Aisles Available',
    NO_SECTIONS_AVAILABLE: 'No Sections Available',
    LOCATION_API_ERROR: 'There was an error pulling the location data.\nPlease try again.',
    CLEAR_ALL: 'Clear all',
    SCAN_LOCATION: 'Invalid location name Ex: ABC1-2',
    CLEAR_SECTION: 'Clear this section',
    REMOVE_SECTION: 'Remove this section',
    REMOVE_ZONE: 'Remove this zone',
    REMOVE_ALL: 'Remove all',
    ADD: 'Add',
    ADD_ZONE: 'Add a zone',
    ADD_AISLES: 'Add aisles',
    CREATED_ON: 'Created on',
    MORE: 'More',
    PRINT_SECTION: 'Print all section location labels',
    ADD_SECTIONS: 'Add sections',
    CLEAR_AISLE: 'Clear aisle',
    REMOVE_AISLE: 'Remove aisle',
    SCAN_PALLET: 'Scan Pallet ID',
    PALLET_VALIDATE_ERROR: 'Pallet ID can only contain numbers',
    PALLET_PLACEHOLDER: 'Enter or Scan Pallet ID',
    PRINT_LABEL: 'Print label',
    PRINT_LABELS: 'Print labels',
    ADD_PALLET_ERROR: 'Error adding the pallet',
    ADD_PALLET_API_ERROR: 'There was an error adding the pallet. \nPlease try again.',
    PALLET_ERROR: 'Pallet not found/Empty Pallet',
    PALLET_NOT_FOUND: 'There was an error due to Pallet not found/Empty Pallet',
    PALLET_ADDED: 'Pallet Successfully Added',
    PALLET_DELETE_CONFIRMATION: 'Are you sure you want to remove Pallet %{pallet} from Section %{section}?',
    FLOOR_EMPTY: 'The Floor List is empty',
    RESERVE_EMPTY: 'The Reserve List is empty',
    GET_FAILED_PALLETS: 'Failed to Retrieve %{amount} Pallet(s)',
    AISLES_ADDED: '{number} aisles added',
    INCOMPLETE_AISLES_ADDED: 'Not all aisles/sections were created. Only {number} aisles/sections were added',
    INCOMPLETE_AISLES_PLEASE_CHECK: 'Please check the list of aisles and sections that were created',
    ADD_AISLES_ERROR: 'There was an error adding the aisles/sections.  Please try again',
    EDIT_ITEM: 'Edit an item',
    REMOVE_ITEM: 'Remove an item',
    SECTION_NOT_FOUND: 'The Scanned Section was not found.',
    PRINT_LABEL_EXISTS_HEADER: 'Print Label Exists',
    PRINT_LABEL_EXISTS: 'This Print Label already Exists in the Print Queue',
    SECTIONS_ADDED: '%{number} section(s) added',
    ADD_SECTIONS_ERROR: 'There was an error adding the sections. Please try again',
    ZONE_ADDED: 'Zone %{name} added',
    ADD_ZONE_ERROR: 'There was an error adding the zone. Please try again',
    INCOMPLETE_ZONE_ADDED: 'Zone %{name} added, but not all aisles/sections were created. Please check the list of aisles and sections that were created',
    REMOVE_ZONE_CONFIRMATION: 'Are you sure you want to remove this zone?',
    REMOVE_ZONE_WILL_REMOVE_AISLES_SECTIONS: 'This will also remove all aisles and sections associated with it',
    REMOVE_ZONE_FAIL: 'There was an error removing the zone.  Please try again',
    DELETE_ITEM: 'Delete %{itemNbr} \n%{itemName}',
    ERROR_DELETE_ITEM: 'There was an error deleting the item. Please try again',
    UPC_VALIDATE_ERROR: 'UPC can only contain numbers',
    SCAN_ITEM: 'Scan Item',
    ITEM_ADDED: 'Item Successfully Added',
    ADD_ITEM_ERROR: 'Error adding the item',
    ADD_ITEM_API_ERROR: 'There was an error adding the item. \nPlease try again.',
    CLEAR_SECTION_CONFIRMATION: 'Are you sure you want to clear this section?',
    CLEAR_SECTION_SALES_FLOOR_MESSAGE: 'This will clear all sales floor items from this section',
    CLEAR_SECTION_RESERVE_MESSAGE: 'This will clear all reserve pallets from this section',
    CLEAR_SECTION_WONT_DELETE: 'This will not delete the section',
    CLEAR_SECTION_SALES_FLOOR_SUCCEED: 'All sales floor items successfully cleared from this section',
    CLEAR_SECTION_RESERVE_SUCCEED: 'All reserve pallets successfully cleared from this section',
    CLEAR_SECTION_FAIL: 'There was an error clearing the section. Please try again',
    REMOVE_AISLE_CONFIRMATION: 'Are you sure you want to remove this aisle?',
    REMOVE_AISLE_WILL_REMOVE_SECTIONS: 'This will also remove all sections associated with it',
    REMOVE_AISLE_FAIL: 'There was an error removing the aisle.  Please try again',
    AISLE_REMOVED: 'Aisle removed successfully',
    REMOVE_SECTION_CONFIRMATION: 'Are you sure you want to delete section: %{sectionName}?',
    REMOVE_SECTION_FAIL: 'There was an error removing the section. \nPlease try again.',
    SECTION_REMOVED: 'Section Removed Successfully',
    ZONE_NAME_ERROR: 'There was an error retrieving the possible zone names. \nPlease try again.',
    SELECT_ZONE: 'Select Zone',
    CLEAR_AISLE_ITEMS_CONFIRMATION: 'Are you sure you want to clear all items from this aisle?',
    CLEAR_AISLE_ITEMS_CHOOSE_SF_OR_RESERVE: 'Please choose sales floor, reserve, or both to clear',
    CLEAR_AISLE_ITEMS_WONT_DELETE: 'This will not delete the sections from this aisle',
    CLEAR_AISLE_ITEMS_SUCCEED: 'All selected items successfully cleared from this aisle',
    CLEAR_AISLE_ITEMS_FAIL: 'There was an error clearing items from this aisle.  Please try again',
    PALLET_MANAGEMENT: 'Pallet Management',
    LOCATION_MGMT_EDIT: 'Location Management Edit',
    SCAN_LOCATION_HEADER: 'Scan Location'
  },
  WORKLIST: {
    WORKLIST: 'Work List',
    CATEGORY: 'Category',
    EXCEPTION_TYPE: 'Exception Type',
    ALL: 'All',
    REFINE: 'Refine',
    CLEAR: 'Clear',
    TODO: 'Todo',
    COMPLETED: 'Completed',
    PENDING: 'Pending',
    PENDING_APPROVAL: 'Pending Approval',
    PENDING_PICK: 'Pending Pick',
    WORKLIST_ITEM_API_ERROR: 'There was an error retrieving worklist items.\nPlease try again.',
    AREA: 'Area',
    ITEM_WORKLIST: 'Item Work List',
    PALLET_WORKLIST: 'Pallet Work List',
    AUDIT_WORKLIST: 'Audit Work List',
    ROLLOVER_WORKLIST: 'Rollover Work List',
    SCAN_PALLET: 'Scan Pallet',
    SCAN_PALLET_LABEL: 'Scan Pallet Label to continue',
    SCAN_PALLET_ERROR: 'Pallet scanned must match pallet on worklist',
    MISSING_PALLET_API_ERROR: 'There was an error reporting the pallet as missing. Please try again.',
    MISSING_PALLET_CONFIRMATION: 'Do you want to report pallet %{palletId} as a missing pallet?',
    MISSING_PALLET_API_SUCCESS: 'Pallet has been added to the missing pallet worklist'
  },
  MISSING_PALLET_WORKLIST: {
    MISSING_PALLET_LABEL: 'Missing Pallet',
    PALLET_ID: 'Pallet ID',
    LAST_LOCATION: 'Last Location',
    REPORTED_DATE: 'Reported Date',
    REPORTED_BY: 'Reported by',
    ADD_LOCATION: 'Add Location',
    DELETE_PALLET: 'Delete Pallet',
    DELETE_PALLET_CONFIRMATION: 'Are you sure you want to delete the pallet?'
  },
  SELECTLOCATIONTYPE: {
    TITLE: 'Select type of location',
    FLOOR: 'Floor',
    ENDCAP: 'End cap',
    POD: 'POD',
    DISPLAY: 'Display',
    RESERVE: 'Reserve'
  },
  APPROVAL: {
    NEW_QUANTITY: 'New Qty',
    CURRENT_QUANTITY: 'Current qty',
    DAYS_LEFT: '%{time} day(s) Left',
    APPROVALS: 'Approvals',
    APPROVE_ITEMS: 'Approve items',
    OH_CHANGE: 'On-hands change',
    SELECT_ALL: 'Select all',
    DESELECT_ALL: 'Deselect all',
    SELECTED: 'selected',
    APPROVAL_API_ERROR: 'There was an error pulling the approval list.\nPlease try again.',
    APPROVE: 'Approve',
    REJECT: 'Reject',
    GO_BACK: 'Go back',
    CONFIRM: 'Confirm',
    APPROVE_SUMMARY: 'Summary of approvals',
    REJECT_SUMMARY: 'Summary of rejections',
    INCREASES: 'All increases',
    DECREASES: 'All decreases',
    REVIEW: 'Review changes',
    LIST_NOT_FOUND: 'The Approval List is Empty',
    UPDATE_APPROVED: 'On-hands update approved',
    UPDATE_REJECTED: 'On-hands update rejected',
    FAILED_APPROVE: 'Requests Failed to Approve',
    FAILED_ITEMS: 'Items Failed',
    UPDATE_API_ERROR: 'There was an error updating the approval status. \n Please try again.',
    MANAGER_APPROVAL: 'Manager Approval',
    APPROVAL_LOADING_MSG: 'Large approval requests may take some time, please be patient',
    SOURCE: 'Approval source'
  },
  LOGIN: {
    CLUB_NBR_REQUIRED: 'A Club Number is required to use OYI',
    ENTER_CLUB_NBR: 'Enter a Club Number'
  },
  PICKING: {
    PICKING: 'Picking',
    QUICKPICK: 'Quick Pick',
    ASSIGNED: 'Assigned',
    CREATED_BY: 'Created By',
    CREATED: 'Created',
    READY_TO_PICK: 'Ready to pick',
    ACCEPTED_PICK: 'Accepted pick',
    READY_TO_WORK: 'Ready to work',
    READY_TO_BIN: 'Ready to bin',
    ACCEPTED_BIN: 'Accepted bin',
    COMPLETE: 'Complete',
    DELETED: 'Deleted',
    NO_PALLETS_FOUND: 'No pallets found',
    ASSIGNED_TO_ME: 'Assigned to me',
    PICK: 'Pick',
    WORK: 'Work',
    BIN: 'Bin',
    SCAN_ITEM_LABEL: 'Scan item to add to picklist',
    SELECT_LOCATION: 'Select a Location',
    NUMBER_PALLETS: 'Number of Pallets',
    QUICK_PICK: 'Quick Pick',
    MOVE_TO_FRONT: 'Move to Front',
    CREATE_PICK: 'Create Pick',
    CREATE_QUICK_PICK: 'Create Quick Pick',
    RESERVE_LOC: 'Reserve Location',
    FLOOR_LOC: 'Floor location',
    FRONT: 'Front',
    ACCEPT: 'Accept',
    RELEASE: 'Release',
    PICKLIST_SUCCESS: 'Successfully retrieved pick list',
    PICKLIST_NOT_FOUND: 'No picklists were found for this club',
    PICKLIST_ERROR: 'There was an error retrieving the Picklist',
    UPDATE_REMAINING_QTY: 'Update quantity of each item left on pallet before continuing',
    REMAINING_QTY: 'Quantity left on pallet',
    REMOVE_PERISHABLE: 'Removing perishable item',
    REMOVE_PERISHABLE_NEW_EXPIRY: 'Please enter new expiration date',
    UPDATE_PICKLIST_STATUS_SUCCESS: 'Successfully updated picklist status',
    ITEM_QUANTITY_IS_MANDATORY_ERROR: 'Quantity Stocked field needs updated',
    UPDATE_PICKLIST_STATUS_ERROR: 'There was an error while updating the Picklist status',
    LOCATIONS_UPDATED: 'Locations Updated',
    LOCATIONS_FAILED_UPDATE: 'Locations Failed to Update',
    SELECT_CONTINUE_ACTION: 'Select Action to Continue',
    PALLET_NOT_FOUND: 'Pallet Not Found',
    CREATE_NEW_PICK_SUCCESS: 'Pick Created',
    CREATE_NEW_PICK_FAILURE: 'There was an error creating the pick',
    PICK_REQUEST_CRITERIA_ALREADY_MET: 'Not enough pallets available for this pick',
    PICK_COMPLETED: 'The pick has been completed',
    PICK_COMPLETED_PLURAL: 'The picks have been completed',
    PICKLIST_UPDATED: 'The picklist has been updated',
    PICK_COMPLETED_AND_PICKLIST_UPDATED: 'The pick has been completed and the picklist has been updated',
    PICK_COMPLETED_AND_PICKLIST_UPDATED_PLURAL: 'The picks have been completed and the picklist have been updated',
    NEW_PICK_ADDED_TO_PICKLIST: 'The pick request has been added to the picklist',
    NEW_PICK_ADDED_TO_PICKLIST_PLURAL: 'The pick requests have been added to the picklist',
    NO_PALLETS_AVAILABLE_PICK_DELETED: 'The pallet is not available. The pick requested has been deleted',
    UPDATE_PICK_FAILED_TRY_AGAIN: 'Failed to update pick. Please try again',
    UPDATE_PICK_FAILED_TRY_AGAIN_PLURAL: 'Failed to update picks. Please try again',
    NO_RESERVE_PALLET_AVAILABLE_ERROR: 'No reserve pallets available',
    ADDITIONAL_ITEMS: 'Pallet contains additional items',
    QUANTITY_STOCKED: 'Quantity Stocked',
    ACCEPT_FOLLOWING_PICKS: 'Accept the following picks?',
    ACCEPT_FOLLOWING_BINS: 'Accept the following bins?',
    LOC_LABEL: 'Loc',
    ACCEPT_MULTIPLE_BINS: 'Accept Multiple Bins',
    ACCEPT_MULTIPLE_PICKS: 'Accept Multiple Picks'
  },
  BINNING: {
    BINNING: 'Binning',
    ASSIGN_LOCATION: 'Assign Location',
    SCAN_LOCATION: 'Scan location to bin pallet',
    SCAN_LOCATION_PLURAL: 'Scan location to bin pallets',
    SCAN_PALLET: 'Scan a Pallet to begin',
    SCAN_PALLET_BIN: 'Scan Pallet/s to Bin',
    PALLET_BIN_SUCCESS: 'Pallets successfully binned',
    PALLET_BIN_FAILURE: 'Pallets failed to bin',
    PALLET_BIN_PARTIAL: 'Not all pallets binned, %{number} failed',
    WARNING_LABEL: 'Warning',
    WARNING_DESCRIPTION: 'If you navigate away from this screen the pallets already scanned will not be binned',
    LAST_LOC: 'Last Bin Loc',
    FIRST_ITEM: 'First Item',
    EMPTY_PALLET: 'Empty Pallet',
    PALLET_NOT_READY: 'Not ready to bin, pallet part of an active pick',
    MULTIPLE_BIN_ENABLED: 'Enable Multiple Bins',
    SINGLE_BIN_ENABLED: 'Single Bin Enabled'
  },
  SETTINGS: {
    TITLE: 'Settings',
    FEATURE_UPDATE_SUCCESS: 'Features Updated',
    FEATURE_UPDATE_FAILURE: 'Unable to get updated features',
    FEATURES: 'Features',
    AREA_FILTER: 'Area Filter'
  },
  AUDITS: {
    AUDITS: 'Audits',
    AUDIT_ITEM: 'Audit Item',
    ROLLOVER_AUDITS: 'Rollover Audits',
    COLLAPSE_ALL: 'Collapse All',
    EXPAND_ALL: 'Expand all',
    VALIDATE_QUANTITY: 'Validate quantity in each location',
    VALIDATE_SCAN_QUANTITY: 'Scan each pallet and validate quantity',
    VALIDATE_SCAN_QUANTITY_WHEN_SCAN_DISABLED: 'Validate quantity on each pallet',
    OTHER_ON_HANDS: 'Other On-Hands',
    PALLET_COUNT: 'Please enter the count for pallet',
    CONFIRM_AUDIT: 'Confirm On-Hands Audit',
    UPDATED_QTY: 'Updated Quantity',
    LARGE_CURRENCY_CHANGE: 'Large Currency Change',
    NO_LOCATION_AVAILABLE: 'No location available',
    SCAN_PALLET_ERROR: 'Pallet scanned must match pallet associated to the item',
    COMPLETE_AUDIT_ITEM_SUCCESS: 'Item audit successfully completed',
    COMPLETE_AUDIT_ITEM_ERROR: 'Item audit completion unsuccessful. Please try again.',
    OPEN_AUDIT_LABEL: 'Open Audit',
    INVALID_EQUATION: 'Invalid formula, please check the operation',
    NO_PALLETS_FOUND_FOR_ITEM: 'No Pallets found for the item',
    NEGATIVE_VALIDATION: 'Invalid result, location qty should be 0 or greater',
    ITEMS: 'Items',
    CUSTOM_ITEMS: 'Items',
    IN_PROGRESS: 'In Progress',
    CURRENT_TOTAL: 'Current Total',
    LOCATIONS_SAVED: 'Locations saved',
    LOCATIONS_SAVE_FAIL: 'Unable to save locations',
    SCANNED_ITEM_NOT_PRESENT: 'The scanned item is not on the audit worklist',
    GET_SAVED_LOC_FAIL: 'Unable to retrieve saved locations'
  },
  FEEDBACK: {
    VERY_POOR_RATE_LABEL: 'Very Poor',
    POOR_RATE_LABEL: 'Poor',
    AVERAGE_RATE_LABEL: 'Average',
    GOOD_RATE_LABEL: 'Good',
    EXCELLENT_RATE_LABEL: 'Excellent',
    FEEDBACK_REQUEST: 'Would you like to provide feedback about OYI?',
    YES: 'Yes',
    NO: 'No',
    RATING_LABEL: 'Choose a rating',
    COMMENT_PLACEHOLDER_LABEL: 'Enter any comments here',
    SUBMIT_FEEDBACK_SUCCESS: 'Feedback has successfully been submitted',
    SUBMIT_FEEDBACK_FAILURE: 'Unable to submit feedback. Please try again.'
  }
};
