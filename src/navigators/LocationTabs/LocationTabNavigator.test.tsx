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
import Toast from 'react-native-toast-message';
import {
  LocationProps,
  LocationTabsNavigator,
  TabHeader,
  clearSectionApiEffect,
  getSectionDetailsEffect,
  handleClearModalClose,
  handleClearSection,
  removeSectionApiEffect
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
import { ClearLocationTarget } from '../../models/Location';
import User from '../../models/User';
import { REMOVE_SECTION } from '../../state/actions/asyncAPI';
import { HIDE_LOCATION_POPUP } from '../../state/actions/Location';
import { mockConfig } from '../../mockData/mockConfig';

const REACT_NAV_NATIVE = '@react-navigation/native';

let navigationProp: NavigationProp<any>;
const routeProp: RouteProp<any, string> = {
  key: '',
  name: 'LocationTab'
};

const defaultScannedEvent = {
  type: null,
  value: null
};

const mockNavigate = jest.fn();
const mockIsFocused = jest.fn(() => true);
jest.mock(REACT_NAV_NATIVE, () => {
  const actualNav = jest.requireActual(REACT_NAV_NATIVE);
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
      isFocused: mockIsFocused,
      addListener: jest.fn()
    })
  };
});
const mockValidateSession = jest
  .fn()
  .mockImplementation(() => Promise.resolve());

afterEach(() => {
  jest.clearAllMocks();
});

