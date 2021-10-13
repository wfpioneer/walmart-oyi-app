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

const defaultAsyncState: AsyncState = {
  isWaiting: false,
  value: null,
  error: null,
  result: null
};
describe('Test Section List', () => {
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
        isManualScanEnabled={false}
        apiStart={0}
        setApiStart={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
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
      isManualScanEnabled={false}
      apiStart={0}
      setApiStart={jest.fn()}
      navigation={navigationProp}
      route={routeProp}
      useEffectHook={jest.fn()}
      trackEventCall={jest.fn()}
    />
  );
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

describe('Test Get Section Api Response', () => {
  it('Renders Section Api Error Message', () => {
    const renderer = ShallowRenderer.createRenderer();
    const getSectionResponseFailure: AsyncState = {
      isWaiting: false,
      value: null,
      error: 'Network Error',
      result: null
    };
    renderer.render(
      <SectionScreen
        aisleId={AISLE_ID}
        aisleName={AISLE_NAME}
        zoneName={ZONE_NAME}
        dispatch={jest.fn()}
        getAllSections={getSectionResponseFailure}
        isManualScanEnabled={false}
        apiStart={0}
        setApiStart={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

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
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
