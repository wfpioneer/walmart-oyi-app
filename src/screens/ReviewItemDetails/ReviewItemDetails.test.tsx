import { NavigationProp, RouteProp } from '@react-navigation/native';
import React from 'react';
import { ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import ShallowRenderer from 'react-test-renderer/shallow';
import { AxiosError, AxiosResponse } from 'axios';
import { object } from 'prop-types';
import { strings } from '../../locales';
import itemDetail from '../../mockData/getItemDetails';
import {
  HandleProps, RenderProps,
  ReviewItemDetailsScreen, createNewPickApiHook, handleCreateNewPick, renderAddPicklistButton,
  renderBarcodeErrorModal, renderLocationComponent, renderOHQtyComponent, renderScanForNoActionButton
} from './ReviewItemDetails';
import { mockConfig } from '../../mockData/mockConfig';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { AsyncState } from '../../models/AsyncState';

jest.mock('../../utils/AppCenterTool', () => jest.requireActual('../../utils/__mocks__/AppCenterTool'));
jest.mock('../../utils/sessionTimeout.ts', () => jest.requireActual('../../utils/__mocks__/sessTimeout'));
jest.mock('../../state/actions/Modal', () => ({
  showActivityModal: jest.fn(),
  hideActivityModal: jest.fn()
}));

let navigationProp: NavigationProp<any>;
let routeProp: RouteProp<any, string>;
let scrollViewProp: React.RefObject<ScrollView>;
describe('ReviewItemDetailsScreen', () => {
  const defaultAsyncState: AsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  };
  const defaultScannedEvent = {
    type: null,
    value: null
  };
  const defaultResult: AxiosResponse = {
    config: {},
    data: {},
    headers: {},
    status: 200,
    statusText: 'OK',
    request: {}
  };

  const mockHandleProps: (HandleProps & RenderProps) = {
    validateSessionCall: jest.fn(() => Promise.resolve()),
    trackEventCall: jest.fn(),
    navigation: navigationProp,
    route: routeProp,
    dispatch: jest.fn(),
    setOhQtyModalVisible: jest.fn(),
    actionCompleted: false,
    isManualScanEnabled: false,
    addToPicklistStatus: defaultAsyncState,
    completeItemApi: defaultAsyncState,
    userConfigs: mockConfig
  };
  describe('Tests renders ItemDetails API Responses', () => {
    it('renders the details for a single item with non-null status', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReviewItemDetailsScreen
          scannedEvent={defaultScannedEvent}
          isManualScanEnabled={false}
          isWaiting={false}
          error={null}
          result={{
            ...defaultResult,
            data: itemDetail[123],
            status: 200
          }}
          addToPicklistStatus={defaultAsyncState}
          completeItemApi={defaultAsyncState}
          userId=""
          exceptionType="NSFL"
          actionCompleted={false}
          pendingOnHandsQty={itemDetail[123].pendingOnHandsQty}
          floorLocations={itemDetail[123].location.floor}
          reserveLocations={itemDetail[123].location.reserve}
          route={routeProp}
          dispatch={jest.fn()}
          navigation={navigationProp}
          scrollViewRef={scrollViewProp}
          isSalesMetricsGraphView={false}
          setIsSalesMetricsGraphView={jest.fn()}
          ohQtyModalVisible={false}
          setOhQtyModalVisible={jest.fn()}
          errorModalVisible={false}
          setErrorModalVisible={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
          useEffectHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          userFeatures={[]}
          userConfigs={mockConfig}
          createPickModalVisible={false}
          setCreatePickModalVisible={jest.fn()}
          selectedSection=""
          setSelectedSection={jest.fn()}
          numberOfPallets={1}
          setNumberOfPallets={jest.fn()}
          isQuickPick={false}
          setIsQuickPick={jest.fn()}
          createNewPickApi={defaultAsyncState}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders the details for a single item with null status', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReviewItemDetailsScreen
          scannedEvent={defaultScannedEvent}
          isManualScanEnabled={false}
          isWaiting={false}
          error={null}
          result={{
            ...defaultResult,
            data: {
              ...itemDetail[123],
              status: undefined
            },
            status: 200
          }}
          addToPicklistStatus={defaultAsyncState}
          completeItemApi={defaultAsyncState}
          userId=""
          exceptionType="NSFL"
          actionCompleted={false}
          pendingOnHandsQty={itemDetail[123].pendingOnHandsQty}
          floorLocations={itemDetail[123].location.floor}
          reserveLocations={itemDetail[123].location.reserve}
          route={routeProp}
          dispatch={jest.fn()}
          navigation={navigationProp}
          scrollViewRef={scrollViewProp}
          isSalesMetricsGraphView={false}
          setIsSalesMetricsGraphView={jest.fn()}
          ohQtyModalVisible={false}
          setOhQtyModalVisible={jest.fn()}
          errorModalVisible={false}
          setErrorModalVisible={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
          useEffectHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          userFeatures={[]}
          userConfigs={mockConfig}
          createPickModalVisible={false}
          setCreatePickModalVisible={jest.fn()}
          selectedSection=""
          setSelectedSection={jest.fn()}
          numberOfPallets={1}
          setNumberOfPallets={jest.fn()}
          isQuickPick={false}
          setIsQuickPick={jest.fn()}
          createNewPickApi={defaultAsyncState}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders the On Hands Cloud Qty of 42', () => {
      const renderer = ShallowRenderer.createRenderer();
      // Mock Item Number 456 has cloud Qty defined
      renderer.render(
        <ReviewItemDetailsScreen
          scannedEvent={defaultScannedEvent}
          isManualScanEnabled={false}
          isWaiting={false}
          error={null}
          result={{
            ...defaultResult,
            data: {
              ...itemDetail[456],
              status: undefined
            },
            status: 200
          }}
          addToPicklistStatus={defaultAsyncState}
          completeItemApi={defaultAsyncState}
          userId=""
          exceptionType="NSFL"
          actionCompleted={false}
          pendingOnHandsQty={itemDetail[456].pendingOnHandsQty}
          floorLocations={itemDetail[456].location.floor}
          reserveLocations={itemDetail[456].location.reserve}
          route={routeProp}
          dispatch={jest.fn()}
          navigation={navigationProp}
          scrollViewRef={scrollViewProp}
          isSalesMetricsGraphView={false}
          setIsSalesMetricsGraphView={jest.fn()}
          ohQtyModalVisible={false}
          setOhQtyModalVisible={jest.fn()}
          errorModalVisible={false}
          setErrorModalVisible={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
          useEffectHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          userFeatures={['']}
          userConfigs={mockConfig}
          createPickModalVisible={false}
          setCreatePickModalVisible={jest.fn()}
          selectedSection=""
          setSelectedSection={jest.fn()}
          numberOfPallets={1}
          setNumberOfPallets={jest.fn()}
          isQuickPick={false}
          setIsQuickPick={jest.fn()}
          createNewPickApi={defaultAsyncState}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders "Generic Change translation" if pendingOH is -999 and user has OH role', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReviewItemDetailsScreen
          scannedEvent={defaultScannedEvent}
          isManualScanEnabled={false}
          isWaiting={false}
          error={null}
          result={{
            ...defaultResult,
            data: {
              ...itemDetail[123],
              status: undefined
            },
            status: 200
          }}
          addToPicklistStatus={defaultAsyncState}
          completeItemApi={defaultAsyncState}
          userId=""
          exceptionType="NSFL"
          actionCompleted={false}
          pendingOnHandsQty={itemDetail[123].pendingOnHandsQty}
          floorLocations={itemDetail[123].location.floor}
          reserveLocations={itemDetail[123].location.reserve}
          route={routeProp}
          dispatch={jest.fn()}
          navigation={navigationProp}
          scrollViewRef={scrollViewProp}
          isSalesMetricsGraphView={false}
          setIsSalesMetricsGraphView={jest.fn()}
          ohQtyModalVisible={false}
          setOhQtyModalVisible={jest.fn()}
          errorModalVisible={false}
          setErrorModalVisible={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
          useEffectHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          userFeatures={['on hands change']}
          userConfigs={mockConfig}
          createPickModalVisible={false}
          setCreatePickModalVisible={jest.fn()}
          selectedSection=""
          setSelectedSection={jest.fn()}
          numberOfPallets={1}
          setNumberOfPallets={jest.fn()}
          isQuickPick={false}
          setIsQuickPick={jest.fn()}
          createNewPickApi={defaultAsyncState}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders \'Item Details Api Error\' for a failed request ', () => {
      const renderer = ShallowRenderer.createRenderer();
      const mockError: AxiosError = {
        config: {},
        isAxiosError: true,
        message: '500 Network Error',
        name: 'Network Error',
        toJSON: () => object
      };
      renderer.render(
        <ReviewItemDetailsScreen
          scannedEvent={defaultScannedEvent}
          isManualScanEnabled={false}
          isWaiting={false}
          error={mockError}
          result={null}
          addToPicklistStatus={defaultAsyncState}
          completeItemApi={defaultAsyncState}
          userId=""
          exceptionType=""
          actionCompleted={false}
          pendingOnHandsQty={0}
          floorLocations={[]}
          reserveLocations={[]}
          route={routeProp}
          dispatch={jest.fn()}
          navigation={navigationProp}
          scrollViewRef={scrollViewProp}
          isSalesMetricsGraphView={false}
          setIsSalesMetricsGraphView={jest.fn()}
          ohQtyModalVisible={false}
          setOhQtyModalVisible={jest.fn()}
          errorModalVisible={false}
          setErrorModalVisible={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
          useEffectHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          userFeatures={[]}
          userConfigs={mockConfig}
          createPickModalVisible={false}
          setCreatePickModalVisible={jest.fn()}
          selectedSection=""
          setSelectedSection={jest.fn()}
          numberOfPallets={1}
          setNumberOfPallets={jest.fn()}
          isQuickPick={false}
          setIsQuickPick={jest.fn()}
          createNewPickApi={defaultAsyncState}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders \'Scanned Item Not Found\' on request status 204', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReviewItemDetailsScreen
          scannedEvent={defaultScannedEvent}
          isManualScanEnabled={false}
          isWaiting={false}
          error={null}
          result={{
            ...defaultResult,
            data: [],
            status: 204
          }}
          addToPicklistStatus={defaultAsyncState}
          completeItemApi={defaultAsyncState}
          userId=""
          exceptionType=""
          actionCompleted={false}
          pendingOnHandsQty={0}
          floorLocations={[]}
          reserveLocations={[]}
          route={routeProp}
          dispatch={jest.fn()}
          navigation={navigationProp}
          scrollViewRef={scrollViewProp}
          isSalesMetricsGraphView={false}
          setIsSalesMetricsGraphView={jest.fn()}
          ohQtyModalVisible={false}
          setOhQtyModalVisible={jest.fn()}
          errorModalVisible={false}
          setErrorModalVisible={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
          useEffectHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          userFeatures={[]}
          userConfigs={mockConfig}
          createPickModalVisible={false}
          setCreatePickModalVisible={jest.fn()}
          selectedSection=""
          setSelectedSection={jest.fn()}
          numberOfPallets={1}
          setNumberOfPallets={jest.fn()}
          isQuickPick={false}
          setIsQuickPick={jest.fn()}
          createNewPickApi={defaultAsyncState}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders \'Activity Indicator\' waiting for ItemDetails Response ', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReviewItemDetailsScreen
          scannedEvent={defaultScannedEvent}
          isManualScanEnabled={false}
          isWaiting={true}
          error={null}
          result={null}
          addToPicklistStatus={defaultAsyncState}
          completeItemApi={defaultAsyncState}
          userId=""
          exceptionType=""
          actionCompleted={false}
          pendingOnHandsQty={0}
          floorLocations={[]}
          reserveLocations={[]}
          route={routeProp}
          dispatch={jest.fn()}
          navigation={navigationProp}
          scrollViewRef={scrollViewProp}
          isSalesMetricsGraphView={false}
          setIsSalesMetricsGraphView={jest.fn()}
          ohQtyModalVisible={false}
          setOhQtyModalVisible={jest.fn()}
          errorModalVisible={false}
          setErrorModalVisible={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
          useEffectHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          userFeatures={[]}
          userConfigs={mockConfig}
          createPickModalVisible={false}
          setCreatePickModalVisible={jest.fn()}
          selectedSection=""
          setSelectedSection={jest.fn()}
          numberOfPallets={1}
          setNumberOfPallets={jest.fn()}
          isQuickPick={false}
          setIsQuickPick={jest.fn()}
          createNewPickApi={defaultAsyncState}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders the details for a item with multi status 207(error retreiving sales history)', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReviewItemDetailsScreen
          scannedEvent={defaultScannedEvent}
          isManualScanEnabled={false}
          isWaiting={false}
          error={null}
          result={{
            ...defaultResult,
            data: itemDetail[321],
            status: 207
          }}
          addToPicklistStatus={defaultAsyncState}
          completeItemApi={defaultAsyncState}
          userId=""
          exceptionType="NSFL"
          actionCompleted={false}
          pendingOnHandsQty={itemDetail[123].pendingOnHandsQty}
          floorLocations={itemDetail[123].location.floor}
          reserveLocations={itemDetail[123].location.reserve}
          route={routeProp}
          dispatch={jest.fn()}
          navigation={navigationProp}
          scrollViewRef={scrollViewProp}
          isSalesMetricsGraphView={false}
          setIsSalesMetricsGraphView={jest.fn()}
          ohQtyModalVisible={false}
          setOhQtyModalVisible={jest.fn()}
          errorModalVisible={false}
          setErrorModalVisible={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
          useEffectHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          userFeatures={[]}
          userConfigs={mockConfig}
          createPickModalVisible={false}
          setCreatePickModalVisible={jest.fn()}
          selectedSection=""
          setSelectedSection={jest.fn()}
          numberOfPallets={1}
          setNumberOfPallets={jest.fn()}
          isQuickPick={false}
          setIsQuickPick={jest.fn()}
          createNewPickApi={defaultAsyncState}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('Tests Rendering \'Scan for No Action Button\'', () => {
    it('Renders Nothing for\' Scan for No Action\' button', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderScanForNoActionButton({ ...mockHandleProps, actionCompleted: true }, itemDetail[123])
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders Activity Indicator waiting for No Action Response', () => {
      const renderer = ShallowRenderer.createRenderer();
      const noActionWaiting = {
        isWaiting: true,
        value: null,
        error: null,
        result: null
      };
      renderer.render(
        renderScanForNoActionButton({ ...mockHandleProps, completeItemApi: noActionWaiting },
          itemDetail[123])
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders Scan for No Action Button if Platform is Android', () => {
      jest.mock('react-native/Libraries/Utilities/Platform', () => {
        const Platform = jest.requireActual('react-native/Libraries/Utilities/Platform.android.js');
        Platform.OS = 'android';
        return Platform;
      });
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderScanForNoActionButton(mockHandleProps,
          itemDetail[123])
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests rendering for On Hands Quantity component', () => {
    const negOnHandsQty = -25;
    const posOnHandsQty = 20;
    it('renders Negative On Hands Quantity', () => {
      const renderer = ShallowRenderer.createRenderer();
      const pendingOHQty = -999;
      renderer.render(
        renderOHQtyComponent({ ...itemDetail[123], onHandsQty: negOnHandsQty, pendingOnHandsQty: pendingOHQty })
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders Pending On Hands Quantity \'Pending Mgr Approval\'', () => {
      const renderer = ShallowRenderer.createRenderer();
      const pendingOHQty = 40;
      renderer.render(
        renderOHQtyComponent({ ...itemDetail[123], onHandsQty: negOnHandsQty, pendingOnHandsQty: pendingOHQty })
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders Positive On Hands Quantity \'No Pending Mgr Approval\'', () => {
      const renderer = ShallowRenderer.createRenderer();

      const pendingOHQty = -999;
      renderer.render(
        renderOHQtyComponent({ ...itemDetail[123], onHandsQty: posOnHandsQty, pendingOnHandsQty: pendingOHQty })
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests rendering for the Location Component', () => {
    it('renders both the floor & reserve Location Names', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderLocationComponent({
          ...mockHandleProps,
          floorLocations: itemDetail[123].location.floor,
          reserveLocations: itemDetail[123].location.reserve
        }, itemDetail[123], jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders \'Floor\' location Name with no Reserve location', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderLocationComponent({
          ...mockHandleProps,
          floorLocations: itemDetail[123].location.floor,
          reserveLocations: []
        }, itemDetail[123], jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders \'Reserve\' location Name with no Floor location', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderLocationComponent({
          ...mockHandleProps,
          floorLocations: [],
          reserveLocations: itemDetail[123].location.reserve
        }, itemDetail[123], jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders button for adding a Reserve & Floor Location', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderLocationComponent({
          ...mockHandleProps,
          floorLocations: [],
          reserveLocations: []
        }, itemDetail[123], jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  // TODO once create pick dialog and api are fully implemented into item review screen we need to add tests for
  // TODO testing the api when picking is enabled
  describe('Tests rendering for Adding an Item to the Picklist', () => {
    it('renders \'Item Added to Picklist \'', () => {
      const renderer = ShallowRenderer.createRenderer();
      const addPicklistResult = {
        isWaiting: false,
        value: null,
        error: null,
        result: {
          data: {
            code: '200',
            description: 'Manual Pick created for Item Nbr [123] with Pick Need [1]'
          },
          status: 200
        }
      };
      renderer.render(
        renderAddPicklistButton({
          ...mockHandleProps,
          addToPicklistStatus: addPicklistResult
        }, itemDetail[123], jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders \'Add to Picklist Error\' Retry', () => {
      const renderer = ShallowRenderer.createRenderer();
      const addPicklistError = {
        isWaiting: false,
        value: null,
        error: ' Network Error ',
        result: null
      };
      renderer.render(
        renderAddPicklistButton({
          ...mockHandleProps,
          addToPicklistStatus: addPicklistError
        }, itemDetail[123], jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders a Loader when waiting for Picklist response', () => {
      const renderer = ShallowRenderer.createRenderer();
      const addPicklistError = {
        isWaiting: true,
        value: null,
        error: null,
        result: null
      };
      renderer.render(
        renderAddPicklistButton({
          ...mockHandleProps,
          addToPicklistStatus: addPicklistError
        }, itemDetail[123], jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders \'Reserve Item Needed\' to Add to Picklist', () => {
      const noReserveItemDetails = {
        ...itemDetail[123],
        location: {
          floor: undefined,
          reserve: undefined,
          count: 0
        }
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderAddPicklistButton({
          ...mockHandleProps
        }, noReserveItemDetails, jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  // TODO Keep temporary tests until we refactor Modal.tsx for global usage in app
  describe('Tests Rendering Scanned Barcode Error', () => {
    it('Renders the barcodeErrorModal isVisible set to True', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderBarcodeErrorModal(true, jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders the barcodeErrorModal isVisible set to False', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderBarcodeErrorModal(false, jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('Manage ReviewItemDetails externalized function tests', () => {
    const mockDispatch = jest.fn();
    const mockSetSelectedSection = jest.fn();
    const mockSetIsQuickPick = jest.fn();
    const mockSetNumberOfPallets = jest.fn();
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Tests createNewPickApiHook on 200 success', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          status: 200
        }
      };
      const toastPicklistSuccess = {
        type: 'success',
        text1: strings('PICKING.CREATE_NEW_PICK_SUCCESS'),
        visibilityTime: 4000,
        position: 'bottom'
      };
      createNewPickApiHook(
        successApi, mockDispatch, true, mockSetSelectedSection, mockSetIsQuickPick, mockSetNumberOfPallets
      );
      expect(Toast.show).toHaveBeenCalledWith(toastPicklistSuccess);
      expect(mockSetSelectedSection).toHaveBeenCalledWith('');
      expect(mockSetIsQuickPick).toHaveBeenCalledWith(false);
      expect(mockSetNumberOfPallets).toHaveBeenCalledWith(1);
      expect(hideActivityModal).toBeCalledTimes(1);
    });

    it('Tests createNewPickApiHook on 409 failure', () => {
      const failureApi: AsyncState = {
        ...defaultAsyncState,
        result: null,
        error: {
          response: {
            status: 409,
            data: {
              errorEnum: 'PICK_REQUEST_CRITERIA_ALREADY_MET'
            }
          }
        }
      };
      const toastPickList409Error = {
        type: 'error',
        text1: strings('PICKING.PICK_REQUEST_CRITERIA_ALREADY_MET'),
        visibilityTime: 4000,
        position: 'bottom'
      };
      createNewPickApiHook(
        failureApi, mockDispatch, true, mockSetSelectedSection, mockSetIsQuickPick, mockSetNumberOfPallets
      );
      expect(mockDispatch).toBeCalledTimes(2);
      expect(hideActivityModal).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith(toastPickList409Error);
    });

    it('Tests createNewPickApiHook on failure', () => {
      const failureApi: AsyncState = {
        ...defaultAsyncState,
        error: 'Internal Server Error'
      };
      const toastPickListError = {
        type: 'error',
        text1: strings('PICKING.CREATE_NEW_PICK_FAILURE'),
        text2: strings('GENERICS.TRY_AGAIN'),
        visibilityTime: 4000,
        position: 'bottom'
      };
      createNewPickApiHook(
        failureApi, mockDispatch, true, mockSetSelectedSection, mockSetIsQuickPick, mockSetNumberOfPallets
      );
      expect(mockDispatch).toBeCalledTimes(2);
      expect(hideActivityModal).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith(toastPickListError);
    });

    it('Tests createNewPickApiHook isWaiting', () => {
      const isLoadingApi: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };
      createNewPickApiHook(
        isLoadingApi, mockDispatch, true, mockSetSelectedSection, mockSetIsQuickPick, mockSetNumberOfPallets
      );
      expect(showActivityModal).toBeCalledTimes(1);
    });

    it('Tests handleCreatePick method', () => {
      const mockProps = {
        scannedEvent: { type: null, value: null },
        isManualScanEnabled: false,
        isWaiting: false,
        error: null,
        result: {
          ...defaultResult,
          data: itemDetail[321],
          status: 207
        },
        addToPicklistStatus: defaultAsyncState,
        completeItemApi: defaultAsyncState,
        userId: '',
        exceptionType: 'NSFL',
        actionCompleted: false,
        pendingOnHandsQty: itemDetail[123].pendingOnHandsQty,
        floorLocations: itemDetail[123].location.floor,
        reserveLocations: itemDetail[123].location.reserve,
        route: routeProp,
        dispatch: jest.fn(),
        navigation: navigationProp,
        scrollViewRef: scrollViewProp,
        isSalesMetricsGraphView: false,
        setIsSalesMetricsGraphView: jest.fn(),
        ohQtyModalVisible: false,
        setOhQtyModalVisible: jest.fn(),
        errorModalVisible: false,
        setErrorModalVisible: jest.fn(),
        trackEventCall: jest.fn(),
        validateSessionCall: jest.fn(() => Promise.resolve()),
        useEffectHook: jest.fn(),
        useFocusEffectHook: jest.fn(),
        userFeatures: [],
        userConfigs: mockConfig,
        createPickModalVisible: false,
        setCreatePickModalVisible: jest.fn(),
        selectedSection: '',
        setSelectedSection: jest.fn(),
        numberOfPallets: 1,
        setNumberOfPallets: jest.fn(),
        isQuickPick: false,
        setIsQuickPick: jest.fn(),
        createNewPickApi: defaultAsyncState
      };
      const mockItemDetails = itemDetail[321];
      const mockSetCreatePickModalVisible = jest.fn();
      handleCreateNewPick(mockProps, mockItemDetails, mockSetCreatePickModalVisible);
      expect(mockSetCreatePickModalVisible).toHaveBeenCalledWith(false);
      expect(mockProps.dispatch).toHaveBeenCalledWith({
        payload: {
          category: 93,
          itemDesc: 'Test Item That is Really, Really Long (and has parenthesis)',
          itemNbr: 1234567890,
          moveToFront: false,
          numberOfPallets: 1,
          quickPick: false,
          salesFloorLocationId: undefined,
          salesFloorLocationName: '',
          upcNbr: '000055559999'
        },
        type: 'SAGA/CREATE_NEW_PICK'
      });
    });
  });
});
