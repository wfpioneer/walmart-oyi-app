import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import ShallowRenderer from 'react-test-renderer/shallow';
import { CREATE_FLOW, PossibleZone } from '../../models/LocationItems';
import { AsyncState } from '../../models/AsyncState';
import {
  AddSectionScreen,
  activityModalEffect,
  createAisleSectionsEffect,
  createSectionsAPIEffect,
  validateNumericInput,
  validateSectionCounts
} from './AddSection';
import { ZoneAislesSectionResponse } from '../../models/CreateZoneAisleSection.d';

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
const defaultCreateZoneAisleSectionApi: AsyncState = {
  value: null,
  error: null,
  isWaiting: false,
  result: null
};
const createZoneAisleSectionSuccessApi: AsyncState = {
  value: {},
  error: null,
  isWaiting: false,
  result: {
    data: {
      aisles: [{
        aisleId: 1,
        aisleName: 'Name',
        createdSectionsResponseDto: {
          aisleId: 1,
          status: 200,
          message: 'string',
          createdSections: ['123', '456']
        }
      }],
      status: 200,
      zoneId: 35391,
      zoneName: 'PHAR'
    }
  }
};
const createZoneAisleSectionPartialSuccessApi: AsyncState = {
  value: {},
  error: null,
  isWaiting: false,
  result: {
    data: {
      aisles: [{
        aisleId: 1,
        aisleName: 'Name',
        createdSectionsResponseDto: {
          aisleId: 1,
          status: 200,
          message: 'string',
          createdSections: ['123', '456']
        }
      }],
      status: 207,
      zoneId: 35391,
      zoneName: 'PHAR'
    }
  }
};
const createZoneAislesSectionWaitingApi: AsyncState = {
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
const aisleWithInvilidSectionCount = [
  {
    aisleName: 1,
    sectionCount: 100
  }
];
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
const activityModalShowing = {
  showModal: false,
  showActivity: true,
  content: null
};
const activityModalHidden = {
  showModal: false,
  showActivity: false,
  content: null
};
describe('AddSection Screen render tests', () => {
  const existingAisleToCreate = [
    {
      aisleName: '1',
      sectionCount: 4
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
  const posssibleZones: PossibleZone[] = [
    { zoneName: 'A', description: 'TestA' },
    { zoneName: 'B', description: 'TestB' }
  ]
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
      createSectionsAPI={defaultCreateSectionsAPI}
      createSectionsAPIStart={0}
      setCreateSectionsAPIStart={jest.fn()}
      useEffectHook={jest.fn()}
      possibleZones={posssibleZones}
      createZoneAPI={defaultCreateZoneAisleSectionApi}
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
      createSectionsAPI={defaultCreateSectionsAPI}
      createSectionsAPIStart={0}
      setCreateSectionsAPIStart={jest.fn()}
      useEffectHook={jest.fn()}
      possibleZones={posssibleZones}
      createZoneAPI={defaultCreateZoneAisleSectionApi}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('AddSectionScreen with valid input from add section', () => {
    renderer.render(<AddSectionScreen
      aislesToCreate={existingAisleToCreate}
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
      createSectionsAPI={defaultCreateSectionsAPI}
      createSectionsAPIStart={0}
      setCreateSectionsAPIStart={jest.fn()}
      useEffectHook={jest.fn()}
      possibleZones={posssibleZones}
      createZoneAPI={defaultCreateZoneAisleSectionApi}
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
      createSectionsAPI={defaultCreateSectionsAPI}
      createSectionsAPIStart={0}
      setCreateSectionsAPIStart={jest.fn()}
      useEffectHook={jest.fn()}
      possibleZones={posssibleZones}
      createZoneAPI={defaultCreateZoneAisleSectionApi}
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
      createAislesApiStart={0}
      setCreateAislesApiStart={jest.fn()}
      createSectionsAPI={defaultCreateSectionsAPI}
      createSectionsAPIStart={0}
      setCreateSectionsAPIStart={jest.fn()}
      modal={{ showActivity: false }}
      navigation={navigationProp}
      useEffectHook={jest.fn()}
      possibleZones={posssibleZones}
      createZoneAPI={defaultCreateZoneAisleSectionApi}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('addSectionScreen while waiting for api to finish', () => {
    renderer.render(<AddSectionScreen
      aislesToCreate={existingAisleToCreate}
      selectedZone={currentZone}
      newZone={selectedZone}
      createFlow={CREATE_FLOW.CREATE_SECTION}
      dispatch={jest.fn()}
      existingSections={defaultExistingSections}
      currentAisle={currentAisle}
      createAislesApi={createAislesSectionWaitingApi}
      createAislesApiStart={0}
      setCreateAislesApiStart={jest.fn()}
      createSectionsAPI={createSectionsAPIWaiting}
      createSectionsAPIStart={0}
      setCreateSectionsAPIStart={jest.fn()}
      navigation={navigationProp}
      modal={{ showActivity: false }}
      useEffectHook={jest.fn()}
      possibleZones={posssibleZones}
      createZoneAPI={defaultCreateZoneAisleSectionApi}
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
      createAislesApiStart={0}
      setCreateAislesApiStart={jest.fn()}
      createSectionsAPI={defaultCreateSectionsAPI}
      createSectionsAPIStart={0}
      setCreateSectionsAPIStart={jest.fn()}
      modal={{ showActivity: false }}
      navigation={navigationProp}
      useEffectHook={jest.fn()}
      possibleZones={posssibleZones}
      createZoneAPI={defaultCreateZoneAisleSectionApi}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('addSectionScreen after createSections api called and successful', () => {
    renderer.render(<AddSectionScreen
      aislesToCreate={existingAisleToCreate}
      selectedZone={currentZone}
      newZone={selectedZone}
      createFlow={CREATE_FLOW.CREATE_SECTION}
      dispatch={jest.fn()}
      existingSections={defaultExistingSections}
      currentAisle={currentAisle}
      createAislesApi={createAisleSectionSuccessApi}
      createAislesApiStart={0}
      setCreateAislesApiStart={jest.fn()}
      createSectionsAPI={createSectionsAPISuccess}
      createSectionsAPIStart={0}
      setCreateSectionsAPIStart={jest.fn()}
      navigation={navigationProp}
      modal={{ showActivity: false }}
      useEffectHook={jest.fn()}
      possibleZones={posssibleZones}
      createZoneAPI={defaultCreateZoneAisleSectionApi}
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
      createAislesApiStart={0}
      setCreateAislesApiStart={jest.fn()}
      createSectionsAPI={defaultCreateSectionsAPI}
      createSectionsAPIStart={0}
      setCreateSectionsAPIStart={jest.fn()}
      modal={{ showActivity: false }}
      navigation={navigationProp}
      useEffectHook={jest.fn()}
      possibleZones={posssibleZones}
      createZoneAPI={defaultCreateZoneAisleSectionApi}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('addSectionScreen after createSections api called and failed', () => {
    renderer.render(<AddSectionScreen
      aislesToCreate={existingAisleToCreate}
      selectedZone={currentZone}
      newZone={selectedZone}
      createFlow={CREATE_FLOW.CREATE_SECTION}
      dispatch={jest.fn()}
      existingSections={defaultExistingSections}
      currentAisle={currentAisle}
      createAislesApi={createAislesSectionWaitingApi}
      createAislesApiStart={0}
      setCreateAislesApiStart={jest.fn()}
      createSectionsAPI={createSectionsAPIFailure}
      createSectionsAPIStart={0}
      setCreateSectionsAPIStart={jest.fn()}
      navigation={navigationProp}
      modal={{ showActivity: false }}
      useEffectHook={jest.fn()}
      possibleZones={posssibleZones}
      createZoneAPI={defaultCreateZoneAisleSectionApi}
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
      createAislesApiStart={0}
      setCreateAislesApiStart={jest.fn()}
      createSectionsAPI={defaultCreateSectionsAPI}
      createSectionsAPIStart={0}
      setCreateSectionsAPIStart={jest.fn()}
      modal={{ showActivity: false }}
      navigation={navigationProp}
      useEffectHook={jest.fn()}
      possibleZones={posssibleZones}
      createZoneAPI={defaultCreateZoneAisleSectionApi}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Waits on the create zone/aisles/sections api', () => {
    renderer.render(<AddSectionScreen
      aislesToCreate={aisleWithInvilidSectionCount}
      selectedZone={currentZone}
      newZone={selectedZone}
      createFlow={CREATE_FLOW.CREATE_ZONE}
      dispatch={jest.fn()}
      existingSections={defaultExistingSections}
      currentAisle={currentAisle}
      createAislesApi={defaultCreateAisleSectionApi}
      createAislesApiStart={0}
      setCreateAislesApiStart={jest.fn()}
      createSectionsAPI={defaultCreateSectionsAPI}
      createSectionsAPIStart={0}
      setCreateSectionsAPIStart={jest.fn()}
      modal={{ showActivity: false }}
      navigation={navigationProp}
      useEffectHook={jest.fn()}
      possibleZones={posssibleZones}
      createZoneAPI={createZoneAislesSectionWaitingApi}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('succeeded on the create zone/aisles/sections api', () => {
    renderer.render(<AddSectionScreen
      aislesToCreate={aisleWithInvilidSectionCount}
      selectedZone={currentZone}
      newZone={selectedZone}
      createFlow={CREATE_FLOW.CREATE_ZONE}
      dispatch={jest.fn()}
      existingSections={defaultExistingSections}
      currentAisle={currentAisle}
      createAislesApi={defaultCreateAisleSectionApi}
      createAislesApiStart={0}
      setCreateAislesApiStart={jest.fn()}
      createSectionsAPI={defaultCreateSectionsAPI}
      createSectionsAPIStart={0}
      setCreateSectionsAPIStart={jest.fn()}
      modal={{ showActivity: false }}
      navigation={navigationProp}
      useEffectHook={jest.fn()}
      possibleZones={posssibleZones}
      createZoneAPI={createZoneAisleSectionSuccessApi}
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
      createAislesApi={defaultCreateAisleSectionApi}
      createAislesApiStart={0}
      setCreateAislesApiStart={jest.fn()}
      createSectionsAPI={defaultCreateSectionsAPI}
      createSectionsAPIStart={0}
      setCreateSectionsAPIStart={jest.fn()}
      modal={{ showActivity: false }}
      navigation={navigationProp}
      useEffectHook={jest.fn()}
      possibleZones={posssibleZones}
      createZoneAPI={createZoneAisleSectionPartialSuccessApi}
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

  it('verifies that activity modal works with aisle creation', () => {
    const mockDispatch = jest.fn();
    // @ts-ignore
    navigationProp = { isFocused: () => true };

    // service call start
    activityModalEffect(
      navigationProp, activityModalHidden, createAislesSectionWaitingApi, defaultCreateSectionsAPI, mockDispatch, defaultCreateZoneAisleSectionApi
    );
    expect(mockDispatch).toBeCalledTimes(1);
    mockDispatch.mockClear();

    // service call in progress
    activityModalEffect(
      navigationProp, activityModalShowing, createAislesSectionWaitingApi, defaultCreateSectionsAPI, mockDispatch, defaultCreateZoneAisleSectionApi
    );
    expect(mockDispatch).toBeCalledTimes(0);
    mockDispatch.mockClear();

    // service call end
    activityModalEffect(
      navigationProp, activityModalShowing, createAisleSectionSuccessApi, defaultCreateSectionsAPI, mockDispatch, defaultCreateZoneAisleSectionApi
    );
    expect(mockDispatch).toBeCalledTimes(1);
    mockDispatch.mockClear();

    // no service call
    activityModalEffect(
      navigationProp, activityModalHidden, defaultCreateAisleSectionApi, defaultCreateSectionsAPI, mockDispatch, defaultCreateZoneAisleSectionApi
    );
    expect(mockDispatch).toBeCalledTimes(0);
  });

  it('verifies that activity modal works with section creation', () => {
    const mockDispatch = jest.fn();
    // @ts-ignore
    navigationProp = { isFocused: () => true };

    // service call start
    activityModalEffect(
      navigationProp, activityModalHidden, defaultCreateAisleSectionApi, createSectionsAPIWaiting, mockDispatch, defaultCreateZoneAisleSectionApi
    );
    expect(mockDispatch).toBeCalledTimes(1);
    mockDispatch.mockClear();

    // service call in progress
    activityModalEffect(
      navigationProp, activityModalShowing, defaultCreateAisleSectionApi, createSectionsAPIWaiting, mockDispatch, defaultCreateZoneAisleSectionApi
    );
    expect(mockDispatch).toBeCalledTimes(0);
    mockDispatch.mockClear();

    // service call end
    activityModalEffect(
      navigationProp, activityModalShowing, defaultCreateAisleSectionApi, createSectionsAPISuccess, mockDispatch, defaultCreateZoneAisleSectionApi
    );
    expect(mockDispatch).toBeCalledTimes(1);
    mockDispatch.mockClear();

    // no service call
    activityModalEffect(
      navigationProp, activityModalHidden, defaultCreateAisleSectionApi, defaultCreateSectionsAPI, mockDispatch, defaultCreateZoneAisleSectionApi
    );
    expect(mockDispatch).toBeCalledTimes(0);
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
    expect(mockDispatch.mock.calls.length).toBe(2);
    expect(mockGoBack.mock.calls.length).toBe(1);
    mockDispatch.mockClear();
    createSectionsAPIEffect(createSectionsAPIFailure, mockDispatch, navigationProp, 0, 0, jest.fn());
    expect(mockDispatch.mock.calls.length).toBe(1);
    mockDispatch.mockClear();
    createSectionsAPIEffect(createSectionsAPIWaiting, mockDispatch, navigationProp, 0, 0, jest.fn());
    expect(mockDispatch.mock.calls.length).toBe(0);
  });
});
