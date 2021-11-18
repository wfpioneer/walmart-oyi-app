import {
  Actions,
  HIDE_LOCATION_POPUP,
  RESET_SECTION_NAME,
  SELECT_AISLE,
  SELECT_SECTION,
  SELECT_ZONE,
  SET_AISLES,
  SET_CREATE_FLOW,
  SET_NEW_ZONE,
  SET_NUMBER_OF_AISLES_TO_CREATE,
  SET_POSSIBLE_ZONES,
  SET_ZONES,
  SHOW_LOCATION_POPUP
} from '../actions/Location';
import {
  AisleItem,
  CREATE_FLOW,
  PossibleZone,
  SectionItem,
  ZoneItem
} from '../../models/LocationItems';

export interface LocationIdName {
  id: number;
  name: string;
}

interface LocationState {
  selectedZone: LocationIdName;
  selectedAisle: LocationIdName;
  selectedSection: LocationIdName;
  zones: ZoneItem[],
  aisles: AisleItem[],
  possibleZones: PossibleZone[],
  locationPopupVisible: boolean,
  createFlow: CREATE_FLOW,
  newZone: string,
  numberOfAislesToCreate: number
}

const initialState: LocationState = {
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
  locationPopupVisible: false,
  createFlow: CREATE_FLOW.NOT_STARTED,
  newZone: '',
  numberOfAislesToCreate: 0
};

export const Location = (
  state = initialState,
  action: Actions
) : LocationState => {
  switch (action.type) {
    case SELECT_ZONE: {
      return {
        ...state,
        selectedZone: {
          id: action.payload.id,
          name: action.payload.name
        }
      };
    }
    case SET_ZONES:
      return {
        ...state,
        zones: action.payload
      };
    case SELECT_AISLE: {
      return {
        ...state,
        selectedAisle: {
          id: action.payload.id,
          name: action.payload.name
        }
      };
    }
    case SET_AISLES:
      return {
        ...state,
        aisles: action.payload
      };
    case SELECT_SECTION: {
      return {
        ...state,
        selectedSection: {
          id: action.payload.id,
          name: action.payload.name
        }
      };
    }
    case SHOW_LOCATION_POPUP:
      return {
        ...state,
        locationPopupVisible: true
      };
    case HIDE_LOCATION_POPUP:
      return {
        ...state,
        locationPopupVisible: false
      };
    case SET_POSSIBLE_ZONES:
      return {
        ...state,
        possibleZones: action.payload
      };
    case SET_CREATE_FLOW:
      return {
        ...state,
        createFlow: action.payload
      };
    case SET_NEW_ZONE:
      return {
        ...state,
        newZone: action.payload
      };
    case SET_NUMBER_OF_AISLES_TO_CREATE:
      return {
        ...state,
        numberOfAislesToCreate: action.payload
      };
    case RESET_SECTION_NAME:
      return initialState;
    default:
      return state;
  }
};
