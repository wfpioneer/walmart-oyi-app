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

const mockSectionItem = {
  sectionId: 1,
  sectionName: 'Section G1-1',
  itemCount: 2,
  palletCount: 4
};
let navigationProp: NavigationProp<any>;

describe('Test Location Item Card', () => {
  it('Renders Location Item Card with mock Zone data', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationItemCard
        locationName={mockZoneItem.zoneName}
        locationDetails={`${mockZoneItem.aisleCount} Aisles`}
        navigator={navigationProp}
        destinationScreen="Zones"
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
        locationName={mockAisleItem.aisleName}
        locationDetails={`${mockAisleItem.sectionCount} Sections`}
        navigator={navigationProp}
        destinationScreen="Aisles"
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('Test Location Item Card', () => {
  it('Renders Location Item Card with mock Section data', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationItemCard
        locationName={mockSectionItem.sectionName}
        locationDetails={`${mockSectionItem.itemCount} items, ${mockSectionItem.palletCount} pallets`}
        navigator={navigationProp}
        destinationScreen="Sections"
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
