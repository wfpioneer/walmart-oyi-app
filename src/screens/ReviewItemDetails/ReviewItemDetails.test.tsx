import { NavigationProp, RouteProp } from '@react-navigation/native';
import React from 'react';
import { ScrollView } from 'react-native';
import ShallowRenderer from 'react-test-renderer/shallow';
import itemDetail from '../../mockData/getItemDetails';
import {
  HandleProps,
  RenderProps, ReviewItemDetailsScreen, renderAddPicklistButton, renderBarcodeErrorModal,
  renderLocationComponent, renderOHQtyComponent, renderScanForNoActionButton
} from './ReviewItemDetails';

jest.mock('../../utils/AppCenterTool', () => jest.requireActual('../../utils/__mocks__/AppCenterTool'));
jest.mock('../../utils/sessionTimeout.ts', () => jest.requireActual('../../utils/__mocks__/sessTimeout'));

let navigationProp: NavigationProp<any>;
let routeProp: RouteProp<any, string>;
let scrollViewProp: React.RefObject<ScrollView>;
describe('ReviewItemDetailsScreen', () => {
  const defaultAsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
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
    completeItemApi: defaultAsyncState
  };
  describe('Tests renders ItemDetails API Responses', () => {
    it('renders the details for a single item with non-null status', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReviewItemDetailsScreen
          scannedEvent={undefined}
          isManualScanEnabled={false}
          isWaiting={false}
          error={undefined}
          result={{
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
          isRefreshing={false}
          setIsRefreshing={jest.fn()}
          errorModalVisible={false}
          setErrorModalVisible={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
          useEffectHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          userFeatures={[]}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders the details for a single item with null status', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReviewItemDetailsScreen
          scannedEvent={undefined}
          isManualScanEnabled={false}
          isWaiting={false}
          error={undefined}
          result={{
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
          isRefreshing={false}
          setIsRefreshing={jest.fn()}
          errorModalVisible={false}
          setErrorModalVisible={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
          useEffectHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          userFeatures={[]}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders the On Hands Cloud Qty of 42', () => {
      const renderer = ShallowRenderer.createRenderer();
      // Mock Item Number 456 has cloud Qty defined
      renderer.render(
        <ReviewItemDetailsScreen
          scannedEvent={undefined}
          isManualScanEnabled={false}
          isWaiting={false}
          error={undefined}
          result={{
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
          isRefreshing={false}
          setIsRefreshing={jest.fn()}
          errorModalVisible={false}
          setErrorModalVisible={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
          useEffectHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          userFeatures={['']}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders "Generic Change translation" if pendingOH is -999 and user has OH role', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReviewItemDetailsScreen
          scannedEvent={undefined}
          isManualScanEnabled={false}
          isWaiting={false}
          error={undefined}
          result={{
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
          isRefreshing={false}
          setIsRefreshing={jest.fn()}
          errorModalVisible={false}
          setErrorModalVisible={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
          useEffectHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          userFeatures={['on hands change']}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders \'Item Details Api Error\' for a failed request ', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReviewItemDetailsScreen
          scannedEvent={undefined}
          isManualScanEnabled={false}
          isWaiting={false}
          error="Network Error"
          result={undefined}
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
          isRefreshing={false}
          setIsRefreshing={jest.fn()}
          errorModalVisible={false}
          setErrorModalVisible={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
          useEffectHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          userFeatures={[]}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders \'Scanned Item Not Found\' on request status 204', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReviewItemDetailsScreen
          scannedEvent={undefined}
          isManualScanEnabled={false}
          isWaiting={false}
          error={undefined}
          result={{
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
          isRefreshing={false}
          setIsRefreshing={jest.fn()}
          errorModalVisible={false}
          setErrorModalVisible={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
          useEffectHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          userFeatures={[]}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders \'Activity Indicator\' waiting for ItemDetails Response ', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReviewItemDetailsScreen
          scannedEvent={undefined}
          isManualScanEnabled={false}
          isWaiting={true}
          error={undefined}
          result={undefined}
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
          isRefreshing={false}
          setIsRefreshing={jest.fn()}
          errorModalVisible={false}
          setErrorModalVisible={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
          useEffectHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          userFeatures={[]}
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
        }, itemDetail[123])
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
        }, itemDetail[123])
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
        }, itemDetail[123])
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
        }, itemDetail[123])
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

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
        }, itemDetail[123])
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
        }, itemDetail[123])
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
        }, itemDetail[123])
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
        }, noReserveItemDetails)
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
});
