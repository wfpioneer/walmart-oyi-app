import {
  Actions, RESET_LOCATION, SELECTED_AISLE, SELECTED_SECTION, SELECTED_ZONE
} from '../actions/LocationApi';

interface LocationState {
    selectedZone: {
        id: number,
        name: string
      },
      selectedAisle: {
        id: number,
        name: string
      }, selectedSection: {
        id: number,
        name: string
       }
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
  }
};

export const LocationApi = (
  state = initialState,
  action: Actions
): LocationState => {
  switch (action.type) {
    case RESET_LOCATION: {
      return initialState;
    }
    case SELECTED_ZONE: {
      return {
        ...state,
        selectedZone: {
          id: action.payload.id,
          name: action.payload.name
        }
      };
    }
    case SELECTED_AISLE: {
      return {
        ...state,
        selectedAisle: {
          id: action.payload.id,
          name: action.payload.name
        }
      };
    }
    case SELECTED_SECTION: {
      return {
        ...state,
        selectedSection: {
          id: action.payload.id,
          name: action.payload.name
        }
      };
    }
    default:
      return state;
  }
};
