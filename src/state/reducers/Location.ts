import { cloneDeep } from 'lodash';
import {
  Actions,
  HIDE_ITEM_POPUP,
  HIDE_LOCATION_POPUP,
  RESET_SECTION_NAME,
  SELECT_AISLE,
  SELECT_SECTION,
  SELECT_ZONE,
  SET_AISLES,
  SET_AISLES_TO_CREATE,
  SET_AISLES_TO_CREATE_TO_EXISTING_AISLE,
  SET_AISLE_SECTION_COUNT,
  SET_CREATE_FLOW,
  SET_NEW_ZONE,
  SET_POSSIBLE_ZONES,
  SET_SECTIONS,
  SET_ZONES,
  SHOW_ITEM_POPUP,
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
export interface CreateZoneRequest {
  zoneName: string;
  description: string
  aisles: CreateAisles[]
}

export interface CreateAisles {
  aisleName: number | string;
  sectionCount: number;
}

interface LocationState {
  selectedZone: LocationIdName;
  selectedAisle: LocationIdName;
  selectedSection: LocationIdName;
  zones: ZoneItem[];
  aisles: AisleItem[];
  sections: SectionItem[];
  possibleZones: PossibleZone[];
  locationPopupVisible: boolean;
  createFlow: CREATE_FLOW;
  newZone: string;
  aislesToCreate: CreateAisles[];
  itemPopupVisible: boolean
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
  sections: [],
  locationPopupVisible: false,
  createFlow: CREATE_FLOW.NOT_STARTED,
  newZone: '',
  aislesToCreate: [],
  itemPopupVisible: false
};

export const Location = (
  state = initialState,
  action: Actions
): LocationState => {
  const aislesToCreate: CreateAisles[] = [];
  let aisleCount = 1;
  let aisles = [];
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
    case SET_SECTIONS:
      return {
        ...state,
        sections: action.payload
      };
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
    case SHOW_ITEM_POPUP:
      return {
        ...state,
        itemPopupVisible: true
      };
    case HIDE_ITEM_POPUP:
      return {
        ...state,
        itemPopupVisible: false
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
    case SET_AISLES_TO_CREATE:
      while (aislesToCreate.length < action.payload) {
        if (!state.aisles.find(aisle => aisleCount === parseInt(aisle.aisleName, 10))) {
          aislesToCreate.push({
            aisleName: aisleCount,
            sectionCount: 1
          });
        }
        aisleCount += 1;
      }
      return {
        ...state,
        aislesToCreate
      };
    case SET_AISLE_SECTION_COUNT:
      aisles = cloneDeep(state.aislesToCreate);
      aisles[action.payload.aisleIndex].sectionCount = action.payload.sectionCount;
      return {
        ...state,
        aislesToCreate: aisles
      };
    case RESET_SECTION_NAME:
      return initialState;
    case SET_AISLES_TO_CREATE_TO_EXISTING_AISLE:
      return {
        ...state,
        aislesToCreate: [{
          aisleName: action.payload.name,
          sectionCount: 1
        }]
      };
    default:
      return state;
  }
};
