import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp } from '@react-navigation/native';
import { AisleScreen } from './AisleList';
import { mockAisles } from '../../mockData/aisleDetails';
import { AisleItem } from '../../models/LocationItem';

const MX_TEST_CLUB_NBR = 5522;
let navigationProp: NavigationProp<any>;
const emptyData : AisleItem[] = [];

describe('Test Aisle List', () => {
  it('Renders Aisle Screen with Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <AisleScreen
        siteId={MX_TEST_CLUB_NBR}
        getMockData={mockAisles}
        navigation={navigationProp}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders Aisle Screen with Empty Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <AisleScreen
        siteId={MX_TEST_CLUB_NBR}
        getMockData={emptyData}
        navigation={navigationProp}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
