import {
  CLEAR_SELECTED_ITEM,
  HIDE_ITEM_POPUP,
  HIDE_LOCATION_POPUP,
  RESET_LOCATION_ALL,
  SELECT_AISLE,
  SELECT_SECTION,
  SELECT_ZONE,
  SET_AISLES,
  SET_AISLES_TO_CREATE,
  SET_AISLES_TO_CREATE_TO_EXISTING_AISLE,
  SET_AISLE_SECTION_COUNT,
  SET_CREATE_FLOW,
  SET_NEW_ZONE,
  SET_PALLET_IDS,
  SET_POSSIBLE_ZONES,
  SET_SECTIONS,
  SET_SELECTED_ITEM,
  SET_ZONES,
  SHOW_ITEM_POPUP,
  SHOW_LOCATION_POPUP,
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
} from './Location';
import { mockZones } from '../../mockData/zoneDetails';
import { mockAisles } from '../../mockData/aisleDetails';
import { mockSections } from '../../mockData/sectionDetails';
import { CREATE_FLOW } from '../../models/LocationItems';

describe('Location action reducer', () => {
  it('handles setZones action', () => {
    const setZonesResult = setZones(mockZones);
    expect(setZonesResult).toStrictEqual({
      type: SET_ZONES,
      payload: mockZones
    });
  });
  it('handles selectZone action', () => {
    const testZoneId = 1079;
    const testZoneName = 'BLAN';
    const setZonesResult = selectZone(testZoneId, testZoneName);
    expect(setZonesResult).toStrictEqual({
      type: SELECT_ZONE,
      payload: { id: testZoneId, name: testZoneName }
    });
  });
  it('handles setAisles action', () => {
    const setAislesResult = setAisles(mockAisles);
    expect(setAislesResult).toStrictEqual({
      type: SET_AISLES,
      payload: mockAisles
    });
  });
  it('handles selectAisle action', () => {
    const testAisleId = 1;
    const testAisleName = 'Aisle 1';
    const setZonesResult = selectAisle(testAisleId, testAisleName);
    expect(setZonesResult).toStrictEqual({
      type: SELECT_AISLE,
      payload: { id: testAisleId, name: testAisleName }
    });
  });
  it('handles setSections action', () => {
    const setSectionsResult = setSections(mockSections);
    expect(setSectionsResult).toStrictEqual({
      type: SET_SECTIONS,
      payload: mockSections
    });
  });
  it('handles selectSection action', () => {
    const testSectionId = 1;
    const testSectionName = 'Section ABAR1-1';
    const setZonesResult = selectSection(testSectionId, testSectionName);
    expect(setZonesResult).toStrictEqual({
      type: SELECT_SECTION,
      payload: { id: testSectionId, name: testSectionName }
    });
  });
  it('handles showLocationPopup action', () => {
    const showLocationPopupResult = showLocationPopup();
    expect(showLocationPopupResult).toStrictEqual({ type: SHOW_LOCATION_POPUP });
  });
  it('handles hideLocationPopup action', () => {
    const hideLocationPopupResult = hideLocationPopup();
    expect(hideLocationPopupResult).toStrictEqual({ type: HIDE_LOCATION_POPUP });
  });
  it('handles resetLocationAll action', () => {
    const resetLocationAllResult = resetLocationAll();
    expect(resetLocationAllResult).toStrictEqual({ type: RESET_LOCATION_ALL });
  });
  it('handles setPossibleZones action', () => {
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
    const setZonesResult = setPossibleZones(testZoneList);
    expect(setZonesResult).toStrictEqual({
      type: SET_POSSIBLE_ZONES,
      payload: testZoneList
    });
  });
  it('handles setCreateFlow action', () => {
    const setCreateFlowResult = setCreateFlow(CREATE_FLOW.CREATE_ZONE);
    expect(setCreateFlowResult).toStrictEqual({
      type: SET_CREATE_FLOW,
      payload: CREATE_FLOW.CREATE_ZONE
    });
  });
  it('handles setAislesToCreate action', () => {
    const testAislesToCreate = 2;
    const setAislesToCreateResult = setAislesToCreate(testAislesToCreate);
    expect(setAislesToCreateResult).toStrictEqual({
      type: SET_AISLES_TO_CREATE,
      payload: testAislesToCreate
    });
  });
  it('handles setAislesToCreateToExistingAisle action', () => {
    const testExistingAisle = {
      id: 1,
      name: 'Aisle 1'
    };
    const setAislesToCreateToExistingAisleResult = setAislesToCreateToExistingAisle(testExistingAisle);
    expect(setAislesToCreateToExistingAisleResult).toStrictEqual({
      type: SET_AISLES_TO_CREATE_TO_EXISTING_AISLE,
      payload: testExistingAisle
    });
  });
  it('handles setNewZone action', () => {
    const testZone = 'Y';
    const setNewZoneResult = setNewZone(testZone);
    expect(setNewZoneResult).toStrictEqual({
      type: SET_NEW_ZONE,
      payload: testZone
    });
  });
  it('handles setAisleSectionCount action', () => {
    const testAisleIndex = 1;
    const testSectionCount = 2;
    const setAisleSectionCountResult = setAisleSectionCount(testAisleIndex, testSectionCount);
    expect(setAisleSectionCountResult).toStrictEqual({
      type: SET_AISLE_SECTION_COUNT,
      payload: {
        aisleIndex: testAisleIndex,
        sectionCount: testSectionCount
      }
    });
  });
  it('handles setPalletIds action', () => {
    const testPalletIds = ['23', '4910'];
    const setPalletIdsResult = setPalletIds(testPalletIds);
    expect(setPalletIdsResult).toStrictEqual({
      type: SET_PALLET_IDS,
      payload: testPalletIds
    });
  });
  it('handles showItemPopup action', () => {
    const showItemPopupResult = showItemPopup();
    expect(showItemPopupResult).toStrictEqual({
      type: SHOW_ITEM_POPUP
    });
  });
  it('handles setPalletIds action', () => {
    const hideItemPopupResult = hideItemPopup();
    expect(hideItemPopupResult).toStrictEqual({
      type: HIDE_ITEM_POPUP
    });
  });
  it('handles setSelectedItem action', () => {
    const testItem = {
      itemNbr: 987654321,
      itemDesc: 'Small, Store Use Item',
      price: 198.00,
      upcNbr: '777555333',
      locationType: 1
    };
    const setSelectedItemResult = setSelectedItem(testItem);
    expect(setSelectedItemResult).toStrictEqual({
      type: SET_SELECTED_ITEM,
      payload: testItem
    });
  });
  it('handles clearSelectedItem action', () => {
    const clearSelectedItemResult = clearSelectedItem();
    expect(clearSelectedItemResult).toStrictEqual({
      type: CLEAR_SELECTED_ITEM
    });
  });
});
