import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp } from '@react-navigation/native';
import LocationItemCard from './LocationItemCard';
import { LocationType } from '../../models/LocationType';

const mockZoneItem = {
  zoneId: 1,
  zoneName: 'G - Grocery',
  aisleCount: 4
};

const mockAisleItem = {
  aisleId: 1,
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
        location={mockZoneItem.zoneName}
        locationId={mockZoneItem.zoneId}
        locationType={LocationType.ZONE}
        locationName={mockZoneItem.zoneName}
        dispatch={jest.fn()}
        locationDetails={`${mockZoneItem.aisleCount} Aisles`}
        navigator={navigationProp}
        destinationScreen={LocationType.AISLE}
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
        location={mockAisleItem.aisleName}
        locationId={mockAisleItem.aisleId}
        locationType={LocationType.AISLE}
        locationName={mockAisleItem.aisleName}
        dispatch={jest.fn()}
        locationDetails={`${mockAisleItem.sectionCount} Sections`}
        navigator={navigationProp}
        destinationScreen={LocationType.SECTION}
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
        location={mockSectionItem.sectionName}
        locationId={mockSectionItem.sectionId}
        locationType={LocationType.SECTION}
        locationName={mockSectionItem.sectionName}
        dispatch={jest.fn()}
        locationDetails={`${mockSectionItem.itemCount} Items, ${mockSectionItem.palletCount} Pallets`}
        navigator={navigationProp}
        destinationScreen={LocationType.SECTION_DETAILS}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
