import {
  clearSelectedItem,
  hideItemPopup,
  hideLocationPopup,
  resetLocationAll,
  selectAisle,
  selectSection,
  selectZone,
  setAisleSectionCount,
  setAisles,
  setAislesToCreate,
  setAislesToCreateToExistingAisle,
  setCreateFlow,
  setNewZone,
  setPalletIds,
  setPossibleZones,
  setSections,
  setSelectedItem,
  setZones,
  showItemPopup,
  showLocationPopup
} from '../actions/Location';
import { Location, LocationState, initialState } from './Location';
import { mockZones } from '../../mockData/zoneDetails';
import { mockAisles } from '../../mockData/aisleDetails';
import { mockSections } from '../../mockData/sectionDetails';
import { CREATE_FLOW } from '../../models/LocationItems';

describe('The Location Reducer', () => {
  // Intitial State
  const testInitialState = initialState;
  let testChangedState: LocationState = { ...initialState };

  it('handles selecting the zone in Location management', () => {
    const testZoneId = 1079;
    const testZoneName = 'BLAN';
    // Changed state
    testChangedState = {
      ...initialState,
      selectedZone: {
        id: testZoneId,
        name: testZoneName
      }
    };
    const testResults = Location(testInitialState, selectZone(testZoneId, testZoneName));
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handles setting all the available zones', () => {
    testChangedState = {
      ...testChangedState,
      zones: mockZones
    };
    const testResults = Location(testChangedState, setZones(mockZones));
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handles setting all the available aisles', () => {
    testChangedState = {
      ...testChangedState,
      aisles: mockAisles
    };
    const testResults = Location(testChangedState, setAisles(mockAisles));
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handles selecting the Aisles in Location management', () => {
    const testAisleId = 1;
    const testAisleName = 'Aisle 1';
    testChangedState = {
      ...initialState,
      selectedAisle: {
        id: testAisleId,
        name: testAisleName
      }
    };
    const testResults = Location(testInitialState, selectAisle(testAisleId, testAisleName));
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handles select section in Location Management', () => {
    const testSectionId = 1;
    const testSectionName = 'Section ABAR1-1';
    testChangedState = {
      ...testChangedState,
      selectedSection: {
        id: testSectionId,
        name: testSectionName
      }
    };
    const testResults = Location(testChangedState, selectSection(testSectionId, testSectionName));
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handles set sections in Location Management', () => {
    testChangedState = { ...testChangedState, sections: mockSections };
    const testResults = Location(testChangedState, setSections(mockSections));
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handles showLocationPopup in Location Management ', () => {
    testChangedState = { ...testChangedState, locationPopupVisible: true };
    const testResults = Location(testChangedState, showLocationPopup());
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handles hideLocationPopup in Location Management ', () => {
    testChangedState = { ...testChangedState, locationPopupVisible: false };
    const testResults = Location(testChangedState, hideLocationPopup());
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handles showItemPopup in Location Management ', () => {
    testChangedState = { ...testChangedState, itemPopupVisible: true };
    const testResults = Location(testChangedState, showItemPopup());
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handles hideItemPopup in Location Management ', () => {
    testChangedState = { ...testChangedState, itemPopupVisible: false };
    const testResults = Location(testChangedState, hideItemPopup());
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handles setPossibleZones in Location Management', () => {
    const testZoneList = [
      {
        zoneName: 'A',
        description: 'First Feature'
      },
      {
        zoneName: 'B',
        description: 'Electronics'
      }
    ];
    testChangedState = { ...testChangedState, possibleZones: testZoneList };
    const testResults = Location(testChangedState, setPossibleZones(testZoneList));
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handles setCreateFlow in Location Management', () => {
    testChangedState = { ...testChangedState, createFlow: CREATE_FLOW.CREATE_AISLE };
    const testResults = Location(testChangedState, setCreateFlow(CREATE_FLOW.CREATE_AISLE));
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handles setNewZone in Location Management', () => {
    const testNewZone = 'Y';
    testChangedState = { ...testChangedState, newZone: testNewZone };
    const testResults = Location(testChangedState, setNewZone(testNewZone));
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handles setSelectedItem action in Location Management', () => {
    const testItem = {
      itemNbr: 987654321,
      itemDesc: 'Small, Store Use Item',
      price: 198.00,
      upcNbr: '777555333',
      locationType: 1
    };
    testChangedState = { ...testChangedState, selectedItem: testItem };
    const testResults = Location(testChangedState, setSelectedItem(testItem));
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handles clearSelectedItem action in Location Management', () => {
    testChangedState = { ...testChangedState, selectedItem: null };
    const testResults = Location(testChangedState, clearSelectedItem());
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handles setPalletIds action in Location Management', () => {
    const testPalletIds = ['23', '4948'];
    testChangedState = { ...testChangedState, palletIds: testPalletIds };
    const testResults = Location(testChangedState, setPalletIds(testPalletIds));
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handles setAisleSectionCount action in Location Management', () => {
    const testAisleIndex = 1;
    const testSectionCount = 2;
    mockAisles[testAisleIndex].sectionCount = testSectionCount;
    testChangedState = { ...testChangedState, aislesToCreate: mockAisles };
    const testResults = Location(testChangedState, setAisleSectionCount(testAisleIndex, testSectionCount));
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handles setAislesToCreate action in Location Management', () => {
    const testAislesToCreate = 2;
    testChangedState = {
      ...testChangedState,
      aislesToCreate: [
        { aisleName: 1, sectionCount: 1 },
        { aisleName: 2, sectionCount: 1 }
      ]
    };
    const testResults = Location(testChangedState, setAislesToCreate(testAislesToCreate));
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handles setAislesToCreateToExistingAisle action in Location Management', () => {
    const testAisle = {
      id: 1,
      name: 'Aisle 1'
    };
    testChangedState = { ...testChangedState, aislesToCreate: [{ aisleName: 'Aisle 1', sectionCount: 1 }] };
    const testResults = Location(testChangedState, setAislesToCreateToExistingAisle(testAisle));
    expect(testResults).toStrictEqual(testChangedState);
  });
  it('handle resetLocationAll action in Location management', () => {
    testChangedState = { ...initialState };
    const testResults = Location(testChangedState, resetLocationAll());
    expect(testResults).toStrictEqual(testChangedState);
  });
});
