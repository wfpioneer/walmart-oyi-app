/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  NavigationContainer,
  NavigationProp,
  RouteProp
} from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import {
  LocationProps,
  LocationTabsNavigator,
  TabHeader
} from './LocationTabNavigator';
import {
  mockLocationDetails,
  mockLocationDetailsEmpty,
  mockLocationDetailsLargeLocationCount
} from '../../mockData/locationDetails';
import { barcodeEmitter } from '../../utils/scannerUtils';
import store from '../../state';
import { AsyncState } from '../../models/AsyncState';
import { LocationIdName } from '../../state/reducers/Location';

let navigationProp: NavigationProp<any>;
const routeProp: RouteProp<any, string> = {
  key: '',
  name: 'LocationTab'
};

const defaultScannedEvent = {
  type: undefined,
  value: undefined
};

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
      addListener: jest.fn()
    })
  };
});
const mockValidateSession = jest
  .fn()
  .mockImplementation(() => new Promise<void>(resolve => resolve()));

afterEach(() => {
  jest.clearAllMocks();
});

describe('Test Location Tabs', (): void => {
  const defaultAsyncState: AsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  };
  const defaultSection: LocationIdName = {
    id: 0,
    name: '0'
  };
  it('Renders Location Tabs with Mock Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    const {
      items, pallets, zone, aisle, section
    } = mockLocationDetails;
    renderer.render(
      <LocationTabsNavigator
        floorItems={items.sectionItems}
        reserveItems={pallets.palletData}
        locationName={`${zone.name}${aisle.name}-${section.name}`}
        dispatch={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        scannedEvent={defaultScannedEvent}
        trackEventCall={jest.fn()}
        useEffectHook={jest.fn()}
        validateSessionCall={jest.fn()}
        isManualScanEnabled={false}
        locationPopupVisible={false}
        userFeatures={[]}
        itemPopupVisible={false}
        sectionResult={null}
        section={defaultSection}
        removeSectionApi={defaultAsyncState}
        displayConfirmation={false}
        setDisplayConfirmation={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders Location Tabs with Mock Empty Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    const {
      items, pallets, zone, aisle, section
    } = mockLocationDetailsEmpty;
    renderer.render(
      <LocationTabsNavigator
        floorItems={items.sectionItems}
        reserveItems={pallets.palletData}
        locationName={`${zone.name}${aisle.name}-${section.name}`}
        dispatch={jest.fn()}
        locationPopupVisible={false}
        navigation={navigationProp}
        route={routeProp}
        scannedEvent={defaultScannedEvent}
        trackEventCall={jest.fn()}
        useEffectHook={jest.fn()}
        validateSessionCall={jest.fn()}
        isManualScanEnabled={false}
        userFeatures={[]}
        itemPopupVisible={false}
        sectionResult={null}
        section={defaultSection}
        removeSectionApi={defaultAsyncState}
        displayConfirmation={false}
        setDisplayConfirmation={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders Location Tabs with Mock Large Location Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    const {
      items, pallets, zone, aisle, section
    } = mockLocationDetailsLargeLocationCount;
    renderer.render(
      <LocationTabsNavigator
        floorItems={items.sectionItems}
        reserveItems={pallets.palletData}
        locationName={`${zone.name}${aisle.name}-${section.name}`}
        dispatch={jest.fn()}
        locationPopupVisible={false}
        navigation={navigationProp}
        route={routeProp}
        scannedEvent={defaultScannedEvent}
        trackEventCall={jest.fn()}
        useEffectHook={jest.fn()}
        validateSessionCall={jest.fn()}
        isManualScanEnabled={false}
        userFeatures={[]}
        itemPopupVisible={false}
        sectionResult={null}
        section={defaultSection}
        removeSectionApi={defaultAsyncState}
        displayConfirmation={false}
        setDisplayConfirmation={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders Manual Scan Component when isManualScanEnabled is set to true', () => {
    const renderer = ShallowRenderer.createRenderer();
    const {
      items, pallets, zone, aisle, section
    } = mockLocationDetails;
    renderer.render(
      <LocationTabsNavigator
        floorItems={items.sectionItems}
        reserveItems={pallets.palletData}
        locationName={`${zone.name}${aisle.name}-${section.name}`}
        dispatch={jest.fn()}
        locationPopupVisible={false}
        navigation={navigationProp}
        route={routeProp}
        scannedEvent={defaultScannedEvent}
        trackEventCall={jest.fn()}
        useEffectHook={jest.fn()}
        validateSessionCall={jest.fn()}
        isManualScanEnabled={true}
        userFeatures={[]}
        itemPopupVisible={false}
        sectionResult={null}
        section={defaultSection}
        removeSectionApi={defaultAsyncState}
        displayConfirmation={false}
        setDisplayConfirmation={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders Location header as Scanned Event Value when location name is "-"', (): void => {
    const renderer = ShallowRenderer.createRenderer();
    const { items, pallets } = mockLocationDetails;
    const mockScannedEvent = {
      type: 'Test',
      value: 'SCAN1-1'
    };
    renderer.render(
      <LocationTabsNavigator
        floorItems={items.sectionItems}
        reserveItems={pallets.palletData}
        locationName="-"
        dispatch={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        scannedEvent={mockScannedEvent}
        trackEventCall={jest.fn()}
        useEffectHook={jest.fn()}
        validateSessionCall={jest.fn()}
        isManualScanEnabled={true}
        locationPopupVisible={false}
        userFeatures={[]}
        itemPopupVisible={false}
        sectionResult={null}
        section={defaultSection}
        removeSectionApi={defaultAsyncState}
        displayConfirmation={false}
        setDisplayConfirmation={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders Print Label button if "location printing" feature is enabled', (): void => {
    const renderer = ShallowRenderer.createRenderer();
    const { items, pallets } = mockLocationDetails;
    renderer.render(
      <LocationTabsNavigator
        floorItems={items.sectionItems}
        reserveItems={pallets.palletData}
        locationName="-"
        dispatch={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        scannedEvent={defaultScannedEvent}
        trackEventCall={jest.fn()}
        useEffectHook={jest.fn()}
        validateSessionCall={jest.fn()}
        isManualScanEnabled={true}
        locationPopupVisible={false}
        userFeatures={['location printing']}
        itemPopupVisible={false}
        sectionResult={null}
        section={defaultSection}
        removeSectionApi={defaultAsyncState}
        displayConfirmation={false}
        setDisplayConfirmation={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  describe('Tests rendering removeSectionModal', () => {
    it('Renders Loading Indicator for Remove Section Modal', (): void => {
      const renderer = ShallowRenderer.createRenderer();
      const deleteSectionIsWaiting: AsyncState = {
        isWaiting: true,
        value: null,
        error: null,
        result: null
      };
      renderer.render(
        <LocationTabsNavigator
          floorItems={[]}
          reserveItems={[]}
          locationName="-"
          dispatch={jest.fn()}
          navigation={navigationProp}
          route={routeProp}
          scannedEvent={defaultScannedEvent}
          trackEventCall={jest.fn()}
          useEffectHook={jest.fn()}
          validateSessionCall={jest.fn()}
          isManualScanEnabled={true}
          locationPopupVisible={false}
          userFeatures={['']}
          itemPopupVisible={false}
          sectionResult={null}
          section={defaultSection}
          removeSectionApi={deleteSectionIsWaiting}
          displayConfirmation={true}
          setDisplayConfirmation={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders Retry button on Modal if remove section api returns an error', (): void => {
      const renderer = ShallowRenderer.createRenderer();
      const deleteSectionError: AsyncState = {
        isWaiting: true,
        value: null,
        error: 'Network Error',
        result: null
      };
      renderer.render(
        <LocationTabsNavigator
          floorItems={[]}
          reserveItems={[]}
          locationName="-"
          dispatch={jest.fn()}
          navigation={navigationProp}
          route={routeProp}
          scannedEvent={defaultScannedEvent}
          trackEventCall={jest.fn()}
          useEffectHook={jest.fn()}
          validateSessionCall={jest.fn()}
          isManualScanEnabled={true}
          locationPopupVisible={false}
          userFeatures={['']}
          itemPopupVisible={false}
          sectionResult={null}
          section={defaultSection}
          removeSectionApi={deleteSectionError}
          displayConfirmation={true}
          setDisplayConfirmation={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests rendering Tab Headers', () => {
    it('Renders items Header', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <TabHeader
          headerText="ITEMS"
          isReserve={false}
          isEditEnabled={true}
          isDisabled={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders pallet Header', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <TabHeader
          headerText="PALLETS"
          isReserve={true}
          isEditEnabled={true}
          isDisabled={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  // TODO Fix unmounted component no-op error for testing useEffect Hook
  describe.skip('Tests calling UseEffect Hook', () => {
    it('Tests ValidateSessionCall with updates to scannedEvent and navigation props', () => {
      const mockNav = jest.requireMock('@react-navigation/native');
      const tabProps: LocationProps = {
        floorItems: [],
        reserveItems: [],
        locationName: '-',
        dispatch: jest.fn(),
        locationPopupVisible: false,
        navigation: navigationProp,
        route: routeProp,
        scannedEvent: defaultScannedEvent,
        trackEventCall: jest.fn(),
        useEffectHook: useEffect,
        validateSessionCall: mockValidateSession,
        isManualScanEnabled: false,
        userFeatures: [],
        itemPopupVisible: false,
        sectionResult: null,
        section: defaultSection,
        removeSectionApi: defaultAsyncState,
        displayConfirmation: false,
        setDisplayConfirmation: jest.fn()
      };
      const scannedEventUpdate = {
        type: 'manualscan',
        value: 'A1-1'
      };

      const { update } = render(
        <Provider store={store}>
          <NavigationContainer>
            <LocationTabsNavigator {...tabProps} />
          </NavigationContainer>
        </Provider>
      );
      expect(mockValidateSession).toBeCalledTimes(1);

      update(
        <Provider store={store}>
          <NavigationContainer>
            <LocationTabsNavigator
              {...tabProps}
              scannedEvent={scannedEventUpdate}
            />
          </NavigationContainer>
        </Provider>
      );
      expect(mockValidateSession).toBeCalledTimes(2);

      update(
        <Provider store={store}>
          <NavigationContainer>
            <LocationTabsNavigator
              {...tabProps}
              scannedEvent={scannedEventUpdate}
              navigation={mockNav}
            />
          </NavigationContainer>
        </Provider>
      );
      expect(mockValidateSession).toBeCalledTimes(3);
    });

    it('Test if barcodeEmitter is called with "scanned" event', () => {
      const mockNavFocused = {
        ...jest.requireMock('@react-navigation/native'),
        isFocused: jest.fn(() => true)
      };

      jest.spyOn(barcodeEmitter, 'addListener');
      barcodeEmitter.addListener = jest
        .fn()
        .mockImplementation((event, callback) => {
          callback();
          return {
            remove: jest.fn()
          };
        });

      render(
        <Provider store={store}>
          <NavigationContainer>
            <LocationTabsNavigator
              floorItems={[]}
              reserveItems={[]}
              locationName="-"
              dispatch={jest.fn()}
              locationPopupVisible={false}
              navigation={mockNavFocused}
              route={routeProp}
              scannedEvent={defaultScannedEvent}
              trackEventCall={jest.fn()}
              useEffectHook={useEffect}
              validateSessionCall={mockValidateSession}
              isManualScanEnabled={false}
              userFeatures={[]}
              itemPopupVisible={false}
              sectionResult={null}
              section={defaultSection}
              removeSectionApi={defaultAsyncState}
              displayConfirmation={false}
              setDisplayConfirmation={jest.fn()}
            />
          </NavigationContainer>
        </Provider>
      );
      expect(barcodeEmitter.addListener).toBeCalledWith(
        'scanned',
        expect.any(Function)
      );
      expect(mockValidateSession).toBeCalledTimes(2);
    });
  });
});
