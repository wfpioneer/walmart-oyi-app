import getItemDetails from '../../mockData/getItemDetails';
import Location from '../../models/Location';
import {
  clearSelectedLocation,
  deleteLocationFromExisting,
  resetLocations,
  setActionCompleted,
  setFloorLocations,
  setReserveLocations,
  setSelectedLocation,
  setUPC,
  setupScreen,
  updatePendingOHQty
} from '../actions/ItemDetailScreen';
import { ItemDetailScreen, ItemDetailsState } from './ItemDetailScreen';

describe('ItemDetailScreen reducer tests', () => {
  it('Tests ItemDetailScreen reducer', () => {
    const testInitialState: ItemDetailsState = {
      itemNbr: 0,
      upcNbr: '',
      pendingOnHandsQty: -999,
      exceptionType: null,
      actionCompleted: false,
      floorLocations: [],
      reserveLocations: [],
      selectedLocation: null,
      salesFloor: false
    };
    const testMutatedState: ItemDetailsState = {
      itemNbr: 0,
      upcNbr: '',
      pendingOnHandsQty: -999,
      exceptionType: null,
      actionCompleted: false,
      floorLocations: [],
      reserveLocations: [],
      selectedLocation: null,
      salesFloor: false
    };

    // SetUpScreen
    const screenSetupState: ItemDetailsState = {
      itemNbr: 1234567890,
      upcNbr: '000055559999',
      pendingOnHandsQty: -999,
      exceptionType: 'nsfl',
      actionCompleted: true,
      floorLocations: [],
      reserveLocations: [
        {
          zoneId: 0,
          aisleId: 1,
          sectionId: 1,
          zoneName: 'A',
          aisleName: '1',
          sectionName: '1',
          locationName: 'A1-1',
          type: 'Reserve',
          typeNbr: 7,
          qty: 10
        }
      ],
      selectedLocation: null,
      salesFloor: true
    };

    const item = getItemDetails[123];
    let testResults = ItemDetailScreen(testInitialState, setupScreen(
      item.itemNbr, item.upcNbr, [], item.location.reserve || [], item.exceptionType, item.pendingOnHandsQty, true, true
    ));
    expect(testResults).toStrictEqual(screenSetupState);

    // pending On Hands Qty
    testMutatedState.pendingOnHandsQty = 50;
    testResults = ItemDetailScreen(testInitialState, updatePendingOHQty(50));
    expect(testResults).toStrictEqual(testMutatedState);
    testMutatedState.pendingOnHandsQty = -999;

    // Action Completed
    testMutatedState.actionCompleted = true;
    testResults = ItemDetailScreen(testInitialState, setActionCompleted());
    expect(testResults).toStrictEqual(testMutatedState);
    testMutatedState.actionCompleted = false;

    // Set Floor locations
    const floorLoc: Location[] = [{
      zoneId: 0,
      aisleId: 1,
      sectionId: 1,
      zoneName: 'A',
      aisleName: '1',
      sectionName: '1',
      locationName: 'A1-1',
      type: 'Sales Floor',
      typeNbr: 8
    }];
    testMutatedState.floorLocations = floorLoc;
    testResults = ItemDetailScreen(testInitialState, setFloorLocations(floorLoc));
    expect(testResults).toStrictEqual(testMutatedState);

    // Delete Location From Existing Floor
    testResults = ItemDetailScreen(testMutatedState, deleteLocationFromExisting('floor', 0));
    expect(testResults).toStrictEqual(testInitialState);
    testMutatedState.floorLocations = [];

    // Set Reserve Locations
    const reserveLoc: Location[] = [{
      zoneId: 0,
      aisleId: 2,
      sectionId: 2,
      zoneName: 'B',
      aisleName: '1',
      sectionName: '1',
      locationName: 'B1-1',
      type: 'Reserve',
      typeNbr: 7
    }];
    testResults = ItemDetailScreen(testMutatedState, setReserveLocations(reserveLoc));
    testMutatedState.reserveLocations = reserveLoc;
    expect(testResults).toStrictEqual(testMutatedState);

    // Delete Location From Existing Reserve
    testResults = ItemDetailScreen(testMutatedState, deleteLocationFromExisting('reserve', 0));
    expect(testResults).toStrictEqual(testInitialState);
    testMutatedState.reserveLocations = [];

    // Reset Location
    testResults = ItemDetailScreen(testInitialState, resetLocations());
    expect(testResults).toStrictEqual(testInitialState);

    // Set Selected Location
    testMutatedState.selectedLocation = {
      zoneId: 1,
      aisleId: 2,
      sectionId: 3,
      zoneName: 'A',
      aisleName: '2',
      sectionName: '3',
      locationName: 'A2-3',
      type: 'DISPLAY',
      typeNbr: 6
    };
    testResults = ItemDetailScreen(testInitialState, setSelectedLocation(testMutatedState.selectedLocation));
    expect(testResults).toStrictEqual(testMutatedState);

    // Clear Selected Location
    testResults = ItemDetailScreen(testMutatedState, clearSelectedLocation());
    expect(testResults).toStrictEqual(testInitialState);
    testMutatedState.selectedLocation = null;

    // Set UPC
    testMutatedState.upcNbr = '500252';
    testResults = ItemDetailScreen(testMutatedState, setUPC('500252'));
    expect(testResults).toStrictEqual(testMutatedState);
    testMutatedState.upcNbr = '';
  });
});
