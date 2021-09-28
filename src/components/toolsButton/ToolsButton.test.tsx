import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ShallowRenderer from 'react-test-renderer/shallow';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';
import ToolsButton from './ToolsButton';

describe('ToolsButton Component', () => {
  let navigationProp: NavigationProp<any>;

  describe('Tests Rendering ToolsButton', () => {
    it('Renders a ToolButton', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <ToolsButton
          title={strings('LOCATION.LOCATION_MANAGEMENT')}
          destination="LocationManagement"
          navigation={navigationProp}
        >
          <MaterialCommunityIcon
            name="map-marker-outline"
            size={28}
            color={COLOR.MAIN_THEME_COLOR}
          />
        </ToolsButton>
      );

      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
