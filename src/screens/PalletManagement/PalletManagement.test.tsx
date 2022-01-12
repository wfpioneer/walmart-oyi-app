import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { PalletManagementScreen } from './PalletManagement';

describe('PalletManagementScreen', () => {
  describe('Tests rendering the PalletManagement Screen', () => {
    it('Renders the PalletManagement default ', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <PalletManagementScreen
          useEffectHook={jest.fn()}
          searchText=""
          setSearchText={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
