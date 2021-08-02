import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp } from '@react-navigation/native';
import { SectionScreen } from './SectionList';
import { mockSections } from '../../mockData/sectionDetails';
import { SectionItem } from '../../models/LocationItems';

let navigationProp: NavigationProp<any>;
const emptyData : SectionItem[] = [];

describe('Test Section List', () => {
  it('Renders Section Screen with Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <SectionScreen
        getMockData={mockSections}
        navigation={navigationProp}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders Section Screen with Empty Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <SectionScreen
        getMockData={emptyData}
        navigation={navigationProp}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
