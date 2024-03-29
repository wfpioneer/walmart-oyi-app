import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { LocationHeader } from './LocationHeader';
import { mockZones } from '../../mockData/zoneDetails';
import { strings } from '../../locales';

const MX_TEST_CLUB_NBR = 5522;

describe('Test Location Header in Zone Screen', () => {
  it('Renders Location Header In Zone Screen, no button', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(<LocationHeader
      location={`${strings('GENERICS.CLUB')} ${MX_TEST_CLUB_NBR}`}
      details={`${mockZones.length} ${strings('LOCATION.ZONES')}`}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders Location header with button', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationHeader
        location="yes"
        details="no"
        buttonPress={() => {}}
        buttonText="i is button"
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
