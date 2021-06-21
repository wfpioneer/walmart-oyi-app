import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { mockZones } from '../../mockData/zoneDetails';
import ZoneItemCard from './ZoneItemCard';
import { ZoneItem } from '../../models/ZoneItem';

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

describe('Test Item Cards with empty list', () => {
  const emptyZoneList: ZoneItem[] = [];
  it('Should not render any cards', () => {
    const renderer = ShallowRenderer.createRenderer();
    emptyZoneList.forEach(item => renderer.render(
      <ZoneItemCard
        zoneName={item.zoneName}
        aisleCount={item.aisleCount}
      />
    ));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
