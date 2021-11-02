import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp, Route } from '@react-navigation/native';
import { AsyncState } from '../../models/AsyncState';
import { SectionScreen } from './SectionList';
import { mockSections } from '../../mockData/sectionDetails';

let navigationProp: NavigationProp<any>;
let routeProp: Route<any>;
const AISLE_ID = 1;
const AISLE_NAME = '1';
const ZONE_NAME = 'CARN';

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
        apiStart={0}
        setApiStart={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
        locationPopupVisible={false}
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
        apiStart={0}
        setApiStart={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
        locationPopupVisible={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders Section Screen with Empty Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    const getSectionResult = {
      data: {},
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
        apiStart={0}
        setApiStart={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
        locationPopupVisible={false}
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
          apiStart={0}
          setApiStart={jest.fn()}
          navigation={navigationProp}
          route={routeProp}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          locationPopupVisible={false}
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
        apiStart={0}
        setApiStart={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
        locationPopupVisible={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
