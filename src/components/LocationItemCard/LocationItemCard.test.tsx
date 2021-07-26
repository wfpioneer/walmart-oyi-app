import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp } from '@react-navigation/native';
import LocationItemCard from './LocationItemCard';

const mockZoneItem = {
  zoneId: 1,
  zoneName: 'G - Grocery',
  aisleCount: 4
};

const mockAisleItem = {
  aisleID: 1,
  aisleName: 'Aisle G1',
  sectionCount: 10
};

let navigationProp: NavigationProp<any>;

describe('Test Location Item Card', () => {
  it('Renders Location Item Card with mock Zone data', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationItemCard
        locationId={mockZoneItem.zoneId}
        locationType="Zones"
        locationName={mockZoneItem.zoneName}
        dispatch={jest.fn()}
        locationDetails={`${mockZoneItem.aisleCount} Aisles`}
        navigator={navigationProp}
        destinationScreen="Aisles"
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('Test Location Item Card', () => {
  it('Renders Location Item Card with mock Aisle data', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationItemCard
        locationId={mockAisleItem.aisleID}
        locationType="Aisles"
        locationName={mockAisleItem.aisleName}
        dispatch={jest.fn()}
        locationDetails={`${mockAisleItem.sectionCount} Sections`}
        navigator={navigationProp}
        destinationScreen="Sections"
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
