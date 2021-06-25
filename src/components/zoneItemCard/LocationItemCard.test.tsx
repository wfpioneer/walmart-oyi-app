import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import LocationItemCard from './LocationItemCard';

const mockZoneItem = {
  name: 'G - Grocery',
  aisleCount: 4
};

describe('Test Location Item Card', () => {
  it('Renders Location Item Card', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationItemCard
        locationName={mockZoneItem.name}
        locationDetails={`${mockZoneItem.aisleCount} Aisles`}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
