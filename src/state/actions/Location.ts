import Location from '../../models/Location';

export const SET_CURRENT_LOCATION = 'LOCATION/SET_CURRENT_LOCATION';
export const SET_NEW_LOCATION = 'LOCATION/SET_NEW_LOCATION';
export const RESET_LOCATION = 'LOCATION/RESET_LOCATION';
export const TOGGLE_IS_EDITING = 'LOCATION/TOGGLE_IS_EDITING';

export const setCurrentLocation = (location: Location) => ({
  type: SET_CURRENT_LOCATION,
  payload: location
});

export const setNewLocation = (location: Location) => ({
  type: SET_NEW_LOCATION,
  payload: location
});

export const resetLocation = () => ({
  type: RESET_LOCATION
});

export const toggleIsEditing = () => ({
  type: TOGGLE_IS_EDITING
});