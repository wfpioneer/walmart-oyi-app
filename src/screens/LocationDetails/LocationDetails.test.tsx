import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp, Route } from '@react-navigation/native';
import { LocationDetailsScreen } from './LocationDetails';
import Location from '../../models/Location';

let navigationProp: NavigationProp<any>;
let routeProp: Route<any>;
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
  const defaultItemLocDetails = {
    itemNbr: 0,
    upcNbr: '',
    exceptionType: ''
  };
  const floorLoc: Location[] = [{
    zoneId: 0,
    aisleId: 1,
    sectionId: 1,
    zoneName: 'A',
    aisleName: '1',
    sectionName: '2',
    locationName: 'A1-2',
    type: 'Sales Floor',
    typeNbr: 8
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
    typeNbr: 12
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
    typeNbr: 7
  }];

  describe('Tests for rendering an item\'s Locations:', () => {
    it('Renders a List of Floor & Reserve Locations', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <LocationDetailsScreen
          apiInProgress={false}
          delAPI={defaultAsyncState}
          dispatch={jest.fn()}
          displayConfirmation={false}
          apiError={false}
          floorLocations={floorLoc}
          reserveLocations={reserveLoc}
          itemDetails={defaultItemLocDetails}
          locToConfirm={defaultLocConfirm}
          locationsApi={defaultAsyncState}
          navigation={navigationProp}
          route={routeProp}
          setAPIInProgress={jest.fn()}
          setDisplayConfirmation={jest.fn()}
          setApiError={jest.fn()}
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
          apiInProgress={false}
          delAPI={defaultAsyncState}
          dispatch={jest.fn()}
          displayConfirmation={false}
          apiError={false}
          floorLocations={[]}
          reserveLocations={reserveLoc}
          itemDetails={defaultItemLocDetails}
          locToConfirm={defaultLocConfirm}
          locationsApi={defaultAsyncState}
          navigation={navigationProp}
          route={routeProp}
          setAPIInProgress={jest.fn()}
          setDisplayConfirmation={jest.fn()}
          setApiError={jest.fn()}
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
          apiInProgress={false}
          delAPI={defaultAsyncState}
          dispatch={jest.fn()}
          displayConfirmation={false}
          apiError={false}
          floorLocations={floorLoc}
          reserveLocations={[]}
          itemDetails={defaultItemLocDetails}
          locToConfirm={defaultLocConfirm}
          locationsApi={defaultAsyncState}
          navigation={navigationProp}
          route={routeProp}
          setAPIInProgress={jest.fn()}
          setDisplayConfirmation={jest.fn()}
          setApiError={jest.fn()}
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
          apiInProgress={false}
          delAPI={defaultAsyncState}
          dispatch={jest.fn()}
          displayConfirmation={false}
          apiError={false}
          floorLocations={[]}
          reserveLocations={[]}
          itemDetails={defaultItemLocDetails}
          locToConfirm={defaultLocConfirm}
          locationsApi={defaultAsyncState}
          navigation={navigationProp}
          route={routeProp}
          setAPIInProgress={jest.fn()}
          setDisplayConfirmation={jest.fn()}
          setApiError={jest.fn()}
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
          apiInProgress={false}
          delAPI={delApiIsWaiting}
          dispatch={jest.fn()}
          displayConfirmation={false}
          apiError={false}
          floorLocations={[]}
          reserveLocations={[]}
          itemDetails={defaultItemLocDetails}
          locToConfirm={defaultLocConfirm}
          locationsApi={defaultAsyncState}
          navigation={navigationProp}
          route={routeProp}
          setAPIInProgress={jest.fn()}
          setDisplayConfirmation={jest.fn()}
          setApiError={jest.fn()}
          setLocToConfirm={jest.fn()}
          useEffectHook={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders Delete Location Error \'Retry\' ', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <LocationDetailsScreen
          apiInProgress={false}
          delAPI={defaultAsyncState}
          dispatch={jest.fn()}
          displayConfirmation={false}
          apiError={true}
          floorLocations={[]}
          reserveLocations={[]}
          itemDetails={defaultItemLocDetails}
          locToConfirm={defaultLocConfirm}
          locationsApi={defaultAsyncState}
          navigation={navigationProp}
          route={routeProp}
          setAPIInProgress={jest.fn()}
          setDisplayConfirmation={jest.fn()}
          setApiError={jest.fn()}
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
          apiInProgress={false}
          delAPI={defaultAsyncState}
          dispatch={jest.fn()}
          displayConfirmation={false}
          apiError={false}
          floorLocations={[]}
          reserveLocations={[]}
          itemDetails={defaultItemLocDetails}
          locToConfirm={locationConfirm}
          locationsApi={defaultAsyncState}
          navigation={navigationProp}
          route={routeProp}
          setAPIInProgress={jest.fn()}
          setDisplayConfirmation={jest.fn()}
          setApiError={jest.fn()}
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
          apiInProgress={false}
          delAPI={defaultAsyncState}
          dispatch={jest.fn()}
          displayConfirmation={showConfirmationModal}
          apiError={false}
          floorLocations={[]}
          reserveLocations={[]}
          itemDetails={defaultItemLocDetails}
          locToConfirm={defaultLocConfirm}
          locationsApi={defaultAsyncState}
          navigation={navigationProp}
          route={routeProp}
          setAPIInProgress={jest.fn()}
          setDisplayConfirmation={jest.fn()}
          setApiError={jest.fn()}
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
          apiInProgress={false}
          delAPI={defaultAsyncState}
          dispatch={jest.fn()}
          displayConfirmation={false}
          apiError={false}
          floorLocations={[]}
          reserveLocations={[]}
          itemDetails={defaultItemLocDetails}
          locToConfirm={defaultLocConfirm}
          locationsApi={getLocationIsWaiting}
          navigation={navigationProp}
          route={routeProp}
          setAPIInProgress={jest.fn()}
          setDisplayConfirmation={jest.fn()}
          setApiError={jest.fn()}
          setLocToConfirm={jest.fn()}
          useEffectHook={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
