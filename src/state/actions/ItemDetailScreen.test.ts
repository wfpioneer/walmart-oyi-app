import getItemDetails from '../../mockData/getItemDetails';
import Location from '../../models/Location';
import {
  ACTION_COMPLETED,
  CLEAR_SELECTED_LOCATION,
  DELETE_LOCATION_FROM_EXISTING,
  GET_LOCATION_DETAILS,
  RESET_LOCATIONS,
  SETUP_SCREEN,
  SET_FLOOR_LOCATIONS,
  SET_RESERVE_LOCATIONS,
  SET_SELECTED_LOCATION,
  SET_UPC,
  UPDATE_PENDING_OH_QTY,
  clearSelectedLocation,
  deleteLocationFromExisting,
  getLocationDetails,
  resetLocations,
  setActionCompleted,
  setFloorLocations,
  setReserveLocations,
  setSelectedLocation,
  setUPC,
  setupScreen,
  updatePendingOHQty
} from './ItemDetailScreen';

describe('ItemDetailScreen action creator tests', () => {
  it('tests action creators for ItemDetailScreen', () => {
    const item = getItemDetails[456];

    const setupScreenResult = setupScreen(
      item.itemNbr,
      item.upcNbr,
      item.location.floor || [],
      item.location.reserve || [],
      item.exceptionType,
      item.pendingOnHandsQty,
      true,
      true
    );
    expect(setupScreenResult).toStrictEqual({
      type: SETUP_SCREEN,
      payload: {
        itemNbr: item.itemNbr,
        upcNbr: item.upcNbr,
        floorLocations: item.location.floor,
        reserveLocations: item.location.reserve,
        exceptionType: item.exceptionType,
        pendingOHQty: item.pendingOnHandsQty,
        completed: true,
        salesFloor: true
      }
    });

    const updatePendingResult = updatePendingOHQty(325);
    expect(updatePendingResult).toStrictEqual({
      type: UPDATE_PENDING_OH_QTY,
      payload: 325
    });

    const setActionResult = setActionCompleted();
    expect(setActionResult).toStrictEqual({ type: ACTION_COMPLETED });

    const setFloorLocationsResult = setFloorLocations(
      item.location.floor || []
    );
    expect(setFloorLocationsResult).toStrictEqual({
      type: SET_FLOOR_LOCATIONS,
      payload: item.location.floor
    });

    const setReserveLocationsResult = setReserveLocations(
      item.location.reserve || []
    );
    expect(setReserveLocationsResult).toStrictEqual({
      type: SET_RESERVE_LOCATIONS,
      payload: item.location.reserve
    });

    const deleteLocationResults = deleteLocationFromExisting('reserve', 5);
    expect(deleteLocationResults).toStrictEqual({
      type: DELETE_LOCATION_FROM_EXISTING,
      payload: {
        locationArea: 'reserve',
        locIndex: 5
      }
    });

    const resetLocationResults = resetLocations();
    expect(resetLocationResults).toStrictEqual({ type: RESET_LOCATIONS });

    const getLocationDetailsResults = getLocationDetails(123456);
    expect(getLocationDetailsResults).toStrictEqual({
      type: GET_LOCATION_DETAILS,
      payload: {
        itemNbr: 123456
      }
    });
    const locationMock: Location = {
      zoneId: 0,
      aisleId: 2,
      sectionId: 2,
      zoneName: 'B',
      aisleName: '1',
      sectionName: '1',
      locationName: 'B1-1',
      type: 'Reserve',
      typeNbr: 7
    };
    const setSelectedLocationResults = setSelectedLocation(locationMock);
    expect(setSelectedLocationResults).toStrictEqual({
      type: SET_SELECTED_LOCATION,
      payload: {
        location: locationMock
      }
    });

    const clearSelectedLocationResults = clearSelectedLocation();
    expect(clearSelectedLocationResults).toStrictEqual({
      type: CLEAR_SELECTED_LOCATION
    });

    const setUPCResults = setUPC('123456789');
    expect(setUPCResults).toStrictEqual({
      type: SET_UPC,
      payload: {
        upc: '123456789'
      }
    });
  });
});
