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
    ITEM: 'item',
    ITEMS: 'items',
    TOOLS: 'Tools'
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
    UNKNOWN: 'Unknown'
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
    ERROR_SALES_HISTORY: 'Unable to retrieve sales history'
  },
  PRINT: {
    MAIN_TITLE: 'Print price sign',
    QUEUE_TITLE: 'Print list',
    CHANGE_TITLE: 'Printers',
    LOCATION_TITLE: 'Print location labels',
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
    CHANGE_PRINTER: 'Change Printer',
    MAC_ADDRESS: 'Enter or Scan MAC Address',
    MAC_ADDRESS_ERROR: 'The MAC address is usually 12 numbers',
    PORTABLE_PRINTER: 'Portable Printer',
    PRINT_SERVICE_ERROR: 'There was an error printing the label, \nPlease try again.',
    PLEASE_CHOOSE_PORTABLE: 'Please choose portable printer',
    LOCATION_SUCCESS: 'Section Label Successfully Printed',
    DUPLICATE_PRINTER: 'A Printer currently exists',
    SOME_PRINTS_FAILED: 'Some items failed to print'
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
    DELETE_LOCATION_API_ERROR: 'There was an error deleting the location. \nRetry?',
    ADD_NEW_LOCATION: 'Add New Location',
    EDIT_LOCATION: 'Edit Location',
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
    PALLET_DELETE_CONFIRMATION: 'Confirm: \nDelete pallet',
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
    REMOVE_AISLE_CONFIRMATION: 'Are you sure you want to remove this aisle?',
    REMOVE_AISLE_WILL_REMOVE_SECTIONS: 'This will also remove all sections associated with it',
    REMOVE_AISLE_FAIL: 'There was an error removing the aisle.  Please try again',
    AISLE_REMOVED: 'Aisle removed successfully',
    REMOVE_SECTION_CONFIRMATION: 'Are you sure you want to delete section: %{sectionName}?',
    REMOVE_SECTION_FAIL: 'There was an error removing the section. \nPlease try again.',
    SECTION_REMOVED: 'Section Removed Successfully',
    CLEAR_AISLE_CONFIRMATION: 'Are you sure you want to clear this aisle?',
    CLEAR_AISLE_WILL_REMOVE_SECTIONS: 'This will also clear all items and pallet associated with this aisle',
    CLEAR_AISLE_FAIL: 'There was an error clearing the aisle.  Please try again',
    AISLE_CLEARED: 'Aisle cleared successfully'
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
    WORKLIST_ITEM_API_ERROR: 'There was an error retrieving worklist items.\nPlease try again.'
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
    UPDATE_API_ERROR: 'There was an error updating the approval status. \n Please try again.'
  },
  LOGIN: {
    CLUB_NBR_REQUIRED: 'A Club Number is required to use OYI',
    ENTER_CLUB_NBR: 'Enter a Club Number'
  }
};
