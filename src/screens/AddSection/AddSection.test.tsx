import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { AddSectionScreen } from './AddSection';
import { CREATE_FLOW } from '../../models/LocationItems';

describe('AddZoneScreen', () => {
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
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
