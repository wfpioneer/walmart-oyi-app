import { NavigationProp, Route } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { strings } from '../../locales';
import { LOCATION_TYPES, SelectLocationTypeScreen, validateLocation } from './SelectLocationType';

let navigationProp: NavigationProp<any>;
describe('SelectLocationTypeScreen', () => {
  const defaultError = {
    error: false,
    message: ''
  };
  const defaultAsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  };
  const defaultItemLocDetails = {
    itemNbr: 0,
    upcNbr: '',
    exceptionType: ''
  };
  const defaultRoute: Route<any> = { key: '', name: 'AddLocation' };
  describe('Tests rendering the SelectLocationType Screen', () => {
    it('Renders the SALES FLOOR location type as "Checked" ', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <SelectLocationTypeScreen
          locType={LOCATION_TYPES.SALES_FLOOR}
          setLocType={jest.fn()}
          inputLocation={false}
          setInputLocation={jest.fn()}
          loc=""
          setLoc={jest.fn()}
          scanType=""
          setScanType={jest.fn()}
          error={defaultError}
          setError={jest.fn()}
          apiStart={0}
          setApiStart={jest.fn()}
          addAPI={defaultAsyncState}
          editAPI={defaultAsyncState}
          floorLocations={[]}
          itemLocDetails={defaultItemLocDetails}
          actionCompleted={false}
          route={defaultRoute}
          navigation={navigationProp}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders the DISPLAY location type as "Checked" ', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <SelectLocationTypeScreen
          locType={LOCATION_TYPES.DISPLAY}
          setLocType={jest.fn()}
          inputLocation={false}
          setInputLocation={jest.fn()}
          loc=""
          setLoc={jest.fn()}
          scanType=""
          setScanType={jest.fn()}
          error={defaultError}
          setError={jest.fn()}
          apiStart={0}
          setApiStart={jest.fn()}
          addAPI={defaultAsyncState}
          editAPI={defaultAsyncState}
          floorLocations={[]}
          itemLocDetails={defaultItemLocDetails}
          actionCompleted={false}
          route={defaultRoute}
          navigation={navigationProp}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders the END CAP location type as "Checked"', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <SelectLocationTypeScreen
          locType={LOCATION_TYPES.END_CAP}
          setLocType={jest.fn()}
          inputLocation={false}
          setInputLocation={jest.fn()}
          loc=""
          setLoc={jest.fn()}
          scanType=""
          setScanType={jest.fn()}
          error={defaultError}
          setError={jest.fn()}
          apiStart={0}
          setApiStart={jest.fn()}
          addAPI={defaultAsyncState}
          editAPI={defaultAsyncState}
          floorLocations={[]}
          itemLocDetails={defaultItemLocDetails}
          actionCompleted={false}
          route={defaultRoute}
          navigation={navigationProp}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders the POD location type as "Checked" ', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <SelectLocationTypeScreen
          locType={LOCATION_TYPES.POD}
          setLocType={jest.fn()}
          inputLocation={false}
          setInputLocation={jest.fn()}
          loc=""
          setLoc={jest.fn()}
          scanType=""
          setScanType={jest.fn()}
          error={defaultError}
          setError={jest.fn()}
          apiStart={0}
          setApiStart={jest.fn()}
          addAPI={defaultAsyncState}
          editAPI={defaultAsyncState}
          floorLocations={[]}
          itemLocDetails={defaultItemLocDetails}
          actionCompleted={false}
          route={defaultRoute}
          navigation={navigationProp}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders the EnterLocation Modal as visible ', () => {
      const renderer = ShallowRenderer.createRenderer();
      const inputLocation = true;
      renderer.render(
        <SelectLocationTypeScreen
          locType={LOCATION_TYPES.SALES_FLOOR}
          setLocType={jest.fn()}
          inputLocation={inputLocation}
          setInputLocation={jest.fn()}
          loc=""
          setLoc={jest.fn()}
          scanType=""
          setScanType={jest.fn()}
          error={defaultError}
          setError={jest.fn()}
          apiStart={0}
          setApiStart={jest.fn()}
          addAPI={defaultAsyncState}
          editAPI={defaultAsyncState}
          floorLocations={[]}
          itemLocDetails={defaultItemLocDetails}
          actionCompleted={false}
          route={defaultRoute}
          navigation={navigationProp}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders Location Name above manual location enter', () => {
      const renderer = ShallowRenderer.createRenderer();
      const locationName = "TestLocation-3"
      renderer.render(
        <SelectLocationTypeScreen
          locType={LOCATION_TYPES.SALES_FLOOR}
          setLocType={jest.fn()}
          inputLocation={false}
          setInputLocation={jest.fn()}
          loc={locationName}
          setLoc={jest.fn()}
          scanType=""
          setScanType={jest.fn()}
          error={defaultError}
          setError={jest.fn()}
          apiStart={0}
          setApiStart={jest.fn()}
          addAPI={defaultAsyncState}
          editAPI={defaultAsyncState}
          floorLocations={[]}
          itemLocDetails={defaultItemLocDetails}
          actionCompleted={false}
          route={defaultRoute}
          navigation={navigationProp}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests rendering Add/Edit location API responses', () => {
    const apiIsWaiting = {
      isWaiting: true,
      value: null,
      error: null,
      result: null
    };
    it('Renders the Activity indicator when waiting for response from AddLocation Api', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <SelectLocationTypeScreen
          locType={LOCATION_TYPES.SALES_FLOOR}
          setLocType={jest.fn()}
          inputLocation={false}
          setInputLocation={jest.fn()}
          loc=""
          setLoc={jest.fn()}
          scanType=""
          setScanType={jest.fn()}
          error={defaultError}
          setError={jest.fn()}
          apiStart={0}
          setApiStart={jest.fn()}
          addAPI={apiIsWaiting}
          editAPI={defaultAsyncState}
          floorLocations={[]}
          itemLocDetails={defaultItemLocDetails}
          actionCompleted={false}
          route={defaultRoute}
          navigation={navigationProp}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders the Activity indicator when waiting for response from EditLocation Api', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <SelectLocationTypeScreen
          locType={LOCATION_TYPES.SALES_FLOOR}
          setLocType={jest.fn()}
          inputLocation={false}
          setInputLocation={jest.fn()}
          loc=""
          setLoc={jest.fn()}
          scanType=""
          setScanType={jest.fn()}
          error={defaultError}
          setError={jest.fn()}
          apiStart={0}
          setApiStart={jest.fn()}
          addAPI={defaultAsyncState}
          editAPI={apiIsWaiting}
          floorLocations={[]}
          itemLocDetails={defaultItemLocDetails}
          actionCompleted={false}
          route={defaultRoute}
          navigation={navigationProp}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders Error Message on location api error', () => {
      const renderer = ShallowRenderer.createRenderer();
      const locationError = {
        error: true,
        message: strings('LOCATION.ADD_LOCATION_API_ERROR')
      };
      renderer.render(
        <SelectLocationTypeScreen
          locType={LOCATION_TYPES.SALES_FLOOR}
          setLocType={jest.fn()}
          inputLocation={false}
          setInputLocation={jest.fn()}
          loc=""
          setLoc={jest.fn()}
          scanType=""
          setScanType={jest.fn()}
          error={locationError}
          setError={jest.fn()}
          apiStart={0}
          setApiStart={jest.fn()}
          addAPI={defaultAsyncState}
          editAPI={defaultAsyncState}
          floorLocations={[]}
          itemLocDetails={defaultItemLocDetails}
          actionCompleted={false}
          route={defaultRoute}
          navigation={navigationProp}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests Location Validation', () => {
    const locationName = 'TestLocation-3'
    it('validateLocation returns false for invalid location name', () => {
      const noLocationName = validateLocation('', LOCATION_TYPES.DISPLAY);
      expect(noLocationName).toBe(false);
    });
    it('validateLocation returns false for invalid location type', () => {
      const noLocationType = validateLocation(locationName, '');
      expect(noLocationType).toBe(false);
    });

    it('validateLocation returns false for invalid location name & location type', () => {
      const invalidLocation = validateLocation('', '');
      expect(invalidLocation).toBe(false);
    });
    it('validateLocation returns true for valid location name & all location types', () => {
      const validLocationSalesFloor = validateLocation(locationName, LOCATION_TYPES.SALES_FLOOR);
      expect(validLocationSalesFloor).toBe(true);

      const validLocationDisplay = validateLocation(locationName, LOCATION_TYPES.DISPLAY);
      expect(validLocationDisplay).toBe(true);

      const validLocationEndCap = validateLocation(locationName, LOCATION_TYPES.END_CAP);
      expect(validLocationEndCap).toBe(true);
      
      const validLocationPod = validateLocation(locationName, LOCATION_TYPES.POD);
      expect(validLocationPod).toBe(true);
    });
  });
});
