import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { LocationHeader } from './LocationHeader';
import { mockZones } from '../../mockData/zoneDetails';
import { strings } from '../../locales';

const MX_TEST_CLUB_NBR = 5522;
let navigationProp: NavigationProp<any>;
const routeProp: RouteProp<any, string> = {
  key: '',
  name: ''
};
describe('Test Location Header in Zone Screen', () => {
  it('Renders Location Header In Zone Screen, no button', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationHeader
        location={`${strings('GENERICS.CLUB')} ${MX_TEST_CLUB_NBR}`}
        details={`${mockZones.length} ${strings('LOCATION.ZONES')}`}
        navigation={navigationProp}
        route={routeProp}
        dispatch={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it("Renders Print Label button if Screen is 'SectionDetails' ", () => {
    const renderer = ShallowRenderer.createRenderer();
    const sectionRoute: RouteProp<any, string> = {
      key: '',
      name: 'SectionDetails'
    };
    renderer.render(
      <LocationHeader
        location={`${strings('GENERICS.CLUB')} ${MX_TEST_CLUB_NBR}`}
        details={`${mockZones.length} ${strings('LOCATION.ZONES')}`}
        navigation={navigationProp}
        route={sectionRoute}
        dispatch={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders Location header with button', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(<LocationHeader
      location="yes"
      details="no"
      buttonPress={() => {}}
      buttonText="i is button"
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
