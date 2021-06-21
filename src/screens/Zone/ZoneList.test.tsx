import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { ZoneScreen } from './ZoneList';
import { Zones } from '../../mockData/zoneDetails';
import { ZoneItem } from '../../models/ZoneItem';

describe('Test Zone List', () => {
  it('Renders Zone Screen', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(<ZoneScreen zoneList={Zones} siteId={5522} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('Test Zone List with empty list', () => {
  const emptyZoneList: ZoneItem[] = [];
  it('Renders empty Zone Screen', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(<ZoneScreen zoneList={emptyZoneList} siteId={5522} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
