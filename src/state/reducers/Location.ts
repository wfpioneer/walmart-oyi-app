import {
  Actions,
  HIDE_LOCATION_POPUP,
  RESET_SECTION_NAME,
  SELECT_AISLE,
  SELECT_SECTION,
  SELECT_ZONE,
  SHOW_LOCATION_POPUP
} from '../actions/Location';

export interface LocationIdName {
  id: number;
  name: string;
}

interface LocationState {
  selectedZone: LocationIdName;
  selectedAisle: LocationIdName;
  selectedSection: LocationIdName;
  locationPopupVisible: boolean
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
  locationPopupVisible: false
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
    case SELECT_AISLE: {
      return {
        ...state,
        selectedAisle: {
          id: action.payload.id,
          name: action.payload.name
        }
      };
    }
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
    case RESET_SECTION_NAME:
      return initialState;
    default:
      return state;
  }
};
