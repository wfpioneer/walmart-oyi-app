import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  SettingsToolNavigatorStack
} from './SettingsToolNavigator';

describe('SettingsTool Navigator', () => {
  it('Renders the settings tool navigator component', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <SettingsToolNavigatorStack />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
