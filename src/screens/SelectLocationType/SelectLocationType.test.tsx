import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { l } from 'i18n-js';
import { fireEvent, render } from '@testing-library/react-native';
import { strings } from '../../locales';
import {
  AddLocationApiHook,
  EditLocationApiHook,
  SelectLocationTypeScreen,
  isNotActionCompleted,
  onBarcodeEmitterResponse,
  onValidateSessionCallResponse,
  scanUPCAHook,
  validateLocation
} from './SelectLocationType';
import { AsyncState } from '../../models/AsyncState';
import Location from '../../models/Location';
import mockItemDetails from '../../mockData/getItemDetails';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

const navigationProp: NavigationProp<any> = {
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  dangerouslyGetParent: jest.fn(),
  dangerouslyGetState: jest.fn(),
  dispatch: jest.fn(),
  goBack: jest.fn(),
  isFocused: jest.fn(() => true),
  removeListener: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
  navigate: jest.fn()
};
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

  const selectedLocation = {
    zoneId: 1,
    aisleId: 2,
    sectionId: 3,
    zoneName: 'A',
    aisleName: '1',
    sectionName: '1',
    locationName: 'A1-1',
    type: '8',
    typeNbr: 8
  };

  const defaultItemNbr = 0;
  const defaultUpcNbr = '';
  const defaultExceptionType = '';

  const mockDispatch = jest.fn();
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Tests rendering the SelectLocationType Screen', () => {
    it('Renders the selectLocationScreen default ', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <SelectLocationTypeScreen
          inputLocation={false}
          setInputLocation={jest.fn()}
          loc=""
          setLoc={jest.fn()}
          scanType=""
          setScanType={jest.fn()}
          error={defaultError}
          setError={jest.fn()}
          addAPI={defaultAsyncState}
          editAPI={defaultAsyncState}
          floorLocations={[]}
          itemNbr={defaultItemNbr}
          upcNbr={defaultUpcNbr}
          exceptionType={defaultExceptionType}
          actionCompleted={false}
          navigation={navigationProp}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
          selectedLocation={null}
          salesFloor={true}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders the EnterLocation Modal as visible ', () => {
      const renderer = ShallowRenderer.createRenderer();
      const inputLocation = true;
      renderer.render(
        <SelectLocationTypeScreen
          inputLocation={inputLocation}
          setInputLocation={jest.fn()}
          loc=""
          setLoc={jest.fn()}
          scanType=""
          setScanType={jest.fn()}
          error={defaultError}
          setError={jest.fn()}
          addAPI={defaultAsyncState}
          editAPI={defaultAsyncState}
          floorLocations={[]}
          itemNbr={defaultItemNbr}
          upcNbr={defaultUpcNbr}
          exceptionType={defaultExceptionType}
          actionCompleted={false}
          navigation={navigationProp}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
          selectedLocation={null}
          salesFloor={true}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders Location Name above manual location enter', () => {
      const renderer = ShallowRenderer.createRenderer();
      const locationName = 'TestLocation-3';
      renderer.render(
        <SelectLocationTypeScreen
          inputLocation={false}
          setInputLocation={jest.fn()}
          loc={locationName}
          setLoc={jest.fn()}
          scanType=""
          setScanType={jest.fn()}
          error={defaultError}
          setError={jest.fn()}
          addAPI={defaultAsyncState}
          editAPI={defaultAsyncState}
          floorLocations={[]}
          itemNbr={defaultItemNbr}
          upcNbr={defaultUpcNbr}
          exceptionType={defaultExceptionType}
          actionCompleted={false}
          navigation={navigationProp}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
          selectedLocation={null}
          salesFloor={true}
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
          inputLocation={false}
          setInputLocation={jest.fn()}
          loc=""
          setLoc={jest.fn()}
          scanType=""
          setScanType={jest.fn()}
          error={defaultError}
          setError={jest.fn()}
          addAPI={apiIsWaiting}
          editAPI={defaultAsyncState}
          floorLocations={[]}
          itemNbr={defaultItemNbr}
          upcNbr={defaultUpcNbr}
          exceptionType={defaultExceptionType}
          actionCompleted={false}
          navigation={navigationProp}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
          selectedLocation={null}
          salesFloor={true}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders the Activity indicator when waiting for response from EditLocation Api', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <SelectLocationTypeScreen
          inputLocation={false}
          setInputLocation={jest.fn()}
          loc=""
          setLoc={jest.fn()}
          scanType=""
          setScanType={jest.fn()}
          error={defaultError}
          setError={jest.fn()}
          addAPI={defaultAsyncState}
          editAPI={apiIsWaiting}
          floorLocations={[]}
          itemNbr={defaultItemNbr}
          upcNbr={defaultUpcNbr}
          exceptionType={defaultExceptionType}
          actionCompleted={false}
          navigation={navigationProp}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
          selectedLocation={selectedLocation}
          salesFloor={true}
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
          inputLocation={false}
          setInputLocation={jest.fn()}
          loc=""
          setLoc={jest.fn()}
          scanType=""
          setScanType={jest.fn()}
          error={locationError}
          setError={jest.fn()}
          addAPI={defaultAsyncState}
          editAPI={defaultAsyncState}
          floorLocations={[]}
          itemNbr={defaultItemNbr}
          upcNbr={defaultUpcNbr}
          exceptionType={defaultExceptionType}
          actionCompleted={false}
          navigation={navigationProp}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn(() => Promise.resolve())}
          selectedLocation={null}
          salesFloor={true}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests Location Validation', () => {
    it('validateLocation returns false for empty location name', () => {
      const noLocationName = validateLocation('');
      expect(noLocationName).toBe(false);
    });
    it('validateLocation returns false for incorrect location name', () => {
      const invalidLocation = validateLocation('A1 -1');
      expect(invalidLocation).toBe(false);
    });
    it('validateLocation returns true for valid location name', () => {
      const validLocationSalesFloor = validateLocation('A1-1');
      expect(validLocationSalesFloor).toBe(true);
    });
    it('validateLocation returns true for valid location number', () => {
      const validLocationSalesFloor = validateLocation('123456');
      expect(validLocationSalesFloor).toBe(true);
    });
  });

  describe('SelectLocation Function Tests', () => {
    const mockSetError = jest.fn();
    const mockTrackEvent = jest.fn();
    const mockLocation: Location = {
      aisleId: 401,
      aisleName: '1',
      locationName: 'Test1-1',
      sectionId: 402,
      sectionName: '1',
      type: '',
      typeNbr: 1,
      zoneId: 400,
      zoneName: 'Test'
    };
    it('Test AddLocationApiHook', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          status: 200,
          data: ''
        }
      };
      const failureApi: AsyncState = {
        ...defaultAsyncState,
        error: 'Server Error'
      };
      const isWaitingApi: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };

      AddLocationApiHook(successApi, mockSetError, mockDispatch, navigationProp, true, true, 'NSFL', 123, mockLocation);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(navigationProp.goBack).toHaveBeenCalled();

      mockDispatch.mockReset();
      AddLocationApiHook(successApi, mockSetError, mockDispatch, navigationProp, false, true, 'NSFL', 123, null);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(navigationProp.goBack).toHaveBeenCalled();

      AddLocationApiHook(failureApi, mockSetError, mockDispatch, navigationProp, true, true, 'NSFL', 123, mockLocation);
      expect(mockSetError).toHaveBeenCalledWith({ error: true, message: strings('LOCATION.ADD_LOCATION_API_ERROR') });

      mockSetError.mockReset();
      AddLocationApiHook(isWaitingApi, mockSetError, mockDispatch, navigationProp, true, true, 'NSFL', 123, null);
      expect(mockSetError).toHaveBeenCalledWith({ error: false, message: '' });
    });

    it('Test EditLocationApiHook', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          status: 200,
          data: ''
        }
      };
      const failureApi: AsyncState = {
        ...defaultAsyncState,
        error: 'Server Error'
      };
      const isWaitingApi: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };

      EditLocationApiHook(successApi, mockSetError, mockDispatch, navigationProp, true, 123, mockLocation);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(navigationProp.goBack).toHaveBeenCalled();

      mockDispatch.mockReset();
      EditLocationApiHook(successApi, mockSetError, mockDispatch, navigationProp, false, 123, mockLocation);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(navigationProp.goBack).toHaveBeenCalled();

      EditLocationApiHook(failureApi, mockSetError, mockDispatch, navigationProp, true, 123, mockLocation);
      expect(mockSetError).toHaveBeenCalledWith({ error: true, message: strings('LOCATION.EDIT_LOCATION_API_ERROR') });

      mockSetError.mockReset();
      EditLocationApiHook(isWaitingApi, mockSetError, mockDispatch, navigationProp, true, 123, null);
      expect(mockSetError).toHaveBeenCalledWith({ error: false, message: '' });
    });

    it('Tests ValidateSessionCallResponse', () => {
      const mockFloorLocations = mockItemDetails[123].location.floor || [];
      // Different Location Name
      onValidateSessionCallResponse(
        'Falseloc4-4', mockSetError, mockFloorLocations, '123', mockDispatch, mockTrackEvent, null
      );
      expect(mockDispatch).toBeCalledTimes(1);
      // Same Location Name
      onValidateSessionCallResponse(
        mockFloorLocations[0].locationName, mockSetError, mockFloorLocations, '123', mockDispatch, mockTrackEvent, null
      );
      expect(mockTrackEvent).toBeCalledTimes(1);
      expect(mockSetError).toHaveBeenCalledWith({ error: true, message: strings('LOCATION.ADD_DUPLICATE_ERROR') });

      mockDispatch.mockReset();
      mockSetError.mockReset();
      mockTrackEvent.mockReset();
      // selectedLocation is Truthy
      onValidateSessionCallResponse(
        'Falseloc4-4', mockSetError, mockFloorLocations, '123', mockDispatch, mockTrackEvent, mockLocation
      );
      expect(mockDispatch).toBeCalledTimes(1);

      onValidateSessionCallResponse(
        mockFloorLocations[0].locationName, mockSetError, mockFloorLocations,
        '123', mockDispatch, mockTrackEvent, mockLocation
      );
      expect(mockTrackEvent).toBeCalledTimes(1);
      expect(mockSetError).toHaveBeenCalledWith({ error: true, message: strings('LOCATION.EDIT_DUPLICATE_ERROR') });
    });

    it('Tests BarcodeEmitterResponse', () => {
      const mockSetLoc = jest.fn();
      const mockSetScanType = jest.fn();
      const mockScan = {
        type: 'manual',
        value: '402'
      };
      onBarcodeEmitterResponse(mockSetLoc, mockSetScanType, navigationProp, mockDispatch, mockTrackEvent, mockScan);
      expect(mockTrackEvent).toHaveBeenCalled();
      expect(navigationProp.isFocused).toHaveBeenCalled();
      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockSetLoc).toHaveBeenCalledWith(mockScan.value);

      mockDispatch.mockReset();
      mockScan.type = 'LABEL-TYPE-UPCA';
      onBarcodeEmitterResponse(mockSetLoc, mockSetScanType, navigationProp, mockDispatch, mockTrackEvent, mockScan);
      expect(mockTrackEvent).toHaveBeenCalled();
      expect(navigationProp.isFocused).toHaveBeenCalled();
      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockSetLoc).toHaveBeenCalledWith(mockScan.value);
      expect(mockSetScanType).toHaveBeenCalledWith(mockScan.type);

      mockDispatch.mockReset();
      mockScan.type = 'CODE-128';
      onBarcodeEmitterResponse(mockSetLoc, mockSetScanType, navigationProp, mockDispatch, mockTrackEvent, mockScan);
      expect(mockTrackEvent).toHaveBeenCalled();
      expect(mockDispatch).toBeCalledTimes(1);
    });

    it('Test SelectLocation Buttons', () => {
      const mockValidateSession = jest.fn(() => Promise.resolve());
      const { getByTestId } = render(
        <SelectLocationTypeScreen
          inputLocation={false}
          setInputLocation={jest.fn()}
          loc="Test1-1"
          setLoc={jest.fn()}
          scanType=""
          setScanType={jest.fn()}
          error={defaultError}
          setError={jest.fn()}
          addAPI={defaultAsyncState}
          editAPI={defaultAsyncState}
          floorLocations={[]}
          itemNbr={defaultItemNbr}
          upcNbr={defaultUpcNbr}
          exceptionType={defaultExceptionType}
          actionCompleted={false}
          navigation={navigationProp}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={mockValidateSession}
          selectedLocation={null}
          salesFloor={true}
        />
      );
      const submitButton = getByTestId('submit');
      const manualButton = getByTestId('manual');

      fireEvent.press(submitButton);
      fireEvent.press(manualButton);
      expect(mockValidateSession).toHaveBeenCalledWith(navigationProp);
      expect(mockValidateSession).toHaveBeenCalledTimes(2);
    });

    it('Tests isNotActionCompleted function', () => {
      isNotActionCompleted(false, mockDispatch, 'NSFL');
      expect(mockDispatch).toHaveBeenCalled();
    });

    it('Tests scanUPCAHook function', () => {
      const mockOnSubmit = jest.fn();
      const mockSetScanType = jest.fn();
      scanUPCAHook('LABEL-TYPE-UPCA', mockOnSubmit, mockSetScanType);
      expect(mockOnSubmit).toHaveBeenCalled();
      expect(mockSetScanType).toHaveBeenCalledWith('');
    });
  });
});
