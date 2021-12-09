import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp } from '@react-navigation/native';
import { AddSectionScreen, createAisleSectionsEffect } from './AddSection';
import { CREATE_FLOW } from '../../models/LocationItems';
import { AsyncState } from '../../models/AsyncState';

let navigationProp: NavigationProp<any>;
const defaultCreateAisleSectionApi: AsyncState = {
  value: null,
  error: null,
  isWaiting: false,
  result: null
};
const createAislesSectionWaitingApi: AsyncState = {
  value: {},
  error: null,
  isWaiting: true,
  result: null
};
const createAisleSectionSuccessApi: AsyncState = {
  value: {},
  error: null,
  isWaiting: false,
  result: {
    data: [
      {
        aisleId: 1,
        aisleName: '1',
        status: 200
      },
      {
        aisleId: 2,
        aisleName: '2',
        status: 200
      }
    ],
    status: 200
  }
};
const createAisleSectionPartialSuccessApi: AsyncState = {
  value: {},
  error: null,
  isWaiting: false,
  result: {
    data: [
      {
        aisleId: 1,
        aisleName: '1',
        status: 200
      },
      {
        aisleName: '2',
        status: 400,
        message: 'something went oopsies'
      }
    ],
    status: 207
  }
};
const createAisleSectionFailApi: AsyncState = {
  value: {},
  error: {
    status: 400,
    message: 'something went oopsies'
  },
  isWaiting: false,
  result: null
};
describe('AddSection Screen render tests', () => {
  const aislesToCreate = [
    {
      aisleName: 1,
      sectionCount: 1
    },
    {
      aisleName: 2,
      sectionCount: 1
    },
    {
      aisleName: 3,
      sectionCount: 1
    }
  ];
  const exiistingAisleToCreate = [
    {
      aisleName: '1',
      sectionCount: 4
    }
  ];
  const aisleWithInvilidSectionCount = [
    {
      aisleName: 1,
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
      createAislesApi={defaultCreateAisleSectionApi}
      modal={{ showActivity: false }}
      navigation={navigationProp}
      createAislesApiStart={0}
      setCreateAislesApiStart={jest.fn()}
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
      createAislesApi={defaultCreateAisleSectionApi}
      modal={{ showActivity: false }}
      navigation={navigationProp}
      createAislesApiStart={0}
      setCreateAislesApiStart={jest.fn()}
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
      createAislesApi={defaultCreateAisleSectionApi}
      modal={{ showActivity: false }}
      navigation={navigationProp}
      createAislesApiStart={0}
      setCreateAislesApiStart={jest.fn()}
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
      createAislesApi={defaultCreateAisleSectionApi}
      modal={{ showActivity: false }}
      navigation={navigationProp}
      createAislesApiStart={0}
      setCreateAislesApiStart={jest.fn()}
      useEffectHook={jest.fn()}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('waits on the create aisles/sections api', () => {
    renderer.render(<AddSectionScreen
      aislesToCreate={aisleWithInvilidSectionCount}
      selectedZone={currentZone}
      newZone={selectedZone}
      createFlow={CREATE_FLOW.CREATE_ZONE}
      dispatch={jest.fn()}
      existingSections={defaultExistingSections}
      currentAisle={currentAisle}
      createAislesApi={createAislesSectionWaitingApi}
      modal={{ showActivity: false }}
      navigation={navigationProp}
      createAislesApiStart={0}
      setCreateAislesApiStart={jest.fn()}
      useEffectHook={jest.fn()}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('succeeded on the create aisles/sections api', () => {
    renderer.render(<AddSectionScreen
      aislesToCreate={aisleWithInvilidSectionCount}
      selectedZone={currentZone}
      newZone={selectedZone}
      createFlow={CREATE_FLOW.CREATE_ZONE}
      dispatch={jest.fn()}
      existingSections={defaultExistingSections}
      currentAisle={currentAisle}
      createAislesApi={createAisleSectionSuccessApi}
      modal={{ showActivity: false }}
      navigation={navigationProp}
      createAislesApiStart={0}
      setCreateAislesApiStart={jest.fn()}
      useEffectHook={jest.fn()}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('partially succeeded on the create aisles/sections api', () => {
    renderer.render(<AddSectionScreen
      aislesToCreate={aisleWithInvilidSectionCount}
      selectedZone={currentZone}
      newZone={selectedZone}
      createFlow={CREATE_FLOW.CREATE_ZONE}
      dispatch={jest.fn()}
      existingSections={defaultExistingSections}
      currentAisle={currentAisle}
      createAislesApi={createAisleSectionPartialSuccessApi}
      modal={{ showActivity: false }}
      navigation={navigationProp}
      createAislesApiStart={0}
      setCreateAislesApiStart={jest.fn()}
      useEffectHook={jest.fn()}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('failed on the create aisles/sections api', () => {
    renderer.render(<AddSectionScreen
      aislesToCreate={aisleWithInvilidSectionCount}
      selectedZone={currentZone}
      newZone={selectedZone}
      createFlow={CREATE_FLOW.CREATE_ZONE}
      dispatch={jest.fn()}
      existingSections={defaultExistingSections}
      currentAisle={currentAisle}
      createAislesApi={createAisleSectionFailApi}
      modal={{ showActivity: false }}
      navigation={navigationProp}
      createAislesApiStart={0}
      setCreateAislesApiStart={jest.fn()}
      useEffectHook={jest.fn()}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('AddSection screen externalized function tests', () => {
  it('verifies that aisle creation works on 200 response', () => {
    const mockDispatch = jest.fn();
    const mockNavigate = jest.fn();
    const mockTrackApiEvent = jest.fn();
    // we need to ignore this typescript error as the navigationProp is expecting serveral properties
    // but we only need to mock the goBack
    // @ts-ignore
    navigationProp = { navigate: mockNavigate, isFocused: () => true };
    createAisleSectionsEffect(createAisleSectionSuccessApi, mockDispatch, navigationProp, 0, mockTrackApiEvent);
    expect(mockTrackApiEvent).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledTimes(2);
    expect(mockNavigate).toBeCalledTimes(1);
  });
  it('verifies that aisle creation works on 207 response', () => {
    const mockDispatch = jest.fn();
    const mockNavigate = jest.fn();
    const mockTrackApiEvent = jest.fn();
    // ditto first ts-ignore on navigationProp
    // @ts-ignore
    navigationProp = { navigate: mockNavigate, isFocused: () => true };
    createAisleSectionsEffect(createAisleSectionPartialSuccessApi, mockDispatch, navigationProp, 0, mockTrackApiEvent);
    expect(mockTrackApiEvent).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledTimes(2);
    expect(mockNavigate).toBeCalledTimes(1);
  });
  it('verifies that aisle creation works on failed response', () => {
    const mockDispatch = jest.fn();
    const mockNavigate = jest.fn();
    const mockTrackApiEvent = jest.fn();
    // ditto first ts-ignore on navigationProp
    // @ts-ignore
    navigationProp = { navigate: mockNavigate, isFocused: () => true };
    createAisleSectionsEffect(createAisleSectionFailApi, mockDispatch, navigationProp, 0, mockTrackApiEvent);
    expect(mockTrackApiEvent).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledTimes(0);
  });
});