const user: User = {
  userId: 'vn50pz4',
  additional: {
    clockCheckResult: 'yo',
    displayName: 'Kyle Welch',
    loginId: 'vn50pz4',
    mailId: 'vn50pz4@homeoffice.wal-mart.com'
  },
  configs: mockConfig,
  countryCode: 'CN',
  domain: 'Homeoffice',
  features: [],
  siteId: 5597,
  token: 'gibberish'
};

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
  const successApi: AsyncState = {
    ...defaultAsyncState,
    result: mockLocationDetails
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
        user={user}
        itemPopupVisible={false}
        getSectionDetailsApi={successApi}
        section={defaultSection}
        removeSectionApi={defaultAsyncState}
        displayRemoveConfirmation={false}
        setDisplayRemoveConfirmation={jest.fn()}
        clearSectionApi={defaultAsyncState}
        displayClearConfirmation={false}
        setDisplayClearConfirmation={jest.fn()}
        selectedTab={ClearLocationTarget.FLOOR}
        setSelectedTab={jest.fn()}
        activityModal={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders Location Tabs with Mock Empty Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    const {
      items, pallets, zone, aisle, section
    } = mockLocationDetailsEmpty;
    const emptyApi: AsyncState = {
      ...defaultAsyncState,
      result: mockLocationDetailsEmpty
    };
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
        user={user}
        itemPopupVisible={false}
        getSectionDetailsApi={emptyApi}
        section={defaultSection}
        removeSectionApi={defaultAsyncState}
        displayRemoveConfirmation={false}
        setDisplayRemoveConfirmation={jest.fn()}
        clearSectionApi={defaultAsyncState}
        displayClearConfirmation={false}
        setDisplayClearConfirmation={jest.fn()}
        selectedTab={ClearLocationTarget.FLOOR}
        setSelectedTab={jest.fn()}
        activityModal={false}
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
        user={user}
        itemPopupVisible={false}
        getSectionDetailsApi={successApi}
        section={defaultSection}
        removeSectionApi={defaultAsyncState}
        displayRemoveConfirmation={false}
        setDisplayRemoveConfirmation={jest.fn()}
        clearSectionApi={defaultAsyncState}
        displayClearConfirmation={false}
        setDisplayClearConfirmation={jest.fn()}
        selectedTab={ClearLocationTarget.FLOOR}
        setSelectedTab={jest.fn()}
        activityModal={false}
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
        user={user}
        itemPopupVisible={false}
        getSectionDetailsApi={successApi}
        section={defaultSection}
        removeSectionApi={defaultAsyncState}
        displayRemoveConfirmation={false}
        setDisplayRemoveConfirmation={jest.fn()}
        clearSectionApi={defaultAsyncState}
        displayClearConfirmation={false}
        setDisplayClearConfirmation={jest.fn()}
        selectedTab={ClearLocationTarget.FLOOR}
        setSelectedTab={jest.fn()}
        activityModal={false}
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
        user={user}
        itemPopupVisible={false}
        getSectionDetailsApi={successApi}
        section={defaultSection}
        removeSectionApi={defaultAsyncState}
        displayRemoveConfirmation={false}
        setDisplayRemoveConfirmation={jest.fn()}
        clearSectionApi={defaultAsyncState}
        displayClearConfirmation={false}
        setDisplayClearConfirmation={jest.fn()}
        selectedTab={ClearLocationTarget.FLOOR}
        setSelectedTab={jest.fn()}
        activityModal={false}
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
        user={{ ...user, features: ['location management edit'] }}
        itemPopupVisible={false}
        getSectionDetailsApi={successApi}
        section={defaultSection}
        removeSectionApi={defaultAsyncState}
        displayRemoveConfirmation={false}
        setDisplayRemoveConfirmation={jest.fn()}
        clearSectionApi={defaultAsyncState}
        displayClearConfirmation={false}
        setDisplayClearConfirmation={jest.fn()}
        selectedTab={ClearLocationTarget.FLOOR}
        setSelectedTab={jest.fn()}
        activityModal={false}
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
          user={user}
          itemPopupVisible={false}
          getSectionDetailsApi={successApi}
          section={defaultSection}
          removeSectionApi={deleteSectionIsWaiting}
          displayRemoveConfirmation={true}
          setDisplayRemoveConfirmation={jest.fn()}
          clearSectionApi={defaultAsyncState}
          displayClearConfirmation={false}
          setDisplayClearConfirmation={jest.fn()}
          selectedTab={ClearLocationTarget.FLOOR}
          setSelectedTab={jest.fn()}
          activityModal={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders Retry button on Modal if remove section api returns an error', (): void => {
      const renderer = ShallowRenderer.createRenderer();
      const deleteSectionError: AsyncState = {
        isWaiting: false,
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
          user={user}
          itemPopupVisible={false}
          getSectionDetailsApi={successApi}
          section={defaultSection}
          removeSectionApi={deleteSectionError}
          displayRemoveConfirmation={true}
          setDisplayRemoveConfirmation={jest.fn()}
          clearSectionApi={defaultAsyncState}
          displayClearConfirmation={false}
          setDisplayClearConfirmation={jest.fn()}
          selectedTab={ClearLocationTarget.FLOOR}
          setSelectedTab={jest.fn()}
          activityModal={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests rendering getSectionsDetails api', () => {
    it('Renders Loading Indicator for get Section details', (): void => {
      const renderer = ShallowRenderer.createRenderer();
      const getSectionDetailsApiLoading: AsyncState = {
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
          user={user}
          itemPopupVisible={false}
          getSectionDetailsApi={getSectionDetailsApiLoading}
          section={defaultSection}
          removeSectionApi={defaultAsyncState}
          displayRemoveConfirmation={true}
          setDisplayRemoveConfirmation={jest.fn()}
          clearSectionApi={defaultAsyncState}
          displayClearConfirmation={false}
          setDisplayClearConfirmation={jest.fn()}
          selectedTab={ClearLocationTarget.FLOOR}
          setSelectedTab={jest.fn()}
          activityModal={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders Retry button if get section details api returns an error', (): void => {
      const renderer = ShallowRenderer.createRenderer();
      const getSectionDetailsApiError: AsyncState = {
        isWaiting: false,
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
          user={user}
          itemPopupVisible={false}
          getSectionDetailsApi={getSectionDetailsApiError}
          section={defaultSection}
          removeSectionApi={defaultAsyncState}
          displayRemoveConfirmation={true}
          setDisplayRemoveConfirmation={jest.fn()}
          clearSectionApi={defaultAsyncState}
          displayClearConfirmation={false}
          setDisplayClearConfirmation={jest.fn()}
          selectedTab={ClearLocationTarget.FLOOR}
          setSelectedTab={jest.fn()}
          activityModal={false}
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

  describe('Location Tabs Navigator (section details) externalized function tests', () => {
    const mockSetDisplayConfirmation = jest.fn();
    const mockDispatch = jest.fn();
    const mockGoBack = jest.fn();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    navigationProp = {
      isFocused: mockIsFocused, navigate: mockNavigate, goBack: mockGoBack
    };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('ensures handleClearSection works properly', () => {
      handleClearSection(mockDispatch, 1, ClearLocationTarget.FLOOR, mockSetDisplayConfirmation);

      expect(mockDispatch).toBeCalledTimes(1);
    });

    it('ensures handleClearModalClose works properly', () => {
      handleClearModalClose(mockSetDisplayConfirmation, mockDispatch);

      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockSetDisplayConfirmation).toBeCalledTimes(1);
    });

    // async done is needed to test .then() of validateSession
    it('ensures getSectionDetailsEffect works properly on success', async done => {
      const doneDispatch = jest.fn(() => done());
      const somethingScanned = {
        type: 'CODE-128',
        value: '12345'
      };
      getSectionDetailsEffect(mockValidateSession, routeProp, somethingScanned, navigationProp, doneDispatch);

      expect(mockValidateSession).toBeCalledTimes(1);
      expect(mockIsFocused).toBeCalledTimes(1);
      expect(doneDispatch).toBeCalledTimes(1);
    });

    it('ensures clearSectionApiEffect works properly on success, sales floor', () => {
      const salesFloorSuccess: AsyncState = {
        ...defaultAsyncState,
        value: {
          locationId: 12453,
          target: 'items'
        },
        result: {
          data: '',
          status: 204
        }
      };
      const section: LocationIdName = {
        id: 13234,
        name: 'yes'
      };

      clearSectionApiEffect(
        mockDispatch, navigationProp,
        salesFloorSuccess,
        section,
        mockSetDisplayConfirmation
      );
      expect(mockIsFocused).toBeCalledTimes(1);
      // called thrice because of handleClearModalClose
      expect(mockDispatch).toBeCalledTimes(3);
      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledWith(expect.objectContaining({ type: 'success' }));
    });

    it('ensures clearSectionApiEffect works properly on success, reserve', () => {
      const salesFloorSuccess: AsyncState = {
        ...defaultAsyncState,
        value: {
          locationId: 12453,
          target: 'pallets'
        },
        result: {
          data: '',
          status: 204
        }
      };
      const section: LocationIdName = {
        id: 13234,
        name: 'yes'
      };

      clearSectionApiEffect(
        mockDispatch, navigationProp,
        salesFloorSuccess,
        section,
        mockSetDisplayConfirmation
      );
      expect(mockIsFocused).toBeCalledTimes(1);
      // called thrice because of handleClearModalClose
      expect(mockDispatch).toBeCalledTimes(2);
      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledWith(expect.objectContaining({ type: 'success' }));
    });

    it('ensures clearSectionApiEffect works properly on failure', () => {
      const salesFloorFail = {
        ...defaultAsyncState,
        value: {
          locationId: 12453,
          target: 'items'
        },
        error: {
          status: 400,
          message: 'bad request'
        }
      };
      const section: LocationIdName = {
        id: 13234,
        name: 'yes'
      };

      clearSectionApiEffect(
        mockDispatch, navigationProp,
        salesFloorFail,
        section,
        mockSetDisplayConfirmation
      );
      expect(mockIsFocused).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledTimes(0);
      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledWith(expect.objectContaining({ type: 'error' }));
    });

    it('ensures removeSectionApiEffect works properly on success', () => {
      const successNotFoundApi: AsyncState = {
        ...defaultAsyncState,
        result: { status: 204 }
      };

      removeSectionApiEffect(navigationProp, mockDispatch, successNotFoundApi, mockSetDisplayConfirmation);
      expect(mockIsFocused).toBeCalledTimes(1);
      expect(mockSetDisplayConfirmation).toBeCalledTimes(1);
      expect(mockSetDisplayConfirmation).lastCalledWith(false);
      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockDispatch).toBeCalledWith(expect.objectContaining({ type: REMOVE_SECTION.RESET }));
      expect(mockDispatch).toBeCalledWith({ type: HIDE_LOCATION_POPUP });
      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledWith(expect.objectContaining({ type: 'success' }));
    });

    it('ensures removeSectionApiEffect works properly on failure', () => {
      const failApi: AsyncState = {
        ...defaultAsyncState,
        error: { status: 400 }
      };

      removeSectionApiEffect(navigationProp, mockDispatch, failApi, mockSetDisplayConfirmation);
      expect(mockIsFocused).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledWith(expect.objectContaining({ type: 'error' }));
      expect(mockSetDisplayConfirmation).toBeCalledTimes(0);
      expect(mockDispatch).toBeCalledTimes(0);
    });
  });

  // TODO Fix unmounted component no-op error for testing useEffect Hook
  describe.skip('Tests calling UseEffect Hook', () => {
    it('Tests ValidateSessionCall with updates to scannedEvent and navigation props', () => {
      const mockNav = jest.requireMock(REACT_NAV_NATIVE);
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
        user,
        itemPopupVisible: false,
        getSectionDetailsApi: defaultAsyncState,
        section: defaultSection,
        removeSectionApi: defaultAsyncState,
        displayRemoveConfirmation: false,
        setDisplayRemoveConfirmation: jest.fn(),
        clearSectionApi: defaultAsyncState,
        displayClearConfirmation: false,
        setDisplayClearConfirmation: jest.fn(),
        selectedTab: ClearLocationTarget.FLOOR,
        setSelectedTab: jest.fn(),
        activityModal: false
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
        ...jest.requireMock(REACT_NAV_NATIVE),
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
              user={user}
              itemPopupVisible={false}
              getSectionDetailsApi={defaultAsyncState}
              section={defaultSection}
              removeSectionApi={defaultAsyncState}
              displayRemoveConfirmation={false}
              setDisplayRemoveConfirmation={jest.fn()}
              clearSectionApi={defaultAsyncState}
              displayClearConfirmation={false}
              setDisplayClearConfirmation={jest.fn()}
              selectedTab={ClearLocationTarget.FLOOR}
              setSelectedTab={jest.fn()}
              activityModal={false}
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
