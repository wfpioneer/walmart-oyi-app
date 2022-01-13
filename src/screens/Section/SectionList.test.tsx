import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp, Route } from '@react-navigation/native';
import { AsyncState } from '../../models/AsyncState';
import {
  ClearItemsModal,
  SectionScreen,
  clearAisleApiEffect,
  deleteAisleApiEffect,
  getSectionsApiEffect,
  handleClearModalClose,
  handleModalClose
} from './SectionList';
import { mockSections } from '../../mockData/sectionDetails';
import { ClearLocationTarget } from '../../models/Location';

let navigationProp: NavigationProp<any>;
let routeProp: Route<any>;
const AISLE_ID = 1;
const AISLE_NAME = '1';
const ZONE_NAME = 'CARN';

const defaultAsyncState: AsyncState = {
  isWaiting: false,
  value: null,
  error: null,
  result: null
};

describe('Test Section List', () => {
  it('Renders Section Screen with no-section-message when getSections response is 204', () => {
    const renderer = ShallowRenderer.createRenderer();
    const getSectionsResult = {
      status: 204,
      data: ''
    };
    const getSectionEmptyResponse: AsyncState = {
      isWaiting: false,
      value: null,
      error: null,
      result: getSectionsResult
    };
    renderer.render(
      <SectionScreen
        aisleId={AISLE_ID}
        aisleName={AISLE_NAME}
        zoneName={ZONE_NAME}
        dispatch={jest.fn()}
        getAllSections={getSectionEmptyResponse}
        isManualScanEnabled={false}
        apiStart={0}
        setApiStart={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
        locationPopupVisible={false}
        displayConfirmation={false}
        setDisplayConfirmation={jest.fn()}
        deleteAisleApi={defaultAsyncState}
        deleteAisleApiStart={0}
        setDeleteAisleApiStart={jest.fn()}
        isClearAisle={false}
        clearAisleApi={defaultAsyncState}
        clearLocationTarget={ClearLocationTarget.FLOOR}
        setClearLocationTarget={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders Section Screen with Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    const getSectionResult = {
      data: mockSections,
      status: 200
    };
    const getSectionSuccess: AsyncState = {
      isWaiting: false,
      value: null,
      error: null,
      result: getSectionResult
    };
    renderer.render(
      <SectionScreen
        aisleId={AISLE_ID}
        aisleName={AISLE_NAME}
        zoneName={ZONE_NAME}
        dispatch={jest.fn()}
        getAllSections={getSectionSuccess}
        isManualScanEnabled={false}
        apiStart={0}
        setApiStart={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
        locationPopupVisible={false}
        displayConfirmation={false}
        setDisplayConfirmation={jest.fn()}
        deleteAisleApi={defaultAsyncState}
        deleteAisleApiStart={0}
        setDeleteAisleApiStart={jest.fn()}
        isClearAisle={false}
        clearAisleApi={defaultAsyncState}
        clearLocationTarget={ClearLocationTarget.FLOOR}
        setClearLocationTarget={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders Manual Scan Component when isManualScanEnabled is set to true', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(
      <SectionScreen
        aisleId={AISLE_ID}
        aisleName={AISLE_NAME}
        zoneName={ZONE_NAME}
        dispatch={jest.fn()}
        getAllSections={defaultAsyncState}
        isManualScanEnabled={true}
        apiStart={0}
        setApiStart={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
        locationPopupVisible={false}
        displayConfirmation={false}
        setDisplayConfirmation={jest.fn()}
        deleteAisleApi={defaultAsyncState}
        deleteAisleApiStart={0}
        setDeleteAisleApiStart={jest.fn()}
        isClearAisle={false}
        clearLocationTarget={ClearLocationTarget.FLOOR}
        setClearLocationTarget={jest.fn()}
        clearAisleApi={defaultAsyncState}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('Test Get Section Api Response', () => {
  const possibleErrorResults = [
    { errorType: 'timeout', message: 'timeout of 10000ms exceeded' },
    { errorType: 'network', message: 'Network Error' },
    { errorType: '400', message: 'Request Failed with status code 400' },
    { errorType: '424', message: 'Request Failed with status code 424' },
    { errorType: '500', message: 'Request Failed with status code 500' }
  ];

  possibleErrorResults.forEach(errorResult => it(`Renders Error Message when result is ${errorResult.errorType} error`,
    () => {
      const renderer = ShallowRenderer.createRenderer();
      const apiErrorResult: AsyncState = {
        value: null,
        isWaiting: false,
        error: errorResult.message,
        result: null
      };
      renderer.render(
        <SectionScreen
          aisleId={AISLE_ID}
          aisleName={AISLE_NAME}
          zoneName={ZONE_NAME}
          dispatch={jest.fn()}
          getAllSections={apiErrorResult}
          isManualScanEnabled={false}
          apiStart={0}
          setApiStart={jest.fn()}
          navigation={navigationProp}
          route={routeProp}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          locationPopupVisible={false}
          displayConfirmation={false}
          setDisplayConfirmation={jest.fn()}
          deleteAisleApi={defaultAsyncState}
          deleteAisleApiStart={0}
          setDeleteAisleApiStart={jest.fn()}
          isClearAisle={false}
          clearLocationTarget={ClearLocationTarget.FLOOR}
          setClearLocationTarget={jest.fn()}
          clearAisleApi={defaultAsyncState}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    }));

  it('Renders loading indicator when waiting for Section Api response', () => {
    const renderer = ShallowRenderer.createRenderer();
    const getSectionIsWaiting: AsyncState = {
      isWaiting: true,
      value: null,
      error: null,
      result: null
    };
    renderer.render(
      <SectionScreen
        aisleId={AISLE_ID}
        aisleName={AISLE_NAME}
        zoneName={ZONE_NAME}
        dispatch={jest.fn()}
        getAllSections={getSectionIsWaiting}
        isManualScanEnabled={false}
        apiStart={0}
        setApiStart={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
        locationPopupVisible={false}
        displayConfirmation={false}
        setDisplayConfirmation={jest.fn()}
        deleteAisleApi={defaultAsyncState}
        deleteAisleApiStart={0}
        setDeleteAisleApiStart={jest.fn()}
        isClearAisle={false}
        clearLocationTarget={ClearLocationTarget.FLOOR}
        setClearLocationTarget={jest.fn()}
        clearAisleApi={defaultAsyncState}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
describe('Rendering Remove Aisle responses', () => {
  it('Renders the waiting for response from Remove Aisle', () => {
    const renderer = ShallowRenderer.createRenderer();
    const removeAisleIsWaiting: AsyncState = {
      isWaiting: true,
      value: null,
      error: null,
      result: null
    };
    renderer.render(
      <SectionScreen
        aisleId={AISLE_ID}
        aisleName={AISLE_NAME}
        zoneName={ZONE_NAME}
        dispatch={jest.fn()}
        getAllSections={defaultAsyncState}
        isManualScanEnabled={false}
        apiStart={0}
        setApiStart={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
        locationPopupVisible={false}
        displayConfirmation={false}
        setDisplayConfirmation={jest.fn()}
        deleteAisleApi={removeAisleIsWaiting}
        deleteAisleApiStart={0}
        setDeleteAisleApiStart={jest.fn()}
        isClearAisle={false}
        clearLocationTarget={ClearLocationTarget.FLOOR}
        setClearLocationTarget={jest.fn()}
        clearAisleApi={defaultAsyncState}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Renders the success response from Remove Aisle', () => {
    const renderer = ShallowRenderer.createRenderer();
    const removeAisleResult = {
      status: 204,
      data: ''
    };
    const removeAisleSuccess: AsyncState = {
      isWaiting: false,
      value: null,
      error: null,
      result: removeAisleResult
    };
    renderer.render(
      <SectionScreen
        aisleId={AISLE_ID}
        aisleName={AISLE_NAME}
        zoneName={ZONE_NAME}
        dispatch={jest.fn()}
        getAllSections={defaultAsyncState}
        isManualScanEnabled={false}
        apiStart={0}
        setApiStart={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
        locationPopupVisible={false}
        displayConfirmation={false}
        setDisplayConfirmation={jest.fn()}
        deleteAisleApi={removeAisleSuccess}
        deleteAisleApiStart={0}
        setDeleteAisleApiStart={jest.fn()}
        isClearAisle={false}
        clearLocationTarget={ClearLocationTarget.FLOOR}
        setClearLocationTarget={jest.fn()}
        clearAisleApi={defaultAsyncState}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('Rendering clear Aisle responses', () => {
  it('Renders the preflight view of clearAisleModal', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <ClearItemsModal
        clearAisleApi={defaultAsyncState}
        clearLocationTarget={ClearLocationTarget.FLOOR}
        displayConfirmation={true}
        handleClearItems={jest.fn()}
        isClearAisle={true}
        setClearLocationTarget={jest.fn()}
        setDisplayConfirmation={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Ensures the clearAisleModal does not show when not clear aisle', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <ClearItemsModal
        clearAisleApi={defaultAsyncState}
        clearLocationTarget={ClearLocationTarget.FLOOR}
        displayConfirmation={true}
        handleClearItems={jest.fn()}
        isClearAisle={false}
        setClearLocationTarget={jest.fn()}
        setDisplayConfirmation={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the waiting for response from clear Aisle', () => {
    const renderer = ShallowRenderer.createRenderer();
    const clearAisleIsWaiting: AsyncState = {
      isWaiting: true,
      value: null,
      error: null,
      result: null
    };
    renderer.render(
      <ClearItemsModal
        clearAisleApi={clearAisleIsWaiting}
        clearLocationTarget={ClearLocationTarget.FLOOR}
        displayConfirmation={true}
        handleClearItems={jest.fn()}
        isClearAisle={true}
        setClearLocationTarget={jest.fn()}
        setDisplayConfirmation={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the success response from clear Aisle', () => {
    const renderer = ShallowRenderer.createRenderer();
    const clearAisleResult = {
      status: 204,
      data: ''
    };
    const clearAisleSuccess: AsyncState = {
      isWaiting: false,
      value: null,
      error: null,
      result: clearAisleResult
    };
    renderer.render(
      <ClearItemsModal
        clearAisleApi={clearAisleSuccess}
        clearLocationTarget={ClearLocationTarget.FLOOR}
        displayConfirmation={true}
        handleClearItems={jest.fn()}
        isClearAisle={true}
        setClearLocationTarget={jest.fn()}
        setDisplayConfirmation={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the failed response from clear aisle', () => {
    const renderer = ShallowRenderer.createRenderer();
    const clearAisleFail: AsyncState = {
      isWaiting: false,
      value: null,
      error: { status: 418, message: 'I am a tea pot' },
      result: null
    };
    renderer.render(
      <ClearItemsModal
        clearAisleApi={clearAisleFail}
        clearLocationTarget={ClearLocationTarget.FLOOR}
        displayConfirmation={true}
        handleClearItems={jest.fn()}
        isClearAisle={true}
        setClearLocationTarget={jest.fn()}
        setDisplayConfirmation={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('Section List externalized function tests', () => {
  const mockDispatch = jest.fn();

  it('tests handleModalClose', () => {
    const mockSetDisplayConfirmation = jest.fn();
    const mockSetDeleteZoneApiStart = jest.fn();

    handleModalClose(mockSetDisplayConfirmation, mockSetDeleteZoneApiStart, mockDispatch);
    expect(mockSetDisplayConfirmation).toBeCalledTimes(1);
    expect(mockSetDeleteZoneApiStart).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledTimes(1);

    mockDispatch.mockClear();
  });

  it('tests handleClearModalClose', () => {
    const mockSetDisplayConfirmation = jest.fn();

    handleClearModalClose(mockSetDisplayConfirmation, mockDispatch);
    expect(mockSetDisplayConfirmation).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledTimes(1);

    mockDispatch.mockClear();
  });

  it('tests getSectionsApiEffect, success', () => {
    const mockTrackEventCall = jest.fn();
    const successApi: AsyncState = {
      ...defaultAsyncState,
      result: {}
    };

    getSectionsApiEffect(successApi, 0, mockTrackEventCall);
    expect(mockTrackEventCall).toBeCalledTimes(1);
  });

  it('tests getSectionsApiEffect, fail', () => {
    const mockTrackEventCall = jest.fn();
    const failApi: AsyncState = {
      ...defaultAsyncState,
      error: {}
    };

    getSectionsApiEffect(failApi, 0, mockTrackEventCall);
    expect(mockTrackEventCall).toBeCalledTimes(1);
  });

  it('tests clearAisleApiEffect, success', () => {
    const mockIsFocused = jest.fn(() => true);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    navigationProp = { isFocused: mockIsFocused };
    const mockSetDisplayConfirmation = jest.fn();
    const successApi: AsyncState = {
      ...defaultAsyncState,
      result: {}
    };

    clearAisleApiEffect(mockDispatch, navigationProp, successApi, mockSetDisplayConfirmation);

    expect(mockDispatch).toBeCalledTimes(2);
    expect(mockSetDisplayConfirmation).toBeCalledTimes(1);
    expect(mockIsFocused).toBeCalledTimes(1);

    mockDispatch.mockClear();
  });

  it('tests clearAisleApiEffect, fail', () => {
    const mockIsFocused = jest.fn(() => true);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    navigationProp = { isFocused: mockIsFocused };
    const mockSetDisplayConfirmation = jest.fn();
    const successApi: AsyncState = {
      ...defaultAsyncState,
      error: {}
    };

    clearAisleApiEffect(mockDispatch, navigationProp, successApi, mockSetDisplayConfirmation);

    expect(mockDispatch).toBeCalledTimes(0);
    expect(mockSetDisplayConfirmation).toBeCalledTimes(0);
    expect(mockIsFocused).toBeCalledTimes(1);

    mockDispatch.mockClear();
  });

  it('tests deleteAisleApiEffect, success', () => {
    const mockIsFocused = jest.fn(() => true);
    const mockGoBack = jest.fn();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    navigationProp = { isFocused: mockIsFocused, goBack: mockGoBack };
    const mockSetDisplayConfirmation = jest.fn();
    const mockSetDeleteAisleApiStart = jest.fn();
    const mockTrackEventCall = jest.fn();
    const successApi: AsyncState = {
      ...defaultAsyncState,
      result: {}
    };

    deleteAisleApiEffect(
      navigationProp, successApi, 0,
      mockSetDeleteAisleApiStart,
      mockSetDisplayConfirmation,
      mockDispatch, mockTrackEventCall
    );

    expect(mockIsFocused).toBeCalledTimes(1);
    expect(mockTrackEventCall).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledTimes(2);
    expect(mockSetDisplayConfirmation).toBeCalledTimes(1);
    expect(mockSetDeleteAisleApiStart).toBeCalledTimes(1);
    expect(mockGoBack).toBeCalledTimes(1);

    mockDispatch.mockClear();
  });

  it('tests deleteAisleApiEffect, fail', () => {
    const mockIsFocused = jest.fn(() => true);
    const mockGoBack = jest.fn();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    navigationProp = { isFocused: mockIsFocused, goBack: mockGoBack };
    const mockSetDisplayConfirmation = jest.fn();
    const mockSetDeleteAisleApiStart = jest.fn();
    const mockTrackEventCall = jest.fn();
    const successApi: AsyncState = {
      ...defaultAsyncState,
      error: {}
    };

    deleteAisleApiEffect(
      navigationProp, successApi, 0,
      mockSetDeleteAisleApiStart,
      mockSetDisplayConfirmation,
      mockDispatch, mockTrackEventCall
    );

    expect(mockIsFocused).toBeCalledTimes(1);
    expect(mockTrackEventCall).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledTimes(2);
    expect(mockSetDisplayConfirmation).toBeCalledTimes(1);
    expect(mockSetDeleteAisleApiStart).toBeCalledTimes(1);
    expect(mockGoBack).toBeCalledTimes(0);

    mockDispatch.mockClear();
  });
});
