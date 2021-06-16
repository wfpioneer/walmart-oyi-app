import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp } from '@react-navigation/native';
import ZoneListScreen from './ZoneList';
import { Provider } from 'react-redux';


it('Renders Zone Screen', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(<ZoneListScreen/>)
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });