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
    GOAL: 'Goal'
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
    NEGATIVE_ON_HANDS: 'Negative on-hands',
    CANCELLED: 'Cancelled',
    NSFL: 'No sales floor location',
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
    NO_FLOOR_LOCATION_DETAILS: 'Item not completed because you never added a floor location'
  },
  PRINT: {
    MAIN_TITLE: 'Print price sign',
    QUEUE_TITLE: 'Print list',
    CHANGE_TITLE: 'Printers',
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
    PORTABLE_PRINTER: 'Portable Printer'
  },
  LOCATION: {
    TITLE: 'All locations',
    FLOOR: 'Floor locations',
    RESERVE: 'Reserve locations',
    ADD_LOCATION_API_ERROR: 'There was an error adding the location. \nPlease try again.',
    ADD_DUPLICATE_ERROR: 'Location and type combination \nalready exist.',
    MANUAL_ENTRY_BUTTON: 'Manually key in location',
    SELECTION_INSTRUCTION: '1. Select a location type.',
    SCAN_INSTRUCTION: '2. Scan location label.'
  },
  WORKLIST: {
    WORKLIST: 'Work List',
    CATEGORY: 'Category',
    EXCEPTION_TYPE: 'Exception Type',
    ITEM: 'item',
    ITEMS: 'items',
    ALL: 'All',
    REFINE: 'Refine',
    CLEAR: 'Clear',
    TODO: 'Todo',
    COMPLETED: 'Completed'
  },
  SELECTLOCATIONTYPE: {
    TITLE: 'Select type of location',
    FLOOR: 'Floor',
    ENDCAP: 'End cap',
    POD: 'POD',
    DISPLAY: 'Display',
    RESERVE: 'Reserve'
  }
};
