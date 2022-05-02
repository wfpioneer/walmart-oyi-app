import { PickCreateItem, PickListItem, Tabs } from '../../models/Picking.d';
import {
  Actions,
  DELETE_PICKS,
  INITIALIZE_PICKLIST,
  RESET_PICKLIST,
  SELECT_PICKS,
  SET_PICK_CREATE_FLOOR,
  SET_PICK_CREATE_ITEM,
  SET_PICK_CREATE_RESERVE,
  SET_SELECTED_TAB,
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
  selectedTab: Tabs.PICK
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
    case RESET_PICKLIST:
      return initialState;
    default:
      return state;
  }
};
