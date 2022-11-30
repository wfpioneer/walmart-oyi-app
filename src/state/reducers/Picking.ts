import { PickCreateItem, PickListItem, Tabs } from '../../models/Picking.d';
import {
  Actions,
  DELETE_PICKS,
  INITIALIZE_PICKLIST,
  RESET_MULTI_PICK_BIN_SELECTION,
  RESET_PICKLIST,
  SELECT_PICKS,
  SET_PICK_CREATE_FLOOR,
  SET_PICK_CREATE_ITEM,
  SET_PICK_CREATE_RESERVE,
  SET_SELECTED_TAB,
  SHOW_PICKING_MENU,
  TOGGLE_MULTI_BIN,
  TOGGLE_MULTI_PICK,
  UPDATE_MULTI_PICK_SELECTION,
  UPDATE_PICKS
} from '../actions/Picking';
import Location from '../../models/Location';

export interface PickingState {
  pickList: PickListItem[];
  selectedPicks: number[];
  pickCreateItem: PickCreateItem;
  pickCreateFloorLocations: Location[];
  pickCreateReserveLocations: Location[];
  selectedTab: Tabs;
  pickingMenu: boolean;
  multiBinEnabled: boolean;
  multiPickEnabled: boolean;
}

const initialState: PickingState = {
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
  selectedTab: Tabs.PICK,
  pickingMenu: false,
  multiBinEnabled: false,
  multiPickEnabled: false
};

export const Picking = (
  state = initialState,
  action: Actions
): PickingState => {
  switch (action.type) {
    case INITIALIZE_PICKLIST:
      return {
        ...state,
        pickList: action.payload
      };
    case UPDATE_PICKS: {
      const updatedPicklist = state.pickList.map(pick => {
        const newPick = action.payload.filter(
          payloadPick => pick.id === payloadPick.id
        )[0];
        if (newPick && pick.id === newPick.id) {
          return newPick;
        }
        return pick;
      });
      return {
        ...state,
        pickList: updatedPicklist
      };
    }
    case SELECT_PICKS:
      return {
        ...state,
        selectedPicks: action.payload
      };
    case DELETE_PICKS:
      return {
        ...state,
        pickList: state.pickList.filter(
          pick => !action.payload.includes(pick.id)
        )
      };
    case SET_PICK_CREATE_ITEM:
      return {
        ...state,
        pickCreateItem: action.payload
      };
    case SET_PICK_CREATE_FLOOR:
      return {
        ...state,
        pickCreateFloorLocations: action.payload.map((loc: Location) => ({
          ...loc,
          locationName: `${loc.zoneName}${loc.aisleName}-${loc.sectionName}`
        }))
      };
    case SET_PICK_CREATE_RESERVE:
      return {
        ...state,
        pickCreateReserveLocations: action.payload.map((loc: Location) => ({
          ...loc,
          locationName: `${loc.zoneName}${loc.aisleName}-${loc.sectionName}`
        }))
      };
    case SET_SELECTED_TAB:
      return {
        ...state,
        selectedTab: action.payload
      };
    case SHOW_PICKING_MENU:
      return {
        ...state,
        pickingMenu: action.payload
      };
    case TOGGLE_MULTI_BIN:
      return {
        ...state,
        multiPickEnabled: false,
        multiBinEnabled: action.payload
      };
    case TOGGLE_MULTI_PICK:
      return {
        ...state,
        multiBinEnabled: false,
        multiPickEnabled: action.payload
      };
    case UPDATE_MULTI_PICK_SELECTION: {
      const { pickListItems, isSelected } = action.payload;
      const updatedPickList = [...state.pickList];
      pickListItems.forEach(updItem => {
        const item = updatedPickList.find(pickItem => pickItem.id === updItem.id);
        if (item) {
          item.isSelected = isSelected;
        }
      });
      return {
        ...state,
        pickList: updatedPickList
      };
    }
    case RESET_MULTI_PICK_BIN_SELECTION: {
      return {
        ...state,
        pickList: state.pickList.map(pickItem => ({ ...pickItem, isSelected: false })),
        multiBinEnabled: false,
        multiPickEnabled: false
      };
    }
    case RESET_PICKLIST:
      return initialState;
    default:
      return state;
  }
};
