/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
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
import { GET_SECTION_DETAILS, REMOVE_SECTION } from '../../state/actions/asyncAPI';
import { HIDE_LOCATION_POPUP, hideItemPopup, setIsToolBarNavigation } from '../../state/actions/Location';
import { mockConfig } from '../../mockData/mockConfig';
import mockUser from '../../mockData/mockUser';
import { getSectionDetails } from '../../state/actions/saga';
import { resetScannedEvent } from '../../state/actions/Global';

const REACT_NAV_NATIVE = '@react-navigation/native';

const navigationProp: NavigationProp<any> = {
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  dispatch: jest.fn(),
  goBack: jest.fn(),
  isFocused: jest.fn(() => true),
  removeListener: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
  navigate: jest.fn(),
  getId: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn()
};

const routeProp: RouteProp<any, string> = {
  key: '',
  name: 'LocationTab'
};

const defaultScannedEvent = {
  type: null,
  value: null
};

jest.mock(REACT_NAV_NATIVE, () => {
  const actualNav = jest.requireActual(REACT_NAV_NATIVE);
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      isFocused: jest.fn(() => true),
      addListener: jest.fn()
    })
  };
});

describe('Test Location Tabs', (): void => {
  const mockValidateSession = jest.fn(() => Promise.resolve());
  const mockDispatch = jest.fn();

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

  afterEach(() => {
    jest.clearAllMocks();
  });

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
        user={mockUser}
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
        user={mockUser}
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
        user={mockUser}
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
        user={mockUser}
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
        user={mockUser}
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
        user={{ ...mockUser, features: ['location management edit'] }}
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
          user={mockUser}
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
          user={mockUser}
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
          user={mockUser}
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
          user={mockUser}
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

    it('ensures handleClearSection works properly', () => {
      handleClearSection(mockDispatch, 1, ClearLocationTarget.FLOOR, mockSetDisplayConfirmation, jest.fn());

      expect(mockDispatch).toBeCalledTimes(1);
    });

    it('ensures handleClearModalClose works properly', () => {
      handleClearModalClose(mockSetDisplayConfirmation, mockDispatch);

      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockSetDisplayConfirmation).toBeCalledTimes(1);
    });

    it('ensures getSectionDetailsEffect works properly on success', async () => {
      const somethingScanned = {
        type: 'CODE-128',
        value: '12345'
      };
      await getSectionDetailsEffect(mockValidateSession, routeProp, somethingScanned, navigationProp, mockDispatch);

      expect(mockValidateSession).toBeCalledTimes(1);
      expect(navigationProp.isFocused).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledTimes(1);
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
        mockDispatch,
        navigationProp,
        salesFloorSuccess,
        section,
        mockSetDisplayConfirmation
      );
      expect(navigationProp.isFocused).toBeCalledTimes(1);
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
        mockDispatch,
        navigationProp,
        salesFloorSuccess,
        section,
        mockSetDisplayConfirmation
      );
      expect(navigationProp.isFocused).toBeCalledTimes(1);
      // called thrice because of handleClearModalClose
      expect(mockDispatch).toBeCalledTimes(3);
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
        mockDispatch,
        navigationProp,
        salesFloorFail,
        section,
        mockSetDisplayConfirmation
      );
      expect(navigationProp.isFocused).toBeCalledTimes(1);
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
      expect(navigationProp.isFocused).toBeCalledTimes(1);
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
      expect(navigationProp.isFocused).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledWith(expect.objectContaining({ type: 'error' }));
      expect(mockSetDisplayConfirmation).toBeCalledTimes(0);
      expect(mockDispatch).toBeCalledTimes(0);
    });
  });

  describe('Tests LocationTabNavigator React Hooks', () => {
    const mockUseEffectHook = jest.fn().mockImplementation((callback, deps) => {
      callback();
    });
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
      useEffectHook: mockUseEffectHook,
      validateSessionCall: mockValidateSession,
      isManualScanEnabled: false,
      user: mockUser,
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
    it('Tests useEffect Hooks Navigation Listener', () => {
      navigationProp.addListener = jest.fn()
        .mockImplementation((event, callback) => {
          callback();
        });

      render(
        <Provider store={store}>
          <NavigationContainer>
            <LocationTabsNavigator
              {...tabProps}
              dispatch={mockDispatch}
              itemPopupVisible={true}
              scannedEvent={{ value: 'test', type: 'test' }}
            />
          </NavigationContainer>
        </Provider>
      );
      expect(mockValidateSession).toBeCalledTimes(2);
      expect(navigationProp.addListener).toBeCalledWith(
        'beforeRemove',
        expect.any(Function)
      );
      expect(navigationProp.addListener).toBeCalledWith(
        'focus',
        expect.any(Function)
      );
      expect(mockDispatch).toHaveBeenNthCalledWith(1, hideItemPopup());
      expect(mockDispatch).toHaveBeenNthCalledWith(2, resetScannedEvent());
      expect(mockDispatch).toHaveBeenNthCalledWith(3, { type: GET_SECTION_DETAILS.RESET });
      navigationProp.addListener = jest.fn();
    });

    it('Test if barcodeEmitter is called with "scanned" event', () => {
      jest.spyOn(barcodeEmitter, 'addListener');
      barcodeEmitter.addListener = jest
        .fn()
        .mockImplementation((event, callback) => {
          callback({ value: 'test', type: 'UPC-A' });
          return {
            remove: jest.fn()
          };
        });

      render(
        <Provider store={store}>
          <NavigationContainer>
            <LocationTabsNavigator {...tabProps} />
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
