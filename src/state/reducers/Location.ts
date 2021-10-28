import {
  Actions,
  SELECT_AISLE,
  SELECT_SECTION,
  SELECT_ZONE,
} from '../actions/Location';

interface LocationState {
  selectedZone: {
    id: number;
    name: string;
  };
  selectedAisle: {
    id: number;
    name: string;
  };
  selectedSection: {
    id: number;
    name: string;
  };
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
    default:
      return state;
  }
};
