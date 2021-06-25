import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { ZoneScreen } from './ZoneList';
import { mockZones } from '../../mockData/zoneDetails';
import { ZoneItem } from '../../models/ZoneItem';

const MX_TEST_CLUB_NBR = 5522;

describe('Test Zone List', () => {
  it('Renders Zone Screen', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(<ZoneScreen zoneList={mockZones} siteId={MX_TEST_CLUB_NBR} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('Test Zone List with empty list', () => {
  const emptyZoneList: ZoneItem[] = [];
  it('Renders empty Zone Screen', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(<ZoneScreen zoneList={emptyZoneList} siteId={MX_TEST_CLUB_NBR} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
