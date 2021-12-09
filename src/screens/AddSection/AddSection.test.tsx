import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  AddSectionScreen,
  createSectionsAPIEffect,
  validateNumericInput,
  validateSectionCounts
} from './AddSection';
import { CREATE_FLOW } from '../../models/LocationItems';
import { AsyncState } from '../../models/AsyncState';

describe('AddZoneScreen', () => {
  let navigationProp: NavigationProp<any>;
  const aislesToCreate = [
    {
      name: 1,
      sectionCount: 1
    },
    {
      name: 2,
      sectionCount: 1
    },
    {
      name: 3,
      sectionCount: 1
    }
  ];
  const exiistingAisleToCreate = [
    {
      name: '1',
      sectionCount: 4
    }
  ];
  const aisleWithInvilidSectionCount = [
    {
      name: 1,
      sectionCount: 100
    }
  ];
  const currentZone = {
    id: 1,
    name: 'A'
  };
  const currentAisle = {
    id: 2,
    name: '1'
  };
  const defaultCreateSectionsAPI: AsyncState = {
    result: null,
    isWaiting: false,
    error: null,
    value: null
  };
  const createSectionsAPIWaiting: AsyncState = {
    result: null,
    isWaiting: true,
    error: null,
    value: [{
      aisleId: 1,
      sectionCount: 4
    }]
  };
  const createSectionsAPISuccess: AsyncState = {
    result: 'test',
    isWaiting: false,
    error: null,
    value: [{
      aisleId: 1,
      sectionCount: 4
    }]
  };
  const createSectionsAPIFailure: AsyncState = {
    result: null,
    isWaiting: false,
    error: 'test error',
    value: [{
      aisleId: 1,
      sectionCount: 4
    }]
  };
  const defaultExistingSections = 0;
  const selectedZone = 'A';
  const renderer = ShallowRenderer.createRenderer();
  it('AddSectionScreen with valid input from add zone', () => {
    renderer.render(<AddSectionScreen
      aislesToCreate={aislesToCreate}
      selectedZone={currentZone}
      newZone={selectedZone}
      createFlow={CREATE_FLOW.CREATE_ZONE}
      dispatch={jest.fn()}
      existingSections={defaultExistingSections}
      currentAisle={currentAisle}
      createSectionsAPI={defaultCreateSectionsAPI}
      createSectionsAPIStart={0}
      setCreateSectionsAPIStart={jest.fn()}
      navigation={navigationProp}
      useEffectHook={jest.fn()}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('AddSectionScreen with valid input from add aisle', () => {
    renderer.render(<AddSectionScreen
      aislesToCreate={aislesToCreate}
      selectedZone={currentZone}
      newZone={selectedZone}
      createFlow={CREATE_FLOW.CREATE_AISLE}
      dispatch={jest.fn()}
      existingSections={defaultExistingSections}
      currentAisle={currentAisle}
      createSectionsAPI={defaultCreateSectionsAPI}
      createSectionsAPIStart={0}
      setCreateSectionsAPIStart={jest.fn()}
      navigation={navigationProp}
      useEffectHook={jest.fn()}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('AddSectionScreen with valid input from add section', () => {
    renderer.render(<AddSectionScreen
      aislesToCreate={exiistingAisleToCreate}
      selectedZone={currentZone}
      newZone={selectedZone}
      createFlow={CREATE_FLOW.CREATE_SECTION}
      dispatch={jest.fn()}
      existingSections={defaultExistingSections}
      currentAisle={currentAisle}
      createSectionsAPI={defaultCreateSectionsAPI}
      createSectionsAPIStart={0}
      setCreateSectionsAPIStart={jest.fn()}
      navigation={navigationProp}
      useEffectHook={jest.fn()}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('AddSectionScreen with invalid section count', () => {
    renderer.render(<AddSectionScreen
      aislesToCreate={aisleWithInvilidSectionCount}
      selectedZone={currentZone}
      newZone={selectedZone}
      createFlow={CREATE_FLOW.CREATE_ZONE}
      dispatch={jest.fn()}
      existingSections={defaultExistingSections}
      currentAisle={currentAisle}
      createSectionsAPI={defaultCreateSectionsAPI}
      createSectionsAPIStart={0}
      setCreateSectionsAPIStart={jest.fn()}
      navigation={navigationProp}
      useEffectHook={jest.fn()}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('addSectionScreen while waiting for api to finish', () => {
    renderer.render(<AddSectionScreen
      aislesToCreate={exiistingAisleToCreate}
      selectedZone={currentZone}
      newZone={selectedZone}
      createFlow={CREATE_FLOW.CREATE_SECTION}
      dispatch={jest.fn()}
      existingSections={defaultExistingSections}
      currentAisle={currentAisle}
      createSectionsAPI={createSectionsAPIWaiting}
      createSectionsAPIStart={0}
      setCreateSectionsAPIStart={jest.fn()}
      navigation={navigationProp}
      useEffectHook={jest.fn()}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('addSectionScreen after createSections api called and successful', () => {
    renderer.render(<AddSectionScreen
      aislesToCreate={exiistingAisleToCreate}
      selectedZone={currentZone}
      newZone={selectedZone}
      createFlow={CREATE_FLOW.CREATE_SECTION}
      dispatch={jest.fn()}
      existingSections={defaultExistingSections}
      currentAisle={currentAisle}
      createSectionsAPI={createSectionsAPISuccess}
      createSectionsAPIStart={0}
      setCreateSectionsAPIStart={jest.fn()}
      navigation={navigationProp}
      useEffectHook={jest.fn()}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('addSectionScreen after createSections api called and failed', () => {
    renderer.render(<AddSectionScreen
      aislesToCreate={exiistingAisleToCreate}
      selectedZone={currentZone}
      newZone={selectedZone}
      createFlow={CREATE_FLOW.CREATE_SECTION}
      dispatch={jest.fn()}
      existingSections={defaultExistingSections}
      currentAisle={currentAisle}
      createSectionsAPI={createSectionsAPIFailure}
      createSectionsAPIStart={0}
      setCreateSectionsAPIStart={jest.fn()}
      navigation={navigationProp}
      useEffectHook={jest.fn()}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('testing functions', () => {
    const validateNumericInputValidResult = validateNumericInput(10);
    expect(validateNumericInputValidResult === true);
    const validateNumericInputInvalidResult = validateNumericInput(100);
    expect(validateNumericInputInvalidResult === false);
    const validateSectionCountsValidResult = validateSectionCounts(aislesToCreate, 0);
    expect(validateSectionCountsValidResult === true);
    const validateSectionCountsInvalidResult = validateSectionCounts(aisleWithInvilidSectionCount, 0);
    expect(validateSectionCountsInvalidResult === false);
    const mockDispatch = jest.fn();
    const mockGoBack = jest.fn();
    // we need to ignore this typescript error as the navigationProp is expecting serveral properties
    // but we only need to mock the goBack
    // @ts-ignore
    navigationProp = { goBack: mockGoBack };
    createSectionsAPIEffect(createSectionsAPISuccess, mockDispatch, navigationProp, 0, 0, jest.fn());
    expect(mockDispatch.mock.calls.length).toBe(3);
    expect(mockGoBack.mock.calls.length).toBe(1);
    mockDispatch.mockClear();
    createSectionsAPIEffect(createSectionsAPIFailure, mockDispatch, navigationProp, 0, 0, jest.fn());
    expect(mockDispatch.mock.calls.length).toBe(2);
    mockDispatch.mockClear();
    createSectionsAPIEffect(createSectionsAPIWaiting, mockDispatch, navigationProp, 0, 0, jest.fn());
    expect(mockDispatch.mock.calls.length).toBe(1);
  });
});
