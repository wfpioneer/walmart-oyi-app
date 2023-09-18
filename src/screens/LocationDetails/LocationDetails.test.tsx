import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp, Route } from '@react-navigation/native';
import { LocationDetailsScreen, getLocationsApiHook, getLocationsV1ApiHook } from './LocationDetails';
import Location from '../../models/Location';
import { AsyncState } from '../../models/AsyncState';

let navigationProp: NavigationProp<any>;
let routeProp: Route<any>;
const mockDispatch = jest.fn();
describe('LocationDetailsScreen', () => {
  const defaultAsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  };
  const defaultLocConfirm = {
    locationName: '',
    locationArea: '',
    locationIndex: -1,
    locationTypeNbr: -1
  };

  const defaultItemNbr = 0;
  const defaultUpcNbr = '';
  const defaultExceptionType = '';

  const floorLoc: Location[] = [{
    zoneId: 0,
    aisleId: 1,
    sectionId: 1,
    zoneName: 'A',
    aisleName: '1',
    sectionName: '2',
    locationName: 'A1-2',
    type: 'Sales Floor',
    typeNbr: 8,
    newQty: 0
  },
  {
    zoneId: 0,
    aisleId: 0,
    sectionId: 2,
    zoneName: 'A',
    aisleName: '1',
    sectionName: '2',
    locationName: 'A1-3',
    type: 'End Cap',
    typeNbr: 12,
    newQty: 0
  }];
  const reserveLoc: Location[] = [{
    zoneId: 0,
    aisleId: 1,
    sectionId: 1,
    zoneName: 'A',
    aisleName: '1',
    sectionName: '1',
    locationName: 'A1-1',
    type: 'Reserve',
    typeNbr: 7,
    newQty: 0
  }];

  describe('Tests for rendering an item\'s Locations:', () => {
    it('Renders a List of Floor & Reserve Locations', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <LocationDetailsScreen
          delAPI={defaultAsyncState}
          dispatch={jest.fn()}
          displayConfirmation={false}
          floorLocations={floorLoc}
          reserveLocations={reserveLoc}
          itemNbr={defaultItemNbr}
          upcNbr={defaultUpcNbr}
          locToConfirm={defaultLocConfirm}
          locationsApi={defaultAsyncState}
          locationsV1Api={defaultAsyncState}
          navigation={navigationProp}
          route={routeProp}
          setDisplayConfirmation={jest.fn()}
          setLocToConfirm={jest.fn()}
          useEffectHook={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders a List of (1) Reserve location with (0) Floor locations', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <LocationDetailsScreen
          delAPI={defaultAsyncState}
          dispatch={jest.fn()}
          displayConfirmation={false}
          floorLocations={[]}
          reserveLocations={reserveLoc}
          itemNbr={defaultItemNbr}
          upcNbr={defaultUpcNbr}
          locToConfirm={defaultLocConfirm}
          locationsApi={defaultAsyncState}
          locationsV1Api={defaultAsyncState}
          navigation={navigationProp}
          route={routeProp}
          setDisplayConfirmation={jest.fn()}
          setLocToConfirm={jest.fn()}
          useEffectHook={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders a List of (2) Floor locations with (0) Reserve locations', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <LocationDetailsScreen
          delAPI={defaultAsyncState}
          dispatch={jest.fn()}
          displayConfirmation={false}
          floorLocations={floorLoc}
          reserveLocations={[]}
          itemNbr={defaultItemNbr}
          upcNbr={defaultUpcNbr}
          locToConfirm={defaultLocConfirm}
          locationsApi={defaultAsyncState}
          locationsV1Api={defaultAsyncState}
          navigation={navigationProp}
          route={routeProp}
          setDisplayConfirmation={jest.fn()}
          setLocToConfirm={jest.fn()}
          useEffectHook={jest.fn()}

        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders a default of (0) Floor & Reserve Locations', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <LocationDetailsScreen
          delAPI={defaultAsyncState}
          dispatch={jest.fn()}
          displayConfirmation={false}
          floorLocations={[]}
          reserveLocations={[]}
          itemNbr={defaultItemNbr}
          upcNbr={defaultUpcNbr}
          locToConfirm={defaultLocConfirm}
          locationsApi={defaultAsyncState}
          locationsV1Api={defaultAsyncState}
          navigation={navigationProp}
          route={routeProp}
          setDisplayConfirmation={jest.fn()}
          setLocToConfirm={jest.fn()}
          useEffectHook={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests Locations Api Async State:', () => {
    it('Renders Loader when waiting for a response to Delete a Location', () => {
      const delApiIsWaiting = {
        isWaiting: true,
        error: null,
        result: null,
        value: null
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <LocationDetailsScreen
          delAPI={delApiIsWaiting}
          dispatch={jest.fn()}
          displayConfirmation={false}
          floorLocations={[]}
          reserveLocations={[]}
          itemNbr={defaultItemNbr}
          upcNbr={defaultUpcNbr}
          locToConfirm={defaultLocConfirm}
          locationsApi={defaultAsyncState}
          locationsV1Api={defaultAsyncState}
          navigation={navigationProp}
          route={routeProp}
          setDisplayConfirmation={jest.fn()}
          setLocToConfirm={jest.fn()}
          useEffectHook={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders Delete Location Error \'Retry\' ', () => {
      const renderer = ShallowRenderer.createRenderer();
      const deleteLocationError: AsyncState = {
        isWaiting: false,
        value: null,
        error: ' Network Error ',
        result: null
      };
      renderer.render(
        <LocationDetailsScreen
          delAPI={deleteLocationError}
          dispatch={jest.fn()}
          displayConfirmation={false}
          floorLocations={[]}
          reserveLocations={[]}
          itemNbr={defaultItemNbr}
          upcNbr={defaultUpcNbr}
          locToConfirm={defaultLocConfirm}
          locationsApi={defaultAsyncState}
          locationsV1Api={defaultAsyncState}
          navigation={navigationProp}
          route={routeProp}
          setDisplayConfirmation={jest.fn()}
          setLocToConfirm={jest.fn()}
          useEffectHook={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders Delete Location Confirmation with Location Name ', () => {
      const locationConfirm = {
        locationName: 'A1-1',
        locationArea: 'floor',
        locationIndex: 0,
        locationTypeNbr: 8
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <LocationDetailsScreen
          delAPI={defaultAsyncState}
          dispatch={jest.fn()}
          displayConfirmation={false}
          floorLocations={[]}
          reserveLocations={[]}
          itemNbr={defaultItemNbr}
          upcNbr={defaultUpcNbr}
          locToConfirm={locationConfirm}
          locationsApi={defaultAsyncState}
          locationsV1Api={defaultAsyncState}
          navigation={navigationProp}
          route={routeProp}
          setDisplayConfirmation={jest.fn()}
          setLocToConfirm={jest.fn()}
          useEffectHook={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders the Delete Confirmation Modal (isVisible should be set to true)', () => {
      const showConfirmationModal = true;
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <LocationDetailsScreen
          delAPI={defaultAsyncState}
          dispatch={jest.fn()}
          displayConfirmation={showConfirmationModal}
          floorLocations={[]}
          reserveLocations={[]}
          itemNbr={defaultItemNbr}
          upcNbr={defaultUpcNbr}
          locToConfirm={defaultLocConfirm}
          locationsApi={defaultAsyncState}
          locationsV1Api={defaultAsyncState}
          navigation={navigationProp}
          route={routeProp}
          setDisplayConfirmation={jest.fn()}
          setLocToConfirm={jest.fn()}
          useEffectHook={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders Loader when waiting for a response from getLocation', () => {
      const getLocationIsWaiting = {
        isWaiting: true,
        error: null,
        result: null,
        value: null
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <LocationDetailsScreen
          delAPI={defaultAsyncState}
          dispatch={jest.fn()}
          displayConfirmation={false}
          floorLocations={[]}
          reserveLocations={[]}
          itemNbr={defaultItemNbr}
          upcNbr={defaultUpcNbr}
          locToConfirm={defaultLocConfirm}
          locationsApi={getLocationIsWaiting}
          locationsV1Api={defaultAsyncState}
          navigation={navigationProp}
          route={routeProp}
          setDisplayConfirmation={jest.fn()}
          setLocToConfirm={jest.fn()}
          useEffectHook={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders Loader when waiting for a response from getLocationV1', () => {
      const getLocationIsWaiting = {
        isWaiting: true,
        error: null,
        result: null,
        value: null
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <LocationDetailsScreen
          delAPI={defaultAsyncState}
          dispatch={jest.fn()}
          displayConfirmation={false}
          floorLocations={[]}
          reserveLocations={[]}
          itemNbr={defaultItemNbr}
          upcNbr={defaultUpcNbr}
          locToConfirm={defaultLocConfirm}
          locationsApi={defaultAsyncState}
          locationsV1Api={getLocationIsWaiting}
          navigation={navigationProp}
          route={routeProp}
          setDisplayConfirmation={jest.fn()}
          setLocToConfirm={jest.fn()}
          useEffectHook={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('external function tests', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Tests get item locations api hook success with correct item number', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        value: 1,
        result: {
          data: {
            location: {
              floor: [],
              reserve: []
            }
          }
        }
      };

      getLocationsApiHook(successApi, mockDispatch);
      expect(mockDispatch).toHaveBeenCalledWith(expect
        .objectContaining({ type: 'ITEM_DETAILS_SCREEN/SET_FLOOR_LOCATIONS' }));
      expect(mockDispatch).toHaveBeenCalledWith(expect
        .objectContaining({ type: 'ITEM_DETAILS_SCREEN/SET_RESERVE_LOCATIONS' }));
    });

    it('Tests get item locations v1 api hook success with correct item number', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        value: 1,
        result: {
          data: {
            salesFloorLocation: [],
            reserveLocation: []
          }
        }
      };

      getLocationsV1ApiHook(successApi, mockDispatch);
      expect(mockDispatch).toHaveBeenCalledWith(expect
        .objectContaining({ type: 'ITEM_DETAILS_SCREEN/SET_FLOOR_LOCATIONS' }));
      expect(mockDispatch).toHaveBeenCalledWith(expect
        .objectContaining({ type: 'ITEM_DETAILS_SCREEN/SET_RESERVE_LOCATIONS' }));
    });
  })
});
