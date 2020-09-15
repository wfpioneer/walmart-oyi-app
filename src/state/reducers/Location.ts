import {SET_CURRENT_LOCATION, SET_NEW_LOCATION, RESET_LOCATION, TOGGLE_IS_EDITING} from "../actions/Location";
import LocationType from "../../models/Location"

interface LocationState {
  currentLocation: LocationType;
  newLocation: LocationType;
  isEditing: boolean;
}

const initialState: LocationState = {
  currentLocation: {
    zoneId: '',
    aisleId: '',
    sectionId: '',
    zoneName: '',
    aisleName: '',
    sectionName:'',
    type: ''
  },
  newLocation: {
    zoneId: '',
    aisleId: '',
    sectionId: '',
    zoneName: '',
    aisleName: '',
    sectionName:'',
    type: ''
  },
  isEditing: false
};

export const Location = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_CURRENT_LOCATION:
      return {
        ...state,
        currentLocation: {
          zoneId: action.payload.zoneId,
          aisleId: action.payload.aisleId,
          sectionId: action.payload.sectionId,
          zoneName: action.payload.zoneName,
          aisleName: action.payload.aisleName,
          sectionName: action.payload.sectionName,
          type: action.payload.type
        }
      };
    case SET_NEW_LOCATION:
      return {
        ...state,
        newLocation: {
          zoneId: action.payload.zoneId,
          aisleId: action.payload.aisleId,
          sectionId: action.payload.sectionId,
          zoneName: action.payload.zoneName,
          aisleName: action.payload.aisleName,
          sectionName: action.payload.sectionName,
          type: action.payload.type
        }
      };
    case RESET_LOCATION:
      return initialState;
    case TOGGLE_IS_EDITING:
      return {
        ...state,
        isEditing: !state.isEditing
      };
    default:
      return state;
  }
};