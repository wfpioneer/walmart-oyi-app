import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp } from '@react-navigation/native';
import { AisleScreen } from './AisleList';
import { mockAisles } from '../../mockData/aisleDetails';
import { AisleItem } from '../../models/LocationItems';

let navigationProp: NavigationProp<any>;
const emptyData : AisleItem[] = [];

describe('Test Aisle List', () => {
  it('Renders Aisle Screen with Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <AisleScreen
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
        getMockData={emptyData}
        navigation={navigationProp}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
