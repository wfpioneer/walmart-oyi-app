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
