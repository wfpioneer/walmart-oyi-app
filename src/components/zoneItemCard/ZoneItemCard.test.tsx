import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { mockZones } from '../../mockData/zoneDetails';
import ZoneItemCard from './ZoneItemCard';

describe('Test Item Cards', () => {
  it('Renders Item Cards', () => {
    const renderer = ShallowRenderer.createRenderer();
    mockZones.forEach(item => renderer.render(
      <ZoneItemCard
        zoneName={item.zoneName}
        aisleCount={item.aisleCount}
      />
    ));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
