import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import ShallowRenderer from 'react-test-renderer/shallow';
import { AddZoneScreen } from './AddZone';
import { mockPossibleZones } from '../../mockData/mockPossibleZones';
import { CREATE_FLOW } from '../../models/LocationItems';

let navigationProp: NavigationProp<any>;

describe('AddZoneScreen', () => {
  const zones = [{
    zoneId: 1,
    zoneName: 'A',
    aisleCount: 1
  }];
  const defaultZone = {
    id: 0,
    name: ''
  };
  const currentZone = {
    id: 1,
    name: 'A'
  };
  const validNumberOfAisles = 1;
  const invalidNumberOfAisles = 100;
  const defaultExistingAisles = 0;
  const existingAisles = 1;
  const defaultSelectedZone = '';
  const selectedZone = 'A';
  const renderer = ShallowRenderer.createRenderer();
  it('AddZoneScreen with valid input from add zone', () => {
    renderer.render(<AddZoneScreen
      zones={zones}
      possibleZones={mockPossibleZones}
      currentZone={defaultZone}
      createFlow={CREATE_FLOW.CREATE_ZONE}
      selectedZone={defaultSelectedZone}
      setSelectedZone={jest.fn()}
      numberOfAisles={validNumberOfAisles}
      setNumberOfAisles={jest.fn()}
      existingAisles={defaultExistingAisles}
      dispatch={jest.fn()}
      navigation={navigationProp}
      useEffectHook={jest.fn()}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('AddZoneScreen with valid input from add aisle', () => {
    renderer.render(<AddZoneScreen
      zones={zones}
      possibleZones={mockPossibleZones}
      currentZone={currentZone}
      createFlow={CREATE_FLOW.CREATE_AISLE}
      selectedZone={selectedZone}
      setSelectedZone={jest.fn()}
      numberOfAisles={validNumberOfAisles}
      setNumberOfAisles={jest.fn()}
      existingAisles={existingAisles}
      dispatch={jest.fn()}
      navigation={navigationProp}
      useEffectHook={jest.fn()}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('AddZoneScreen with invalid input from add zone', () => {
    renderer.render(<AddZoneScreen
      zones={zones}
      possibleZones={mockPossibleZones}
      currentZone={defaultZone}
      createFlow={CREATE_FLOW.CREATE_ZONE}
      selectedZone={defaultSelectedZone}
      setSelectedZone={jest.fn()}
      numberOfAisles={invalidNumberOfAisles}
      setNumberOfAisles={jest.fn()}
      existingAisles={defaultExistingAisles}
      dispatch={jest.fn()}
      navigation={navigationProp}
      useEffectHook={jest.fn()}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('AddZoneScreen with invalid input from add aisle', () => {
    renderer.render(<AddZoneScreen
      zones={zones}
      possibleZones={mockPossibleZones}
      currentZone={currentZone}
      createFlow={CREATE_FLOW.CREATE_AISLE}
      selectedZone={selectedZone}
      setSelectedZone={jest.fn()}
      numberOfAisles={invalidNumberOfAisles}
      setNumberOfAisles={jest.fn()}
      existingAisles={existingAisles}
      dispatch={jest.fn()}
      navigation={navigationProp}
      useEffectHook={jest.fn()}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
